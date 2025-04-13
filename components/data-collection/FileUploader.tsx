import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { CloudArrowUpIcon, DocumentIcon, PhotoIcon } from '@heroicons/react/24/outline';

export default function FileUploader() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/pdf': ['.pdf'],
    },
  });

  const uploadFiles = async () => {
    setUploading(true);
    setProgress(0);

    try {
      const totalFiles = files.length;
      const uploadedFiles = [];

      for (let i = 0; i < totalFiles; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        uploadedFiles.push(result);

        setProgress(((i + 1) / totalFiles) * 100);
      }

      // Process uploaded files
      await processUploadedFiles(uploadedFiles);

      setFiles([]);
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setUploading(false);
    }
  };

  const processUploadedFiles = async (uploadedFiles: any[]) => {
    try {
      const response = await fetch('/api/process-files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ files: uploadedFiles }),
      });

      const result = await response.json();
      console.log('Processed files:', result);
    } catch (error) {
      console.error('Error processing files:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          isDragActive ? 'border-primary bg-blue-50' : 'border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          Drag and drop files here, or click to select files
        </p>
        <p className="mt-1 text-xs text-gray-500">
          Support for PDF documents, images, and scanned materials
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Selected Files</h3>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.name}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {file.type.includes('image') ? (
                    <PhotoIcon className="h-6 w-6 text-gray-400" />
                  ) : (
                    <DocumentIcon className="h-6 w-6 text-gray-400" />
                  )}
                  <span className="text-sm">{file.name}</span>
                </div>
                <button
                  onClick={() => setFiles(files.filter((f) => f !== file))}
                  className="text-red-600 hover:text-red-800 transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {uploading ? (
            <div className="space-y-2">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 text-center">
                Uploading... {Math.round(progress)}%
              </p>
            </div>
          ) : (
            <button
              onClick={uploadFiles}
              className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Upload and Process Files
            </button>
          )}
        </div>
      )}
    </div>
  );
}
