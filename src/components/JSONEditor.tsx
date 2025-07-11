import {useEffect, useRef, useState} from 'react';
import Editor from '@monaco-editor/react';
import {TreeView} from './TreeView';
import {formatJSON, isValidJSON, type ViewMode} from '@/lib/storage';
import {AlertCircle, CheckCircle, Code, TreePine} from 'lucide-react';
import {cn} from '@/lib/utils';

interface JSONEditorProps {
  value: string;
  onChange: (value: string) => void;
  theme: string;
  viewMode: ViewMode;
}

export function JSONEditor({value, onChange, theme, viewMode}: JSONEditorProps) {
  const [isValid, setIsValid] = useState(true);
  const editorRef = useRef<any>(null);

  // Auto-format and validate JSON
  useEffect(() => {
    const valid = isValidJSON(value);
    setIsValid(valid);
  }, [value]);

  const handleEditorChange = (newValue: string | undefined) => {
    const content = newValue || '';
    onChange(content);
  };

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;

    // Auto-format action (accessible via command palette)
    editor.addAction({
      id: 'format-json',
      label: 'Format JSON',
      run: () => {
        const formatted = formatJSON(value);
        if (formatted !== value) {
          onChange(formatted);
        }
      }
    });
  };

  const isDarkTheme = theme === 'vs-dark' || theme === 'hc-black';
  const headerBgClass = isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300';
  const headerTextClass = isDarkTheme ? 'text-gray-200' : 'text-gray-700';

  return (
    <div className="flex-1 flex flex-col border border-gray-300 rounded-lg overflow-hidden">
      {/* Status Bar */}
      <div className={cn(
        'flex items-center justify-between p-2 border-b',
        headerBgClass
      )}>
        <div className="flex items-center gap-2">
          {/* View Mode Indicator */}
          <div className="flex items-center gap-1 mr-2">
            {viewMode === 'code' ? (
              <Code className="w-4 h-4 text-blue-600"/>
            ) : (
              <TreePine className="w-4 h-4 text-green-600"/>
            )}
            <span className={cn('text-xs font-medium', headerTextClass)}>
              {viewMode === 'code' ? 'Code View' : 'Tree View'}
            </span>
          </div>

          {/* Validation Status */}
          {isValid ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-600"/>
              <span className="text-sm text-green-700">Valid JSON</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-red-600"/>
              <span className="text-sm text-red-700">Invalid JSON</span>
            </>
          )}
        </div>

        <div className={cn('text-xs', headerTextClass)}>
          {viewMode === 'code' ? (
            <span>{value.split('\n').length} lines</span>
          ) : (
            <span>{isValid && value.trim() ? 'Interactive Tree' : 'Read-only'}</span>
          )}
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1">
        {viewMode === 'code' ? (
          <Editor
            height="100%"
            defaultLanguage="json"
            value={value}
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            theme={theme}
            options={{
              minimap: {enabled: false},
              fontSize: 14,
              fontFamily: 'Menlo, Monaco, "Courier New", monospace',
              lineNumbers: 'on',
              renderLineHighlight: 'all',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              formatOnPaste: true,
              formatOnType: true,
              tabSize: 2,
              insertSpaces: true,
              wordWrap: 'on',
              bracketPairColorization: {
                enabled: true
              },
              guides: {
                indentation: true,
                bracketPairs: true
              }
            }}
          />
        ) : (
          <TreeView value={value} theme={theme}/>
        )}
      </div>
    </div>
  );
}