import { getPages } from '@/service/notion'
import Link from 'next/link'

const Blogs = async () => {
  const pages = await getPages()

  console.log(pages)
  return (
    <div>
      {pages?.map(({ id, properties }) => {
        console.log({ properties })
        return (
          <Link
            href={`/blogs/${id}`}
            key={id}
            style={{
              borderBottom: '1px solid white',
              padding: '10px',
            }}>
            <h1>{properties.Name.title[0].plain_text}</h1>
            <h2>{properties.summary.rich_text[0].plain_text}</h2>
            <div> {properties.create_date?.date?.start}</div>
            <div style={{ display: 'flex' }}>
              {properties.tags.multi_select.map(({ id, name, color }) => {
                return (
                  <div
                    key={id}
                    style={{ backgroundColor: color, margin: '0 5px' }}>
                    {name}
                  </div>
                )
              })}
            </div>
          </Link>
        )
      })}
    </div>
  )
}

export default Blogs
