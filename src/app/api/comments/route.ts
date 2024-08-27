import { createComment } from '@/service/notion'
import { CreateCommentPayload } from '@/service/type'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as CreateCommentPayload
    const response = await createComment(payload)
    return NextResponse.json(JSON.stringify(response), { status: 200 })
  } catch (error) {
    return NextResponse.json(
      `Error creating comments: ${JSON.stringify(error)}`,
      { status: 500 },
    )
  }
}
