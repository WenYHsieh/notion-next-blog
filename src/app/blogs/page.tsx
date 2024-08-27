import { getPages } from '@/service/notion'
import { Typography } from '@mui/material'
import Link from 'next/link'
import ClientPagination from '../components/ClientPagination'
import { getPlainTextFromRichText } from '../utils/dataProcessing';

const Blogs = async ({
  searchParams,
}: {
  searchParams: { cursor?: string }
}) => {
  const cursor = searchParams.cursor || null
  const { pages, next_cursor } = await getPages({
    page_size: 2,
    start_cursor: cursor,
  })
  return (
    <>
      {' '}
      <main>
        {pages?.map(({ id, properties: {
          Name,
          summary,
          tags,
          slug,
          create_date
        } }) => {
          const slugText = getPlainTextFromRichText(slug.rich_text)
          const summaryText = getPlainTextFromRichText(summary.rich_text)
          return (
            <article
              key={id}
              style={{ borderBottom: '1px dashed gray', padding: '16px' }}>
              <Link
                href={`/blogs/${slugText}`}
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
                  {Name.title[0].plain_text}
                </Typography>
              </Link>
              <Typography variant='body1'>
                {summaryText}
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
                  {tags.multi_select.map(({ id, name, color }) => {
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
                <time>{create_date?.date?.start}</time>
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
