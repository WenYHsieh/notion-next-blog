import { Box, CircularProgress, Typography } from '@mui/material'

interface LoadingProps {
  message?: string
}

export default function Loading({ message = 'Loading...' }: LoadingProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
        gap: 2,
      }}>
      <CircularProgress
        sx={{
          color: 'skyblue',
        }}
      />
      <Typography variant='body2' color='gray'>
        {message}
      </Typography>
    </Box>
  )
}
