'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Box, Button } from '@mui/material'

export default function ClientPagination({
  nextCursor,
}: {
  nextCursor: string
}) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [prevCursor, setPrevCursor] = useState<string | null>(null)
  const [currentCursor, setCurrentCursor] = useState<string | null>(null)

  useEffect(() => {
    const cursor = searchParams.get('cursor')
    setCurrentCursor(cursor)
  }, [searchParams])

  const handleNavigation = (cursor: string | null) => {
    // Going back to the first page
    setPrevCursor(cursor === null ? null : currentCursor)
    setCurrentCursor(cursor)

    // Update prevCursor only if it's the first "Next" click
    if (prevCursor === null && cursor !== null) setPrevCursor(null)

    router.push(`${cursor === null ? '/blogs' : `/blogs?cursor=${cursor}`}`)
  }

  const showPreviousButton = searchParams.has('cursor')

  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
      <Button
        variant='text'
        onClick={() => handleNavigation(prevCursor)}
        sx={{
          visibility: showPreviousButton ? 'visible' : 'hidden',
          color: 'gray',
          transition: 'opacity 0.8s',
          '&:hover': {
            opacity: 0.8,
            backgroundColor: 'transparent',
          },
        }}>
        Previous
      </Button>
      <Button
        variant='text'
        onClick={() => handleNavigation(nextCursor)}
        sx={{
          visibility: nextCursor ? 'visible' : 'hidden',
          color: 'gray',
          transition: 'opacity 0.8s',
          '&:hover': {
            opacity: 0.8,
            backgroundColor: 'transparent',
          },
        }}>
        Next
      </Button>
    </Box>
  )
}
