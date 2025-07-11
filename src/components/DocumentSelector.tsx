import { useState } from 'react';
import { JSONDocument } from '@/lib/storage';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, File } from 'lucide-react';

interface DocumentSelectorProps {
  documents: JSONDocument[];
  currentDocumentId: string | null;
  onDocumentSelect: (id: string) => void;
  onNewDocument: (name: string) => void;
  onDeleteDocument: (id: string) => void;
}

export function DocumentSelector({
  documents,
  currentDocumentId,
  onDocumentSelect,
  onNewDocument,
  onDeleteDocument
}: DocumentSelectorProps) {
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteDocumentId, setDeleteDocumentId] = useState<string | null>(null);
  const [newDocumentName, setNewDocumentName] = useState('');

  const currentDocument = documents.find(doc => doc.id === currentDocumentId);
  const canCreateNew = documents.length < 10;

  const handleNewDocument = () => {
    if (newDocumentName.trim()) {
      onNewDocument(newDocumentName.trim());
      setNewDocumentName('');
      setShowNewDialog(false);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteDocumentId(id);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteDocumentId) {
      onDeleteDocument(deleteDocumentId);
      setDeleteDocumentId(null);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <Select
          value={currentDocumentId || ''}
          onValueChange={onDocumentSelect}
        >
          <SelectTrigger className="min-w-[200px]">
            <SelectValue placeholder="Select a document">
              {currentDocument ? (
                <div className="flex items-center gap-2">
                  <File className="w-4 h-4" />
                  {currentDocument.name}
                </div>
              ) : (
                'Select a document'
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {documents.map((doc) => (
              <SelectItem key={doc.id} value={doc.id}>
                <div className="flex items-center justify-between w-full group">
                  <div className="flex items-center gap-2">
                    <File className="w-4 h-4" />
                    <span>{doc.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 ml-2"
                    onClick={(e) => handleDeleteClick(e, doc.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </SelectItem>
            ))}
            {documents.length === 0 && (
              <SelectItem value="" disabled>
                No documents saved
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        
        <Button
          onClick={() => setShowNewDialog(true)}
          disabled={!canCreateNew}
          size="sm"
          className="shrink-0"
        >
          <Plus className="w-4 h-4 mr-1" />
          New
        </Button>
        
        {!canCreateNew && (
          <span className="text-xs text-gray-500">Max 10 documents</span>
        )}
      </div>

      {/* New Document Dialog */}
      <AlertDialog open={showNewDialog} onOpenChange={setShowNewDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create New Document</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a name for your new JSON document.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Input
            value={newDocumentName}
            onChange={(e) => setNewDocumentName(e.target.value)}
            placeholder="Document name"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleNewDocument();
              }
            }}
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setNewDocumentName('');
              setShowNewDialog(false);
            }}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleNewDocument}
              disabled={!newDocumentName.trim()}
            >
              Create
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this document? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}