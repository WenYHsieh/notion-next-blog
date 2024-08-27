import { getPageByID, getPages } from '@/service/notion'
import { Block, HeadingBlock } from '@/service/type'
import { Box, Typography } from '@mui/material'
import { notFound } from 'next/navigation'
import renderBlock from '@/app/utils/renderer'
import Comment from '@/app/components/Comment'
import { Metadata } from 'next'
import { getPlainTextFromRichText } from '@/app/utils/dataProcessing'
import Outline from '@/app/components/Outline'

// upper limit: 100 pages within one request -> SSG X 100 & SSR for Other posts, but the result will be cached (React.cache) until next build
export async function generateStaticParams({
  params,
}: {
  params: { slug: string }
}) {
  const { pages } = await getPages({
    page_size: 2,
    start_cursor: null,
    slug: params.slug,
  })

  return pages.map(({ properties: { slug } }) => ({
    slug: getPlainTextFromRichText(slug.rich_text),
  }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const { pages } = await getPages({
    page_size: 2,
    start_cursor: null,
    slug: params.slug,
  })
  const title = pages[0]?.properties.Name.title[0].plain_text || 'Untitled'

  return {
    title,
  }
}

const Blog = async ({ params }: { params: { slug: string } }) => {
  const { pages } = await getPages({
    page_size: 2,
    start_cursor: null,
    slug: params.slug,
  })
  const {
    id: postID,
    properties: { Name },
  } = pages[0]
  const postTitle = Name.title[0].plain_text
  const content = await getPageByID(postID)
  if (!content) notFound()

  const outline = content.reduce(
    (acc: { text: string; level: number }[], block) => {
      if (block.type === 'heading_2') {
        acc.push({
          text: getPlainTextFromRichText(
            (block as HeadingBlock).heading_2!.rich_text,
          ),
          level: 1,
        })
      }
      if (block.type === 'heading_3') {
        acc.push({
          text: getPlainTextFromRichText(
            (block as HeadingBlock).heading_3!.rich_text,
          ),
          level: 2,
        })
      }
      return acc
    },
    [],
  )

  return (
    <Box component='article' sx={{ my: '32px' }}>
      <Box
        component='header'
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          mb: '40px',
          pb: '16px',
          borderBottom: '1px dashed gray',
        }}>
        <Typography
          variant='h1'
          component='h1'
          sx={{
            fontWeight: 'bold',
          }}>
          {postTitle}
        </Typography>
        <Outline outline={outline} />
      </Box>
      {/* <time>{create_date?.date?.start}</time> */}
      <main>
        {content.map(({ id, type, ...blockData }) => {
          return (
            <Box key={id} component='section' sx={{ m: '16px 0' }}>
              {renderBlock(type, blockData as Block)}
            </Box>
          )
        })}
        <Comment pageID={postID} />
      </main>
    </Box>
  )
}

export default Blog
