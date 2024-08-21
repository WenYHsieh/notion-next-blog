import { cache } from 'react'
import { Block, Page } from './type'

const { Client } = require('@notionhq/client')
import {
  BlockObjectResponse,
  PageObjectResponse,
} from '@notionhq/client/build/src/api-endpoints'

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

// export const getBlocks = cache(async (block_id: string) => {
//   const startTime = Date.now()

//   let { results: children } = await notion.blocks.children.list({ block_id })
//   for (const child of children) {
//     const grandchildren = await getBlocks(child.id)
//     child.children = grandchildren
//   }

//   const endTime = Date.now()
//   const executionTime = endTime - startTime
//   console.log(`getBlocks execution time for ${block_id}: ${executionTime}ms`)

//   return children as Block[]
// })

// approximately 85.99% reduction in execution time
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

export const getPages = cache(
  async ({
    page_size,
    start_cursor,
  }: {
    page_size?: number
    start_cursor: string | null
  }) => {
    let { results: pages, next_cursor } = await notion.databases.query({
      database_id: process.env.DATABASE_ID,
      filter: {
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
