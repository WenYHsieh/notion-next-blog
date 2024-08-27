import { Box, Button, Typography } from '@mui/material'
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone'

type Props = {
  outline: { text: string; level: number }[]
}
const Outline = ({ outline }: Props) => {
  return (
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
  )
}

export default Outline
