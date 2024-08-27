import { RichText } from '@/service/type'

export const getPlainTextFromRichText = (richText: RichText) => {
  return richText[0].plain_text
}
