'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Image as ImageIcon,
  Upload,
  X,
  Link as LinkIcon,
  Loader2,
  Check,
  Trash2,
} from 'lucide-react';

interface ImageBlockProps {
  imageUrl: string | null;
  caption: string;
  onUpdateImage: (url: string | null) => void;
  onUpdateCaption: (caption: string) => void;
  onSave: () => void;
  onDelete: () => void;
  isUnsaved: boolean;
}

export function ImageBlock({
  imageUrl,
  caption,
  onUpdateImage,
  onUpdateCaption,
  onSave,
  onDelete,
  isUnsaved,
}: ImageBlockProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlValue, setUrlValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      onUpdateImage(base64);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleUrlSubmit = () => {
    if (urlValue.trim()) {
      onUpdateImage(urlValue.trim());
      setUrlValue('');
      setShowUrlInput(false);
    }
  };

  const handleRemoveImage = () => {
    onUpdateImage(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-white">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-text-muted" />
          <h2 className="text-lg font-semibold text-text-primary">
            Image Block
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {isUnsaved && (
            <span className="text-xs text-warning">Unsaved changes</span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={onDelete}
            className="text-destructive hover:text-destructive hover:bg-destructive-light"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Button
            onClick={onSave}
            disabled={!isUnsaved}
            className={cn(
              'gap-2',
              isUnsaved
                ? 'bg-brand-green hover:bg-brand-green/90 text-white'
                : 'bg-surface text-text-muted'
            )}
          >
            Save Block
          </Button>
        </div>
      </div>

      {/* Image Area */}
      <div className="flex-1 p-6 bg-surface overflow-y-auto">
        {imageUrl ? (
          <div className="max-w-2xl mx-auto">
            <div className="relative rounded-lg overflow-hidden border border-border bg-white shadow-card">
              <img
                src={imageUrl}
                alt={caption || 'Uploaded image'}
                className="w-full h-auto"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/90 hover:bg-white rounded-full shadow-sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-text-primary mb-2">
                Caption (optional)
              </label>
              <Input
                value={caption}
                onChange={(e) => onUpdateCaption(e.target.value)}
                placeholder="Add a caption for this image..."
                className="bg-white"
              />
            </div>
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            <div
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
                'border-border hover:border-brand-green hover:bg-brand-green-light/30'
              )}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-10 h-10 text-brand-green animate-spin" />
                  <p className="text-sm text-text-secondary">Uploading...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-brand-green-light flex items-center justify-center">
                    <Upload className="w-8 h-8 text-brand-green" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      Click to upload an image
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            <div className="mt-4 flex items-center gap-2">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-text-muted">or</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {showUrlInput ? (
              <div className="mt-4 flex gap-2">
                <Input
                  value={urlValue}
                  onChange={(e) => setUrlValue(e.target.value)}
                  placeholder="Paste image URL..."
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleUrlSubmit();
                  }}
                />
                <Button
                  onClick={handleUrlSubmit}
                  disabled={!urlValue.trim()}
                  className="bg-brand-green hover:bg-brand-green/90 text-white"
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowUrlInput(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                onClick={() => setShowUrlInput(true)}
                className="mt-4 w-full gap-2"
              >
                <LinkIcon className="w-4 h-4" />
                Add image from URL
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
