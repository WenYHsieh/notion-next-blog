'use client'

import React, { useState } from 'react'
import { ExpandMore, ExpandLess } from '@mui/icons-material'
import { IconButton, Typography } from '@mui/material'
import { Block, ParagraphBlock, ToggleBlock } from '@/service/type'
import { getPlainTextFromRichText } from '../utils/dataProcessing'

interface ClientToggleProps {
  data: ToggleBlock
}

const ClientToggle: React.FC<ClientToggleProps> = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false)

  const renderBlock = (type: string, blockData: Block) => {
    switch (type) {
      case 'paragraph':
        return (
          <Typography variant='body1'>
            {getPlainTextFromRichText(
              (blockData as ParagraphBlock).paragraph.rich_text,
            )}
          </Typography>
        )
      default:
        return <div>Unsupported block type: {type}</div>
    }
  }

  return (
    <div
      style={{
        border: '1px solid gray',
        borderRadius: '5px',
        padding: '8px',
      }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          onClick={() => setIsOpen(!isOpen)}
          size='small'
          sx={{ mr: '8px' }}>
          {isOpen ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
        <Typography variant='body1' component='span'>
          {getPlainTextFromRichText(data.toggle.rich_text)}
        </Typography>
      </div>
      {isOpen && data.children && (
        <div style={{ marginLeft: '35px' }}>
          {data.children.map((child: Block) => (
            <div key={child.id}>{renderBlock(child.type, child)}</div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ClientToggle
