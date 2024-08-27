import React, { Fragment } from 'react'
import {
  Typography,
  Paper,
  Divider,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  ListItem,
  ListItemText,
  List,
} from '@mui/material'
import {
  ParagraphBlock,
  BulletedListItemBlock,
  NumberedListItemBlock,
  ToggleBlock,
  HeadingBlock,
  QuoteBlock,
  CodeBlock,
  ImageBlock,
  Block,
  RichTextItem,
  TableBlock,
  TableRowBlock,
} from '../../service/type'
import { Code } from 'bright'
import { getPlainTextFromRichText } from './dataProcessing'
import ClientToggle from '../components/ClientToggle'

const getAnnotationStyle = (annotationItem: RichTextItem['annotations']) => {
  const { bold, italic, strikethrough, underline, color } = annotationItem
  return {
    fontWeight: bold ? 'bold' : 'normal',
    fontStyle: italic ? 'italic' : 'normal',
    textDecoration: strikethrough
      ? 'line-through'
      : underline
      ? 'underline'
      : 'none',
    color: color !== 'default' ? color : '#332c2c',
  }
}

const renderParagraph = (data: ParagraphBlock) => {
  return (
    <Typography variant='body1'>
      {(data.paragraph.rich_text as RichTextItem[]).map(
        (richTextItem, index: number) => {
          if (richTextItem.href) {
            return (
              <a
                target='_blank'
                rel='noopener noreferrer'
                key={index}
                href={richTextItem.href}
                style={{
                  color: 'skyblue',
                }}>
                {richTextItem.plain_text}
              </a>
            )
          }
          if (richTextItem.annotations.code) {
            return (
              <code
                key={index}
                style={{
                  backgroundColor: '#f0f0f0',
                  padding: '2px 4px',
                  borderRadius: '4px',
                  fontFamily: 'monospace',
                  fontSize: '0.9rem',
                }}>
                {richTextItem.plain_text}
              </code>
            )
          }
          return (
            <span
              key={index}
              style={getAnnotationStyle(richTextItem.annotations)}>
              {richTextItem.plain_text}
            </span>
          )
        },
      )}
    </Typography>
  )
}

const renderBulletedList = (data: BulletedListItemBlock, depth: number = 0) => {
  if (depth >= 3) return <div>exceeding max depth of 3</div>
  return (
    <li>
      {data.bulleted_list_item.rich_text.map((richTextItem, index) => {
        if (richTextItem.href) {
          return (
            <a
              key={index}
              href={richTextItem.href}
              target='_blank'
              rel='noopener noreferrer'
              style={{
                ...getAnnotationStyle(richTextItem.annotations),
              }}>
              {richTextItem.plain_text}
            </a>
          )
        }
        if (richTextItem.annotations.code) {
          return (
            <code
              key={index}
              style={{
                backgroundColor: '#f0f0f0',
                padding: '2px 4px',
                borderRadius: '4px',
                fontFamily: 'monospace',
                fontSize: '0.9rem',
                ...getAnnotationStyle(richTextItem.annotations),
              }}>
              {richTextItem.plain_text}
            </code>
          )
        }
        return (
          <span
            key={index}
            style={getAnnotationStyle(richTextItem.annotations)}>
            {richTextItem.plain_text}
          </span>
        )
      })}
      {data.children && data.children.length > 0 && (
        <ul>
          {data.children.map((child: Block) =>
            child.type === 'bulleted_list_item' ? (
              renderBulletedList(child, depth + 1)
            ) : (
              <li key={child.id}>{renderBlock(child.type, child)}</li>
            ),
          )}
        </ul>
      )}
    </li>
  )
}

const renderNumberedList = (
  data: NumberedListItemBlock[],
  depth: number = 0,
) => {
  if (depth >= 3) return <div>exceeding max depth of 3</div>
  const listStyle = depth === 0 ? 'decimal' : 'lower-alpha'

  return (
    <List sx={{ paddingLeft: depth === 0 ? '20px' : 0 }}>
      {data.map((item) => (
        <ListItem
          key={item.id}
          sx={{
            display: 'list-item',
            listStyleType: listStyle,
            p: 0,
            pl: '20px',
          }}>
          <ListItemText
            primary={
              <React.Fragment>
                {item.numbered_list_item.rich_text.map(
                  (richTextItem, index) => {
                    if (richTextItem.href) {
                      return (
                        <a
                          key={index}
                          href={richTextItem.href}
                          target='_blank'
                          rel='noopener noreferrer'
                          style={{
                            ...getAnnotationStyle(richTextItem.annotations),
                          }}>
                          {richTextItem.plain_text}
                        </a>
                      )
                    }
                    if (richTextItem.annotations.code) {
                      return (
                        <code
                          key={index}
                          style={{
                            backgroundColor: '#f0f0f0',
                            padding: '2px 4px',
                            borderRadius: '4px',
                            fontFamily: 'monospace',
                            fontSize: '0.9rem',
                            ...getAnnotationStyle(richTextItem.annotations),
                          }}>
                          {richTextItem.plain_text}
                        </code>
                      )
                    }
                    return (
                      <span
                        key={index}
                        style={getAnnotationStyle(richTextItem.annotations)}>
                        {richTextItem.plain_text}
                      </span>
                    )
                  },
                )}
              </React.Fragment>
            }
          />
          {item.children &&
            item.children.length > 0 &&
            renderNumberedList(
              item.children.filter(
                (child: Block) => child.type === 'numbered_list_item',
              ) as NumberedListItemBlock[],
              depth + 1,
            )}
        </ListItem>
      ))}
    </List>
  )
}

