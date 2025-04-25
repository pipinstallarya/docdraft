import type { Document } from '../types';

// Check if File System Access API is available
const isFileSystemAccessSupported = () => {
  return 'showSaveFilePicker' in window && 'showOpenFilePicker' in window;
};

export const fileService = {
  /**
   * Save a document to the file system as a markdown file
   */
  async saveDocumentToFile(document: Document): Promise<boolean> {
    if (!isFileSystemAccessSupported()) {
      alert('Your browser does not support the File System Access API.');
      return false;
    }

    try {
      // Configure save file picker
      const options = {
        types: [
          {
            description: 'Markdown files',
            accept: {
              'text/markdown': ['.md'],
            },
          },
        ],
        suggestedName: `${document.title}.md`,
      };

      // Show the save file picker
      const handle = await window.showSaveFilePicker(options);

      // Create a writable stream
      const writable = await handle.createWritable();

      // Write the document content
      await writable.write(document.content);

      // Close the stream
      await writable.close();

      return true;
    } catch (error) {
      console.error('Error saving file:', error);
      return false;
    }
  },

  /**
   * Open a markdown file from the file system
   */
  async openMarkdownFile(): Promise<{ title: string, content: string } | null> {
    if (!isFileSystemAccessSupported()) {
      alert('Your browser does not support the File System Access API.');
      return null;
    }

    try {
      // Configure open file picker
      const options = {
        types: [
          {
            description: 'Markdown files',
            accept: {
              'text/markdown': ['.md'],
            },
          },
        ],
        multiple: false,
      };

      // Show the open file picker
      const [handle] = await window.showOpenFilePicker(options);

      // Get the file
      const file = await handle.getFile();

      // Get the file name without extension
      const title = file.name.replace(/\.md$/, '');

      // Read the file content
      const content = await file.text();

      return { title, content };
    } catch (error) {
      console.error('Error opening file:', error);
      return null;
    }
  }
};
