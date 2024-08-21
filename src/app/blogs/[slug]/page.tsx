import { getPageByID, getPages } from '@/service/notion'
import { Block, HeadingBlock } from '@/service/type'
import { Box, Button, Typography } from '@mui/material'
import { notFound } from 'next/navigation'
import renderBlock from '@/app/utils/renderer'
import { Metadata } from 'next'
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone'

// generate post at build time instead of request time
export async function generateStaticParams() {
  const { pages } = await getPages({ page_size: 10, start_cursor: null })

  return pages.map(({ id }) => ({
    slug: id,
  }))

  // return posts.map((post) => ({
  //   slug: post.id,
  // }))
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  const { pages } = await getPages({ page_size: 10, start_cursor: null })
  const post = pages.find((p) => p.id === params.slug)
  const title = post?.properties.Name.title[0].plain_text || 'Untitled'

  return {
    title,
  }
}

const Blog = async ({ params }: { params: { slug: string } }) => {
  const postID = params.slug
  const metadata = await generateMetadata({ params })
  const postTitle = metadata.title as string

  const content = await getPageByID(postID)
  if (!content) notFound()

  const outline = content.reduce(
    (acc: { text: string; level: number }[], block) => {
      if (block.type === 'heading_2') {
        acc.push({
          text: (block as HeadingBlock).heading_2!.rich_text[0].plain_text,
          level: 1,
        })
      }
      if (block.type === 'heading_3') {
        acc.push({
          text: (block as HeadingBlock).heading_3!.rich_text[0].plain_text,
          level: 2,
        })
      }
      return acc
    },
    [],
  )

  return (
    // TODO refactor outline
    // TODO render numbered list item inside the same List
    <Box component='article' sx={{ my: '32px' }}>
      <Box
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
        <Box sx={{ position: 'relative' }}>
          <Button
            variant='text'
            sx={{
              position: 'absolute',
              top: '50%',
              right: 0,
              transform: 'translateY(-50%)',
              '&:hover + .outline-box': {
                display: 'block',
              },
              color: 'gray',
            }}>
            <MenuTwoToneIcon />
          </Button>
          <Box
            className='outline-box'
            sx={{
              display: 'none',
              position: 'absolute',
              top: '-8px',
              right: '-16px',
              backgroundColor: 'white',
              boxShadow: '0px 0px 10px rgba(0,0,0,0.1)',
              padding: '16px',
              zIndex: 1000,
              '&:hover': {
                display: 'block',
              },
              width: '250px',
              maxHeight: '500px',
              overflowY: 'auto',
              borderRadius: '5px',
            }}>
            <Typography variant='h2' component='h2' sx={{ mb: '16px' }}>
              Outline
            </Typography>
            {outline.map((item, index) => (
              <Typography
                key={index}
                sx={{
                  ml: item.level === 1 ? 0 : 2,
                  mb: '8px',
                  fontSize: item.level === 1 ? '1rem' : '0.9rem',
                }}>
                {item.text}
              </Typography>
            ))}
          </Box>
        </Box>
      </Box>

      <main>
        {content.map(({ id, type, ...blockData }) => (
          <Box key={id} component='section' sx={{ m: '16px 0' }}>
            {renderBlock(type, blockData as Block)}
          </Box>
        ))}
      </main>
    </Box>
  )
}

export default Blog
