'use client'
import { uploadFileToS3 } from '@/lib/uploadFile';
import React, { useState } from 'react';

/**
 * Props for the FileUploadComponent
 */
interface FileUploadProps {
  // Your API endpoint to get the presigned URL
  apiEndpoint: string; 
}

const FileUploadComponent: React.FC<FileUploadProps> = ({ apiEndpoint }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  /**
   * Handles the file selection from the input.
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setUploadedUrl(''); // Reset previous state
      setUploadStatus('idle');
      setErrorMessage('');
    }
  };

  /**
   * Handles the upload button click.
   */
  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file first.');
      return;
    }

    setUploadStatus('uploading');
    setErrorMessage('');

    try {
      // Assuming uploadFileToS3 is implemented correctly to return the URL
      const url = await uploadFileToS3(selectedFile, apiEndpoint);
      
      setUploadedUrl(url);
      setUploadStatus('success');
      console.log('File uploaded successfully. URL:', url);
    } catch (error) {
      setErrorMessage((error as Error).message);
      setUploadStatus('error');
    }
  };


  const baseButtonClasses = 'px-4 py-2 font-semibold rounded-lg transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed';
  
  const uploadButtonClasses = selectedFile 
    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' 
    : 'bg-gray-300 text-gray-500 cursor-not-allowed';


  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-xl rounded-xl space-y-4 border border-gray-100">
      <h3 className="text-2xl font-bold text-gray-800 flex items-center">
         S3 File Uploader
      </h3>

      <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 items-center">
        
        <div className="flex-grow w-full">
          <label htmlFor="file-upload" className="sr-only">Choose file</label>
          <input 
            id="file-upload"
            type="file" 
            onChange={handleFileChange} 
            disabled={uploadStatus === 'uploading'}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
          />
        </div>
        
        <button 
          onClick={handleUpload} 
          disabled={!selectedFile || uploadStatus === 'uploading'}
          className={`${baseButtonClasses} ${uploadButtonClasses}`}
        >
          {uploadStatus === 'uploading' ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </div>
          ) : 'Upload to S3'}
        </button>
      </div>

      {/* Status Display Area */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        
        {uploadStatus === 'idle' && selectedFile && (
          <p className="text-sm text-gray-600">
            File ready: <span className="font-medium text-gray-800">{selectedFile.name}</span> (<span className="text-gray-500">{selectedFile.type}</span>)
          </p>
        )}

        {uploadStatus === 'success' && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-base font-semibold text-green-700 flex items-center mb-1">
              ✅ Upload Successful!
            </p>
            <p className="text-sm text-green-600 break-words">
              **File URL:** <a href={uploadedUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 underline">{uploadedUrl}</a>
            </p>
          </div>
        )}

        {uploadStatus === 'error' && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-base font-semibold text-red-700 flex items-center mb-1">
              Upload Error
            </p>
            <p className="text-sm text-red-600">
              **Details:** {errorMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUploadComponent;