export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const generateNoteSlug = (title: string, id: string): string => {
  const cleanSlug = slugify(title).slice(0, 50);
  const shortId = id.replace(/-/g, '').slice(0, 8);
  return `${cleanSlug}-${shortId}`;
};

interface TiptapNode {
  text?: string;
  content?: TiptapNode[];
}

export const extractTextFromContent = (node: TiptapNode): string => {
  if (!node) return '';
  if (node.text) return node.text;
  if (Array.isArray(node.content)) {
    return node.content.map(extractTextFromContent).join(' ');
  }
  return '';
};
