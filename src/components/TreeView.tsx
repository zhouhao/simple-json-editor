import {useMemo, useState} from 'react';
import {Braces, ChevronDown, ChevronRight, FileText, Hash, List, Quote, Type} from 'lucide-react';
import {cn} from '@/lib/utils';

interface TreeViewProps {
  value: string;
  theme: string;
}

type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };

interface TreeNodeProps {
  data: JSONValue;
  keyName?: string;
  level: number;
  isLast?: boolean;
  theme: string;
  path: string;
}

function getValueIcon(value: JSONValue) {
  if (value === null) return <Type className="w-3 h-3 text-gray-500"/>;
  if (typeof value === 'string') return <Quote className="w-3 h-3 text-green-600"/>;
  if (typeof value === 'number') return <Hash className="w-3 h-3 text-blue-600"/>;
  if (typeof value === 'boolean') return <Type className="w-3 h-3 text-purple-600"/>;
  if (Array.isArray(value)) return <List className="w-3 h-3 text-orange-600"/>;
  if (typeof value === 'object') return <Braces className="w-3 h-3 text-indigo-600"/>;
  return <FileText className="w-3 h-3 text-gray-500"/>;
}

function getValueTypeColor(value: JSONValue): string {
  if (value === null) return 'text-gray-500';
  if (typeof value === 'string') return 'text-green-700';
  if (typeof value === 'number') return 'text-blue-700';
  if (typeof value === 'boolean') return 'text-purple-700';
  return 'text-gray-700';
}

function formatValue(value: JSONValue): string {
  if (value === null) return 'null';
  if (typeof value === 'string') return `"${value}"`;
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  return '';
}

function TreeNode({data, keyName, level, isLast, theme, path}: TreeNodeProps) {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto-expand first 2 levels

  const isExpandable = (typeof data === 'object' && data !== null);
  const isArray = Array.isArray(data);
  const isObject = typeof data === 'object' && data !== null && !isArray;

  // Calculate children count for arrays and objects
  const childrenCount = isExpandable ?
    (isArray ? data.length : Object.keys(data as object).length) : 0;

  const indent = level * 20;

  const isDarkTheme = theme === 'vs-dark' || theme === 'hc-black';
  const bgClass = isDarkTheme ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900';
  const hoverClass = isDarkTheme ? 'hover:bg-gray-800' : 'hover:bg-gray-50';
  const borderClass = isDarkTheme ? 'border-gray-700' : 'border-gray-200';

  return (
    <div className={cn('font-mono text-sm', bgClass)}>
      <div
        className={cn(
          'flex items-center py-1 px-2 cursor-pointer transition-colors',
          hoverClass,
          level > 0 && `border-l ${borderClass}`
        )}
        style={{paddingLeft: `${8 + indent}px`}}
        onClick={() => isExpandable && setIsExpanded(!isExpanded)}
      >
        {/* Expansion indicator */}
        <div className="flex items-center justify-center w-4 h-4 mr-2">
          {isExpandable ? (
            isExpanded ? (
              <ChevronDown className="w-3 h-3 text-gray-500"/>
            ) : (
              <ChevronRight className="w-3 h-3 text-gray-500"/>
            )
          ) : (
            <div className="w-3 h-3"/>
          )}
        </div>

        {/* Icon */}
        <div className="mr-2">
          {getValueIcon(data)}
        </div>

        {/* Key name */}
        {keyName && (
          <span className={cn(
            'font-medium mr-2',
            isDarkTheme ? 'text-blue-300' : 'text-blue-700'
          )}>
            {isArray ? `[${keyName}]` : `"${keyName}"`}:
          </span>
        )}

        {/* Value or type info */}
        <div className="flex items-center gap-2">
          {isExpandable ? (
            <span className={cn(
              'text-gray-500 text-xs',
              isDarkTheme ? 'text-gray-400' : 'text-gray-600'
            )}>
              {isArray ? `Array(${childrenCount})` : `Object(${childrenCount})`}
              {isExpanded ? '' : ` {...}`}
            </span>
          ) : (
            <span className={getValueTypeColor(data)}>
              {formatValue(data)}
            </span>
          )}
        </div>

        {/* Type indicator */}
        {!isExpandable && (
          <span className={cn(
            'ml-2 text-xs px-1 rounded',
            isDarkTheme ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
          )}>
            {typeof data === 'object' ? 'null' : typeof data}
          </span>
        )}
      </div>

      {/* Children */}
      {isExpandable && isExpanded && (
        <div className="relative">
          {isArray ? (
            (data as JSONValue[]).map((item, index) => (
              <TreeNode
                key={`${path}[${index}]`}
                data={item}
                keyName={String(index)}
                level={level + 1}
                isLast={index === (data as JSONValue[]).length - 1}
                theme={theme}
                path={`${path}[${index}]`}
              />
            ))
          ) : (
            Object.entries(data as { [key: string]: JSONValue }).map(([key, value], index, entries) => (
              <TreeNode
                key={`${path}.${key}`}
                data={value}
                keyName={key}
                level={level + 1}
                isLast={index === entries.length - 1}
                theme={theme}
                path={`${path}.${key}`}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

export function TreeView({value, theme}: TreeViewProps) {
  const {parsedData, isValid, error} = useMemo(() => {
    if (!value.trim()) {
      return {parsedData: null, isValid: true, error: null};
    }

    try {
      const parsed = JSON.parse(value);
      return {parsedData: parsed, isValid: true, error: null};
    } catch (err) {
      return {
        parsedData: null,
        isValid: false,
        error: err instanceof Error ? err.message : 'Invalid JSON'
      };
    }
  }, [value]);

  const isDarkTheme = theme === 'vs-dark' || theme === 'hc-black';
  const bgClass = isDarkTheme ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900';
  const borderClass = isDarkTheme ? 'border-gray-700' : 'border-gray-200';

  if (!isValid) {
    return (
      <div className={cn(
        'flex-1 flex items-center justify-center p-8',
        bgClass
      )}>
        <div className="text-center">
          <FileText className="w-12 h-12 text-red-500 mx-auto mb-4"/>
          <h3 className="text-lg font-medium mb-2">Invalid JSON</h3>
          <p className="text-sm text-gray-500 max-w-md">
            {error}
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Switch to Code View to fix syntax errors
          </p>
        </div>
      </div>
    );
  }

  if (!value.trim() || parsedData === null) {
    return (
      <div className={cn(
        'flex-1 flex items-center justify-center p-8',
        bgClass
      )}>
        <div className="text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4"/>
          <h3 className="text-lg font-medium mb-2">No JSON Content</h3>
          <p className="text-sm text-gray-500">
            Add some JSON content to see the tree view
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      'flex-1 overflow-auto',
      bgClass,
      `border ${borderClass} rounded-lg`
    )}>
      <div className="p-2">
        <TreeNode
          data={parsedData}
          level={0}
          theme={theme}
          path="root"
        />
      </div>
    </div>
  );
}