type UUID = string
type ISO8601String = string

interface User {
  object: 'user'
  id: UUID
}

interface Parent {
  type: 'database_id' | 'page_id' | 'block_id'
  database_id?: UUID
  page_id?: UUID
  block_id?: UUID
}

interface RichTextAnnotations {
  bold: boolean
  italic: boolean
  strikethrough: boolean
  underline: boolean
  code: boolean
  color: string
}

interface RichTextContent {
  content: string
  link: { url: string } | null
}

interface RichTextItem {
  type: 'text'
  text: RichTextContent
  annotations: RichTextAnnotations
  plain_text: string
  href: string | null
}

type RichText = RichTextItem[]

interface CommonBlockFields {
  object: 'block'
  id: UUID
  parent: Parent
  created_time: ISO8601String
  last_edited_time: ISO8601String
  created_by: User
  last_edited_by: User
  has_children: boolean
  archived: boolean
  in_trash: boolean
  type: string
  // children: CommonBlockFields[]
}

interface ParagraphBlock extends CommonBlockFields {
  type: 'paragraph'
  paragraph: {
    rich_text: RichText
    color: string
  }
}

interface HeadingBlockContent {
  rich_text: RichText
  is_toggleable: boolean
  color: string
}

interface HeadingBlock extends CommonBlockFields {
  type: 'heading_1' | 'heading_2' | 'heading_3'
  heading_1?: HeadingBlockContent
  heading_2?: HeadingBlockContent
  heading_3?: HeadingBlockContent
}

interface BulletedListItemBlock extends CommonBlockFields {
  type: 'bulleted_list_item'
  bulleted_list_item: {
    rich_text: RichText
    color: string
  }
}

interface NumberedListItemBlock extends CommonBlockFields {
  type: 'numbered_list_item'
  numbered_list_item: {
    rich_text: RichText
    color: string
  }
}

interface ToggleBlock extends CommonBlockFields {
  type: 'toggle'
  toggle: {
    rich_text: RichText
    color: string
  }
}

interface QuoteBlock extends CommonBlockFields {
  type: 'quote'
  quote: {
    rich_text: RichText
    color: string
  }
}

interface DividerBlock extends CommonBlockFields {
  type: 'divider'
  divider: {}
}

interface CodeBlock extends CommonBlockFields {
  type: 'code'
  code: {
    caption: RichText
    rich_text: RichText
    language: string
  }
}

interface ImageBlock extends CommonBlockFields {
  type: 'image'
  image: {
    caption: RichText
    type: 'file'
    file: {
      url: string
      expiry_time: ISO8601String
    }
  }
}

interface TableBlock extends CommonBlockFields {
  type: 'table'
  table: {
    table_width: number
    has_column_header: boolean
    has_row_header: boolean
  }
}

interface TableRowBlock extends CommonBlockFields {
  type: 'table_row'
  table_row: {
    cells: RichText[]
  }
}

interface BookmarkBlock extends CommonBlockFields {
  type: 'bookmark'
  bookmark: {
    caption: RichText
    url: string
  }
}

type Block =
  | ParagraphBlock
  | HeadingBlock
  | BulletedListItemBlock
  | NumberedListItemBlock
  | ToggleBlock
  | QuoteBlock
  | DividerBlock
  | CodeBlock
  | ImageBlock
  | TableBlock
  | TableRowBlock
  | BookmarkBlock

interface PageProperties {
  tags: {
    id: string
    type: 'multi_select'
    multi_select: Array<{ id: string; name: string; color: string }>
  }
  create_date: {
    id: string
    type: 'date'
    date: { start: string; end: string | null; time_zone: string | null } | null
  }
  is_published: {
    id: string
    type: 'checkbox'
    checkbox: boolean
  }
  Name: {
    id: string
    type: 'title'
    title: RichText
  }
  summary: {
    id: string
    type: 'rich_text'
    rich_text: RichText
  }
}

interface Page {
  object: 'page'
  id: UUID
  created_time: ISO8601String
  last_edited_time: ISO8601String
  created_by: User
  last_edited_by: User
  cover: null | unknown
  icon: null | unknown
  parent: Parent
  archived: boolean
  in_trash: boolean
  properties: PageProperties
  url: string
  public_url: string | null
  children: Block[]
}

type NotionExport = Page[]

export type {
  NotionExport,
  Page,
  Block,
  RichText,
  RichTextItem,
  User,
  Parent,
  ISO8601String,
  UUID,
  PageProperties,
}
