import { getPageByID } from '@/service/notion'

const Blog = async ({ params }: { params: { slug: string } }) => {
  const postID = params.slug
  const content = await getPageByID(postID)
  console.log(content)
  return (
    <div>
      {content.map(({ id, type }) => (
        <div key={id}>type :{type}</div>
      ))}
    </div>
  )
}

export default Blog
