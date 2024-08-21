import { getPages } from '@/service/notion'
import { Box, Button, Typography } from '@mui/material'
// import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import Link from 'next/link'
import ClientPagination from '../components/ClientPagination'

const Blogs = async ({
  searchParams,
}: {
  searchParams: { cursor?: string }
}) => {
  const cursor = searchParams.cursor || null
  console.log({ cursor })
  const { pages, next_cursor } = await getPages({
    page_size: 2,
    start_cursor: cursor,
  })
  return (
    <>
      {' '}
      <main>
        {pages?.map(({ id, properties }) => {
          return (
            <article
              key={id}
              style={{ borderBottom: '1px dashed gray', padding: '16px' }}>
              <Link
                href={`/blogs/${id}`}
                style={{
                  borderBottom: '1px solid white',
                  textDecoration: 'none',
                  color: 'black',
                }}>
                <Typography
                  variant='h1'
                  sx={{
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}>
                  {properties.Name.title[0].plain_text}
                </Typography>
              </Link>
              <Typography variant='body1'>
                {properties.summary.rich_text[0].plain_text}
              </Typography>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '8px',
                }}>
                <ul
                  style={{
                    display: 'flex',
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                  }}>
                  {properties.tags.multi_select.map(({ id, name, color }) => {
                    return (
                      <li
                        key={id}
                        style={{
                          backgroundColor: color,
                          marginRight: '5px',
                          padding: '2px 5px',
                          borderRadius: '3px',
                          opacity: 0.8,
                        }}>
                        {name}
                      </li>
                    )
                  })}
                </ul>
                <time>{properties.create_date?.date?.start}</time>
              </div>
            </article>
          )
        })}
      </main>
      <ClientPagination nextCursor={next_cursor} />
    </>
  )
}

export default Blogs
