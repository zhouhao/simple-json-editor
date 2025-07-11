// Local storage utilities for JSON documents

export interface JSONDocument {
  id: string;
  name: string;
  content: string;
  lastModified: number;
}

const STORAGE_KEY = 'json-editor-documents';
const THEME_KEY = 'json-editor-theme';
const VIEW_MODE_KEY = 'json-editor-view-mode';
const MAX_DOCUMENTS = 10;

// Get all saved documents
export function getSavedDocuments(): JSONDocument[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading documents:', error);
    return [];
  }
}

// Save a document
export function saveDocument(doc: Omit<JSONDocument, 'lastModified'>): JSONDocument {
  const documents = getSavedDocuments();
  const existingIndex = documents.findIndex(d => d.id === doc.id);
  
  const savedDoc: JSONDocument = {
    ...doc,
    lastModified: Date.now()
  };
  
  if (existingIndex >= 0) {
    documents[existingIndex] = savedDoc;
  } else {
    // If we're at max capacity, remove the oldest document
    if (documents.length >= MAX_DOCUMENTS) {
      documents.sort((a, b) => a.lastModified - b.lastModified);
      documents.shift();
    }
    documents.push(savedDoc);
  }
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
    return savedDoc;
  } catch (error) {
    console.error('Error saving document:', error);
    throw error;
  }
}

// Delete a document
export function deleteDocument(id: string): void {
  const documents = getSavedDocuments().filter(d => d.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
  } catch (error) {
    console.error('Error deleting document:', error);
    throw error;
  }
}

// Get a specific document
export function getDocument(id: string): JSONDocument | null {
  const documents = getSavedDocuments();
  return documents.find(d => d.id === id) || null;
}

// Theme management
export function getTheme(): string {
  return localStorage.getItem(THEME_KEY) || 'vs-dark';
}

export function setTheme(theme: string): void {
  localStorage.setItem(THEME_KEY, theme);
}

// View mode management
export type ViewMode = 'code' | 'tree';

export function getViewMode(): ViewMode {
  const stored = localStorage.getItem(VIEW_MODE_KEY);
  return (stored === 'tree' || stored === 'code') ? stored : 'code';
}

export function setViewMode(mode: ViewMode): void {
  localStorage.setItem(VIEW_MODE_KEY, mode);
}

// JSON utilities
export function isValidJSON(str: string): boolean {
  if (str.trim() === '') return true; // Empty string is valid
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

export function formatJSON(str: string): string {
  try {
    if (str.trim() === '') return '';
    return JSON.stringify(JSON.parse(str), null, 2);
  } catch {
    return str; // Return original if invalid
  }
}

// Generate unique ID for documents
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}