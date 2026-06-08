'use client';

import { useRef, useState, type DragEvent } from 'react';
import { ImagePlus, Loader2 } from 'lucide-react';
import type { StorageService } from '@repo/core';
import { cn } from '../lib/cn';
import { useUpload } from '../hooks/use-upload';

export interface ImageUploadProps {
  storage: StorageService;
  pathFor: (file: File) => string;
  /** Called with the public URL once upload finishes. */
  onUploaded: (url: string, path: string) => void;
  /** Existing image to preview initially. */
  value?: string | null;
  maxSizeMb?: number;
  className?: string;
}

const ACCEPT = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

/**
 * Drag-and-drop image upload with preview + progress. Backend-agnostic via
 * StorageService. NEVER write upload logic by hand — use this. See docs/RECIPES.md
 * ("Image upload").
 */
export function ImageUpload({
  storage,
  pathFor,
  onUploaded,
  value,
  maxSizeMb = 5,
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value ?? null);
  const [dragging, setDragging] = useState(false);
  const { upload, uploading, progress, error } = useUpload({
    storage,
    pathFor,
    maxSizeMb,
    accept: ACCEPT,
  });

  async function handleFile(file: File) {
    setPreview(URL.createObjectURL(file));
    const result = await upload(file);
    if (result) onUploaded(result.url, result.path);
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) void handleFile(file);
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'relative flex aspect-video w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border-2 border-dashed border-input bg-background text-muted-foreground transition-colors hover:border-ring',
          dragging && 'border-ring bg-secondary',
        )}
      >
        {preview ? (
          <img src={preview} alt="" className="h-full w-full object-cover" />
        ) : (
          <>
            <ImagePlus size={28} />
            <span className="text-sm">Drop an image or click to upload</span>
            <span className="text-xs">PNG, JPG, WebP up to {maxSizeMb} MB</span>
          </>
        )}

        {uploading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/50 text-primary-foreground">
            <Loader2 className="animate-spin" />
            <div className="h-1.5 w-2/3 overflow-hidden rounded-full bg-white/30">
              <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT.join(',')}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
        }}
      />

      {error && <p className="mt-1.5 text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}
