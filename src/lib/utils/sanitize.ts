export function sanitizeText(input: string): string {
  // Decode HTML entities FIRST, then strip tags
  let text = input
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"');

  // Strip HTML tags AFTER decoding
  text = text.replace(/<[^>]*>/g, '');

  // Normalize whitespace
  return text.replace(/\s+/g, ' ').trim();
}
