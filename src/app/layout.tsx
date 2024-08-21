import { Box, Typography } from '@mui/material'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import ThemeRegistry from '../theme/ThemeRegistry'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Notion Blog',
  description: 'This is a blog made with Notion API and Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={inter.className}
        style={{
          width: '1080px',
          margin: '16px auto',
          backgroundColor: '#fafafade',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}>
        <ThemeRegistry>
          <Box
            component='header'
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: '40px',
            }}>
            <Link
              href='/'
              style={{
                textDecoration: 'none',
                color: 'skyblue',
                fontWeight: 'bold',
              }}>
              Notion Blog
            </Link>
            <Box sx={{ display: 'flex', gap: 4 }}>
              <Link href='/blogs' style={{ textDecoration: 'none' }}>
                <Typography
                  variant='body1'
                  color='gray'
                  sx={{
                    '&:hover': {
                      opacity: 0.8,
                    },
                    transition: 'opacity 0.6s',
                  }}>
                  Blogs
                </Typography>
              </Link>
              <Link href='/about' style={{ textDecoration: 'none' }}>
                <Typography
                  variant='body1'
                  color='gray'
                  sx={{
                    '&:hover': {
                      opacity: 0.8,
                    },
                    transition: 'opacity 0.6s',
                  }}>
                  About
                </Typography>
              </Link>
            </Box>
          </Box>
          <Box component='main' sx={{ flex: 1, mb: '72px' }}>
            {children}
          </Box>
          <Box
            component='footer'
            sx={{
              padding: '16px',
              borderTop: '1px solid #eaeaea',
              textAlign: 'center',
              color: 'gray',
              width: '1080px',
              margin: '16px auto 0 auto',
              backgroundColor: '#fafafa',
            }}>
            <Typography variant='body2'>
              © {new Date().getFullYear()} Notion Blog. All rights reserved.
            </Typography>
          </Box>
        </ThemeRegistry>
      </body>
    </html>
  )
}
