import { Button } from '@/components/ui/button';
import { Code, TreePine } from 'lucide-react';
import { type ViewMode } from '@/lib/storage';
import { cn } from '@/lib/utils';

interface ViewToggleProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  disabled?: boolean;
}

export function ViewToggle({ viewMode, onViewModeChange, disabled }: ViewToggleProps) {
  return (
    <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
      <Button
        variant={viewMode === 'code' ? 'default' : 'ghost'}
        size="sm"
        className={cn(
          'rounded-none border-none',
          viewMode === 'code' 
            ? 'bg-blue-600 text-white hover:bg-blue-700' 
            : 'bg-white text-gray-700 hover:bg-gray-50'
        )}
        onClick={() => onViewModeChange('code')}
        disabled={disabled}
      >
        <Code className="w-4 h-4 mr-1" />
        Code
      </Button>
      
      <Button
        variant={viewMode === 'tree' ? 'default' : 'ghost'}
        size="sm"
        className={cn(
          'rounded-none border-none',
          viewMode === 'tree' 
            ? 'bg-green-600 text-white hover:bg-green-700' 
            : 'bg-white text-gray-700 hover:bg-gray-50'
        )}
        onClick={() => onViewModeChange('tree')}
        disabled={disabled}
      >
        <TreePine className="w-4 h-4 mr-1" />
        Tree
      </Button>
    </div>
  );
}