const renderToggle = (data: ToggleBlock) => {
  return <ClientToggle data={data} />
}

const renderTable = (data: TableBlock) => {
  return (
    <TableContainer component={Paper} sx={{ my: 2 }}>
      <Table size='small'>
        {data.table.has_column_header && (
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f0f0f0' }}>
              {(data.children[0] as TableRowBlock).table_row.cells.map(
                (cell: any[], cellIndex: number) => (
                  <TableCell key={cellIndex}>
                    {cell.map((content: any, contentIndex: number) => (
                      <Fragment key={contentIndex}>
                        {content.type === 'text' && (
                          <Typography
                            component='span'
                            sx={getAnnotationStyle(content.annotations)}>
                            {content.text.content}
                          </Typography>
                        )}
                        {content.type === 'equation' && (
                          <Typography component='span'>
                            {content.equation.expression}
                          </Typography>
                        )}
                      </Fragment>
                    ))}
                  </TableCell>
                ),
              )}
            </TableRow>
          </TableHead>
        )}
        <TableBody>
          {data.children
            .slice(data.table.has_column_header ? 1 : 0)
            .map((row: any) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                {row.table_row.cells.map((cell: any[], cellIndex: number) => (
                  <TableCell key={`${row.id}-${cellIndex}`}>
                    {cell.map((content: any, contentIndex: number) => (
                      <Fragment key={contentIndex}>
                        {content.type === 'text' && (
                          <Typography
                            component='span'
                            sx={getAnnotationStyle(content.annotations)}>
                            {content.text.content}
                          </Typography>
                        )}
                        {content.type === 'equation' && (
                          <Typography component='span'>
                            {content.equation.expression}
                          </Typography>
                        )}
                      </Fragment>
                    ))}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export const renderBlock = (type: string, data: Block) => {
  switch (type) {
    case 'paragraph':
      return renderParagraph(data as ParagraphBlock)
    case 'heading_1':
      return (
        <Typography variant='h1'>
          {getPlainTextFromRichText((data as HeadingBlock)[type]!.rich_text)}
        </Typography>
      )
    case 'heading_2':
      return (
        <Typography variant='h2' sx={{ pt: '16px' }}>
          {getPlainTextFromRichText((data as HeadingBlock)[type]!.rich_text)}
        </Typography>
      )
    case 'heading_3':
      return (
        <Typography variant='h3'>
          {getPlainTextFromRichText((data as HeadingBlock)[type]!.rich_text)}
        </Typography>
      )
    case 'divider':
      return <Divider />
    case 'quote':
      return (
        <Paper
          elevation={0}
          sx={{ borderLeft: 4, borderColor: 'gray', pl: 2, my: 2 }}>
          <Typography variant='body1' fontStyle='italic'>
            {getPlainTextFromRichText((data as QuoteBlock)[type]!.rich_text)}
          </Typography>
        </Paper>
      )
    case 'code':
      const codeData = (data as CodeBlock)[type]
      return (
        <Code
          lang={codeData.language}
          lineNumbers
          style={{ fontSize: '0.9rem' }}>
          {getPlainTextFromRichText(codeData.rich_text)}
        </Code>
      )
    case 'image':
      const imgData = (data as ImageBlock)[type]
      return (
        <Paper
          elevation={0}
          sx={{
            backgroundColor: 'transparent',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
          }}>
          <img
            src={imgData.file.url}
            alt={imgData.caption[0]?.plain_text}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
          <Typography variant='caption' color='text.secondary'>
            {imgData.caption[0]?.plain_text}
          </Typography>
        </Paper>
      )
    case 'table':
      return renderTable(data as TableBlock)
    case 'bulleted_list_item':
      return renderBulletedList(data as BulletedListItemBlock)
    case 'numbered_list_item':
      return renderNumberedList([data as NumberedListItemBlock])
    case 'toggle':
      return renderToggle(data as ToggleBlock)
    default:
      return <Typography>Unsupported block type: {type}</Typography>
  }
}

export default renderBlock
