import localforage from 'localforage';
import { encrypt, decrypt } from '../utils/crypto';
import type { Document, Folder, AppSettings, User } from '../types';

// Initialize localforage
localforage.config({
  name: 'DocDraft',
  storeName: 'documents'
});

// Storage keys
const KEYS = {
  API_KEY: 'api_key',
  DOCUMENTS: 'documents',
  FOLDERS: 'folders',
  SETTINGS: 'settings',
  CURRENT_DOCUMENT: 'current_document'
};

// Default app settings
export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  fontSize: 16,
  autoSave: true,
  quickEscapeKey: 'Escape',
  presentationModeEnabled: false
};

// Storage service
export const storageService = {
  // User related methods
  async saveApiKey(apiKey: string): Promise<void> {
    const encryptedKey = encrypt(apiKey);
    await localforage.setItem(KEYS.API_KEY, encryptedKey);
  },

  async getApiKey(): Promise<string> {
    const encryptedKey = await localforage.getItem<string>(KEYS.API_KEY);
    if (!encryptedKey) return '';
    return decrypt(encryptedKey);
  },

  async hasApiKey(): Promise<boolean> {
    const key = await this.getApiKey();
    return !!key;
  },

  async clearApiKey(): Promise<void> {
    await localforage.removeItem(KEYS.API_KEY);
  },

  // Document related methods
  async saveDocuments(documents: Document[]): Promise<void> {
    await localforage.setItem(KEYS.DOCUMENTS, documents);
  },

  async getDocuments(): Promise<Document[]> {
    return await localforage.getItem<Document[]>(KEYS.DOCUMENTS) || [];
  },

  async saveDocument(document: Document): Promise<void> {
    const documents = await this.getDocuments();
    const existingIndex = documents.findIndex(doc => doc.id === document.id);

    if (existingIndex >= 0) {
      documents[existingIndex] = document;
    } else {
      documents.push(document);
    }

    await this.saveDocuments(documents);
  },

  async deleteDocument(id: string): Promise<void> {
    const documents = await this.getDocuments();
    await this.saveDocuments(documents.filter(doc => doc.id !== id));
  },

  // Folder related methods
  async saveFolders(folders: Folder[]): Promise<void> {
    await localforage.setItem(KEYS.FOLDERS, folders);
  },

  async getFolders(): Promise<Folder[]> {
    return await localforage.getItem<Folder[]>(KEYS.FOLDERS) || [];
  },

  // Settings related methods
  async saveSettings(settings: AppSettings): Promise<void> {
    await localforage.setItem(KEYS.SETTINGS, settings);
  },

  async getSettings(): Promise<AppSettings> {
    return await localforage.getItem<AppSettings>(KEYS.SETTINGS) || DEFAULT_SETTINGS;
  },

  // Current document
  async saveCurrentDocumentId(id: string | null): Promise<void> {
    await localforage.setItem(KEYS.CURRENT_DOCUMENT, id);
  },

  async getCurrentDocumentId(): Promise<string | null> {
    return await localforage.getItem<string | null>(KEYS.CURRENT_DOCUMENT);
  },

  // Clear all data
  async clearAllData(): Promise<void> {
    await localforage.clear();
  }
};
