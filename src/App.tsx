import { useState, useEffect, useCallback } from 'react';
import { JSONEditor } from '@/components/JSONEditor';
import { DocumentSelector } from '@/components/DocumentSelector';
import { ThemeSelector } from '@/components/ThemeSelector';
import { ViewToggle } from '@/components/ViewToggle';
import {
  getSavedDocuments,
  saveDocument,
  deleteDocument,
  getDocument,
  getTheme,
  setTheme,
  getViewMode,
  setViewMode,
  generateId,
  formatJSON,
  type JSONDocument,
  type ViewMode
} from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { FileText, Download, Wand2 } from 'lucide-react';

function App() {
  const [documents, setDocuments] = useState<JSONDocument[]>([]);
  const [currentDocumentId, setCurrentDocumentId] = useState<string | null>(null);
  const [currentContent, setCurrentContent] = useState('');
  const [editorTheme, setEditorTheme] = useState('vs-dark');
  const [viewMode, setViewModeState] = useState<ViewMode>('code');
  const [isLoading, setIsLoading] = useState(true);

  // Load initial data
  useEffect(() => {
    const savedDocs = getSavedDocuments();
    const savedTheme = getTheme();
    const savedViewMode = getViewMode();
    
    setDocuments(savedDocs);
    setEditorTheme(savedTheme);
    setViewModeState(savedViewMode);
    
    // Load the most recently modified document or create a new one
    if (savedDocs.length > 0) {
      const mostRecent = savedDocs.sort((a, b) => b.lastModified - a.lastModified)[0];
      setCurrentDocumentId(mostRecent.id);
      setCurrentContent(mostRecent.content);
    } else {
      // Create a default document with sample JSON
      const sampleContent = JSON.stringify({
        "name": "JSON Editor",
        "version": "1.0.0",
        "description": "A comprehensive JSON viewer, formatter, and editor",
        "features": [
          "Syntax highlighting",
          "Real-time validation",
          "Auto-formatting",
          "Local storage persistence",
          "Multiple themes",
          "Document management"
        ],
        "settings": {
          "theme": "dark",
          "autoSave": true,
          "lineNumbers": true
        }
      }, null, 2);
      
      const defaultDoc = {
        id: generateId(),
        name: 'Welcome Document',
        content: sampleContent
      };
      
      const saved = saveDocument(defaultDoc);
      setDocuments([saved]);
      setCurrentDocumentId(saved.id);
      setCurrentContent(saved.content);
    }
    
    setIsLoading(false);
  }, []);

  // Auto-save current content
  useEffect(() => {
    if (!currentDocumentId || isLoading) return;
    
    const timeoutId = setTimeout(() => {
      const currentDoc = documents.find(doc => doc.id === currentDocumentId);
      if (currentDoc && currentDoc.content !== currentContent) {
        const updatedDoc = saveDocument({
          ...currentDoc,
          content: currentContent
        });
        
        setDocuments(prev => 
          prev.map(doc => doc.id === currentDocumentId ? updatedDoc : doc)
        );
      }
    }, 500); // Auto-save after 500ms of inactivity
    
    return () => clearTimeout(timeoutId);
  }, [currentContent, currentDocumentId, documents, isLoading]);

  const handleDocumentSelect = useCallback((id: string) => {
    const doc = getDocument(id);
    if (doc) {
      setCurrentDocumentId(doc.id);
      setCurrentContent(doc.content);
    }
  }, []);

  const handleNewDocument = useCallback((name: string) => {
    const newDoc = {
      id: generateId(),
      name,
      content: '{}'
    };
    
    const saved = saveDocument(newDoc);
    setDocuments(prev => [...prev, saved]);
    setCurrentDocumentId(saved.id);
    setCurrentContent(saved.content);
  }, []);

  const handleDeleteDocument = useCallback((id: string) => {
    deleteDocument(id);
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    
    if (currentDocumentId === id) {
      const remaining = documents.filter(doc => doc.id !== id);
      if (remaining.length > 0) {
        const nextDoc = remaining[0];
        setCurrentDocumentId(nextDoc.id);
        setCurrentContent(nextDoc.content);
      } else {
        // Create a new document if no documents remain
        handleNewDocument('New Document');
      }
    }
  }, [currentDocumentId, documents, handleNewDocument]);

  const handleThemeChange = useCallback((theme: string) => {
    setTheme(theme);
    setEditorTheme(theme);
  }, []);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
    setViewModeState(mode);
  }, []);

  const handleFormatJSON = useCallback(() => {
    const formatted = formatJSON(currentContent);
    if (formatted !== currentContent) {
      setCurrentContent(formatted);
    }
  }, [currentContent]);

  const handleDownloadJSON = useCallback(() => {
    const currentDoc = documents.find(doc => doc.id === currentDocumentId);
    if (!currentDoc) return;
    
    const blob = new Blob([currentContent], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentDoc.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [currentContent, currentDocumentId, documents]);

  const currentDocument = documents.find(doc => doc.id === currentDocumentId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading JSON Editor...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">JSON Editor</h1>
                <p className="text-gray-600">Comprehensive JSON viewer, formatter, and editor</p>
              </div>
            </div>
            <ThemeSelector 
              currentTheme={editorTheme} 
              onThemeChange={handleThemeChange} 
            />
          </div>
          
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <DocumentSelector
              documents={documents}
              currentDocumentId={currentDocumentId}
              onDocumentSelect={handleDocumentSelect}
              onNewDocument={handleNewDocument}
              onDeleteDocument={handleDeleteDocument}
            />
            
            <div className="flex items-center gap-3">
              <ViewToggle
                viewMode={viewMode}
                onViewModeChange={handleViewModeChange}
                disabled={isLoading}
              />
              
              <div className="h-6 w-px bg-gray-300" />
              
              <Button 
                onClick={handleFormatJSON} 
                variant="outline" 
                size="sm"
                disabled={!currentContent.trim() || viewMode === 'tree'}
                title={viewMode === 'tree' ? 'Switch to Code View to format JSON' : 'Format JSON'}
              >
                <Wand2 className="w-4 h-4 mr-1" />
                Format
              </Button>
              
              <Button 
                onClick={handleDownloadJSON} 
                variant="outline" 
                size="sm"
                disabled={!currentContent.trim()}
              >
                <Download className="w-4 h-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden" style={{ height: 'calc(100vh - 280px)' }}>
          <div className="h-full flex flex-col">
            {currentDocument && (
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
                Editing: <span className="font-medium">{currentDocument.name}</span>
              </div>
            )}
            <JSONEditor
              value={currentContent}
              onChange={setCurrentContent}
              theme={editorTheme}
              viewMode={viewMode}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>© 2025 JSON Editor. Built with React, TypeScript, and Monaco Editor. Features code editing and interactive tree view.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
