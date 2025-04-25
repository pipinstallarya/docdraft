/**
 * Generates a unique ID for documents and folders
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
};

/**
 * Formats a timestamp into a readable date string
 */
export const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

/**
 * Truncates a string to a specified length
 */
export const truncate = (str: string, length: number): string => {
  if (str.length <= length) return str;
  return `${str.substring(0, length)}...`;
};

/**
 * Extracts a title from the document content if none is provided
 */
export const extractTitleFromContent = (content: string): string => {
  // Look for markdown heading at the start
  const headingMatch = content.trim().match(/^#\s+(.+)$/m);
  if (headingMatch?.[1]) {
    return headingMatch[1].trim();
  }

  // If no heading found, take first line and clean it
  const firstLine = content.trim().split('\n')[0];
  return firstLine ? truncate(firstLine.replace(/[#*_`]/g, '').trim(), 30) : 'Untitled Document';
};

/**
 * Creates a new document with default values
 */
export const createNewDocument = (folder = 'default') => {
  return {
    id: generateId(),
    title: 'Untitled Document',
    content: '',
    createdAt: Date.now(),
    updatedAt: Date.now(),
    folder
  };
};

/**
 * Creates a new folder with default values
 */
export const createNewFolder = (name = 'New Folder') => {
  return {
    id: generateId(),
    name,
    createdAt: Date.now()
  };
};
