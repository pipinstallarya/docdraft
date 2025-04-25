export interface Document {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  folder: string;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: number;
}

export interface User {
  apiKey: string;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  fontSize: number;
  autoSave: boolean;
  quickEscapeKey: string;
  presentationModeEnabled: boolean;
}

export interface AppState {
  documents: Document[];
  folders: Folder[];
  currentDocumentId: string | null;
  settings: AppSettings;
}
