'use client';

import { useState, useRef } from 'react';
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react';
import Image from 'next/image';

interface AuthorImageUploadProps {
  manuscriptId: number;
  authorEmail: string;
  onSuccess?: (imageUrl: string) => void;
  onError?: (error: string) => void;
}

interface ValidationState {
  isValid: boolean;
  error?: string;
  preview?: string;
}

export function AuthorImageUpload({
  manuscriptId,
  authorEmail,
  onSuccess,
  onError,
}: AuthorImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validation, setValidation] = useState<ValidationState>({ isValid: false });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const REQUIRED_DIMENSIONS = '400x400px';
  const MAX_FILE_SIZE = 5;
  const ALLOWED_FORMATS = ['JPG', 'PNG'];

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const validateFile = async (file: File): Promise<ValidationState> => {
    const errors: string[] = [];

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > MAX_FILE_SIZE) {
      errors.push(`File size exceeds ${MAX_FILE_SIZE}MB limit.`);
    }

    // Check MIME type
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      errors.push('Only JPEG and PNG formats are allowed.');
    }

    // Check dimensions
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          if (img.width !== 400 || img.height !== 400) {
            errors.push(`Image must be exactly ${REQUIRED_DIMENSIONS}.`);
          }

          if (errors.length > 0) {
            resolve({
              isValid: false,
              error: errors.join(' '),
            });
          } else {
            resolve({
              isValid: true,
              preview: e.target?.result as string,
            });
          }
        };
        img.onerror = () => {
          resolve({
            isValid: false,
            error: 'Unable to read image file.',
          });
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (file: File) => {
    const validationResult = await validateFile(file);
    setValidation(validationResult);

    if (!validationResult.isValid) {
      onError?.(validationResult.error);
      return;
    }

    await uploadImage(file, validationResult.preview);
  };

  const uploadImage = async (file: File, preview: string) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('manuscript_id', manuscriptId.toString());
      formData.append('author_image', file);

      const response = await fetch('/api/submit/author-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload author image.');
      }

      const data = await response.json();

      setUploadedImage(preview);
      setValidation({
        isValid: true,
        preview,
      });
      onSuccess?.(data.data.author_image_url);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      setValidation({
        isValid: false,
        error: errorMessage,
      });
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await handleFileSelect(files[0]);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await handleFileSelect(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setUploadedImage(null);
    setValidation({ isValid: false });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-black mb-2">
          Author Photo
        </label>
        <p className="text-xs text-gray-600 mb-3">
          Upload a professional photo (required: {REQUIRED_DIMENSIONS}, {ALLOWED_FORMATS.join(' or ')}, max {MAX_FILE_SIZE}MB)
        </p>
      </div>

      {uploadedImage ? (
        <div className="flex items-center gap-4">
          <div className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-black">
            <img
              src={uploadedImage}
              alt="Author photo"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-black">Photo uploaded successfully</span>
            </div>
            <p className="text-xs text-gray-600 mb-3">Your photo has been saved.</p>
            <button
              type="button"
              onClick={handleRemove}
              disabled={isLoading}
              className="text-xs text-red-600 hover:text-red-700 font-semibold disabled:opacity-50"
            >
              Remove photo
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging
              ? 'border-black bg-black/5'
              : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileInput}
            disabled={isLoading}
            className="hidden"
            aria-label="Upload author photo"
          />

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Upload className="w-6 h-6 text-gray-600" />
            </div>
            <p className="text-sm font-semibold text-black mb-1">
              {isLoading ? 'Uploading...' : 'Drag photo here or click to browse'}
            </p>
            <p className="text-xs text-gray-600 mb-4">
              {REQUIRED_DIMENSIONS} • {ALLOWED_FORMATS.join(' or ')} • Max {MAX_FILE_SIZE}MB
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="px-4 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Uploading...' : 'Browse Files'}
            </button>
          </div>
        </div>
      )}

      {validation.error && (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-900">Validation Error</p>
            <p className="text-xs text-red-700 mt-1">{validation.error}</p>
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
        <h4 className="text-xs font-semibold text-black mb-2">Requirements</h4>
        <ul className="text-xs text-gray-700 space-y-1">
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            Dimensions: {REQUIRED_DIMENSIONS}
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            Format: {ALLOWED_FORMATS.join(' or ')}
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            File Size: Maximum {MAX_FILE_SIZE}MB
          </li>
          <li className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            Professional, clear photo recommended
          </li>
        </ul>
      </div>
    </div>
  );
}
