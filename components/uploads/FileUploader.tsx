import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudArrowUpIcon, DocumentIcon, PhotoIcon } from '@heroicons/react/24/outline';

interface FileUploaderProps {
  onUpload: (files: File[]) => Promise<void>;
  acceptedTypes?: string[];
  maxSize?: number;
  multiple?: boolean;
}

export default function FileUploader({
  onUpload,
  acceptedTypes = ['image/*', 'application/pdf'],
  maxSize = 10 * 1024 * 1024, // 10MB
  multiple = true,
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploading(true);
      setError(null);

      try {
        await onUpload(acceptedFiles);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
      } finally {
        setUploading(false);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize,
    multiple,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center
          ${isDragActive ? 'border-primary bg-blue-50' : 'border-gray-300'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
      >
        <input {...getInputProps()} disabled={uploading} />

        <div className="space-y-4">
          <div className="flex justify-center">
            <CloudArrowUpIcon
              className={`h-12 w-12 ${isDragActive ? 'text-primary' : 'text-gray-400'}`}
            />
          </div>

          <div className="space-y-1">
            <p className="text-lg font-medium text-gray-900">
              {isDragActive
                ? 'Drop files here...'
                : 'Drag and drop files here, or click to browse'}
            </p>
            <p className="text-sm text-gray-500">
              Upload images, PDFs, or scanned documents
            </p>
          </div>

          {!uploading && (
            <div className="flex justify-center space-x-4">
              <div className="flex items-center text-sm text-gray-500">
                <PhotoIcon className="h-5 w-5 mr-1" />
                Images
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <DocumentIcon className="h-5 w-5 mr-1" />
                PDFs
              </div>
            </div>
          )}

          {uploading && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 rounded-lg p-4">
          {error}
        </div>
      )}
    </div>
  );
}
