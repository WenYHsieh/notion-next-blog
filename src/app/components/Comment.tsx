'use client'

import { createComment } from '@/service/notion'
import { CreateCommentPayload, Page } from '@/service/type'
import { Box, Button, TextField } from '@mui/material'
import { useRef } from 'react'

type Props = {
  pageID: Page['id']
}

const createCommentClient = async (payload: CreateCommentPayload) => {
  const response = await fetch('/api/comments', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Failed to create comment')
  }

  return response.json()
}

const Comment = ({ pageID }: Props) => {
  const commentField = useRef<HTMLInputElement>(null)
  const handleSubmit = async () => {
    const commentText = commentField.current?.value ?? ''
    if (!commentText) return
    // console.log({ pageID, commentText: commentField.current?.value })
    await createCommentClient({ page_id: pageID, content: commentText })
  }
  return (
    <Box>
      <TextField
        multiline
        rows={4}
        fullWidth
        placeholder='Enter your comment here...'
        variant='outlined'
        sx={{ mb: 2 }}
        inputRef={commentField}
      />
      <Button variant='contained' color='primary' onClick={handleSubmit}>
        Submit
      </Button>
    </Box>
  )
}

export default Comment
