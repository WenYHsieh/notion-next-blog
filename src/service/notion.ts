import { cache } from 'react'
import { Block, CreateCommentPayload, Page } from './type'
const { Client } = require('@notionhq/client')

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

// Recursively retrieve all blocks of a page
export const getBlocks = cache(
  // Depth limitation
  async (block_id: string, depth: number = 0, maxDepth: number = 3) => {
    if (depth >= maxDepth) return []

    const startTime = Date.now()

    let { results: children } = await notion.blocks.children.list({ block_id })

    const childPromises = children.map(async (child: any) => {
      // Conditional fetching
      if (child.has_children) {
        child.children = await getBlocks(child.id, depth + 1, maxDepth)
      }
      return child
    })

    //Parallel fetching
    const result = (await Promise.all(childPromises)) as Block[]

    const endTime = Date.now()
    const executionTime = endTime - startTime
    console.log(
      `getBlocks execution time: ${executionTime}ms for depth ${depth}`,
    )

    console.log('Amount of blocks:', result.length)
    return result
  },
)

export const getPageByID = cache(async (pageID: string) => {
  return await getBlocks(pageID)
})

// Retrieve pages list in the DB
export const getPages = cache(
  async ({
    page_size,
    start_cursor,
    slug,
  }: {
    page_size?: number
    start_cursor: string | null
    slug?: string
  }) => {
    let { results: pages, next_cursor } = await notion.databases.query({
      database_id: process.env.DATABASE_ID,
      filter: slug
        ? {
            and: [
              {
                property: 'is_published',
                checkbox: {
                  equals: true,
                },
              },
              {
                property: 'slug',
                rich_text: {
                  equals: slug,
                },
              },
            ],
          }
        : {
            property: 'is_published',
            checkbox: {
              equals: true,
            },
          },
      sorts: [
        {
          property: 'create_date',
          direction: 'descending',
        },
      ],
      ...(page_size ? { page_size } : {}),
      ...(start_cursor ? { start_cursor } : {}),
    })
    return { pages: pages as Page[], next_cursor }
  },
)

// Create comment (anonymous)
export const createComment = async (payload: CreateCommentPayload) => {
  const { page_id, content } = payload
  const response = await notion.comments.create({
    parent: { page_id },
    rich_text: [{ text: { content } }],
  })
  return response
}

// Retrieve comments of that specific block
export const getComments = async (block_id: string) => {
  const response = await notion.comments.list({ block_id })
  return response
}


