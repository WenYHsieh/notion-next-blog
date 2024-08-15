import { cache } from 'react'
import { Block, Page } from './type'

const { Client } = require('@notionhq/client')

// Initializing a client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
})

export const getBlocks = cache(async (block_id: string) => {
  let { results: children } = await notion.blocks.children.list({ block_id })
  for (const child of children) {
    const grandchildren = await getBlocks(child.id)
    child.children = grandchildren
  }
  return children as Block[]
})

export const getPageByID = cache(async (pageID: string) => {
  return await getBlocks(pageID)
})

export const getPages = cache(async () => {
  let { results: pages } = await notion.databases.query({
    database_id: process.env.DATABASE_ID,
  })
  return pages as Page[]
})
