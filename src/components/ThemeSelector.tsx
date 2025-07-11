import { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Palette, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThemeSelectorProps {
  currentTheme: string;
  onThemeChange: (theme: string) => void;
}

const themes = [
  { id: 'vs-dark', name: 'Dark', description: 'Dark theme with blue highlights' },
  { id: 'vs-light', name: 'Light', description: 'Light theme with subtle colors' },
  { id: 'hc-black', name: 'High Contrast', description: 'High contrast for accessibility' },
];

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const [open, setOpen] = useState(false);
  
  const currentThemeInfo = themes.find(theme => theme.id === currentTheme) || themes[0];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Palette className="w-4 h-4 mr-2" />
          {currentThemeInfo.name}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div>
            <h4 className="font-medium leading-none mb-2">Editor Theme</h4>
            <p className="text-sm text-gray-500">
              Choose your preferred code editor theme
            </p>
          </div>
          <div className="space-y-2">
            {themes.map((theme) => (
              <div
                key={theme.id}
                className={cn(
                  "flex items-center space-x-2 rounded-md p-2 cursor-pointer hover:bg-gray-100 transition-colors",
                  currentTheme === theme.id && "bg-blue-50 border border-blue-200"
                )}
                onClick={() => {
                  onThemeChange(theme.id);
                  setOpen(false);
                }}
              >
                <div className="flex-1">
                  <div className="font-medium text-sm">{theme.name}</div>
                  <div className="text-xs text-gray-500">{theme.description}</div>
                </div>
                {currentTheme === theme.id && (
                  <Check className="w-4 h-4 text-blue-600" />
                )}
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}