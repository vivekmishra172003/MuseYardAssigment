'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { parseWhatsAppChat } from '../lib/parseWhatsAppChat';
import { ChatMessage } from '../lib/types';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    
    // Validate file type
    if (uploadedFile && uploadedFile.type === 'text/plain') {
      try {
        const reader = new FileReader();
        reader.onload = async (e) => {
          const text = e.target?.result as string;
          
          try {
            const parsedMessages: ChatMessage[] = parseWhatsAppChat(text);
            
            // Validate parsed messages
            if (parsedMessages.length === 0) {
              setError('No valid messages found in the file');
              return;
            }

            // Store in local storage
            localStorage.setItem('chatMessages', JSON.stringify(parsedMessages));
            
            // Navigate to analysis page
            router.push('/analyze');
          } catch (parseError) {
            setError('Failed to parse the chat file');
            console.error(parseError);
          }
        };
        reader.readAsText(uploadedFile);
        setFile(uploadedFile);
      } catch (readError) {
        setError('Error reading the file');
        console.error(readError);
      }
    } else {
      setError('Please upload a valid .txt file');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6">Upload WhatsApp Chat</h1>
        
        <div className="flex flex-col items-center">
          <label htmlFor="file-upload" className="sr-only">Upload file</label>
          <input 
            id="file-upload"
            type="file" 
            accept=".txt"
            title="Choose a file to upload"
            onChange={handleFileUpload}
            className="file-input file-input-bordered w-full max-w-xs mb-4"
          />
          
          {file && (
            <div className="alert alert-info shadow-lg mb-4">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>Selected file: {file.name}</span>
              </div>
            </div>
          )}
          
          {error && (
            <div className="alert alert-error shadow-lg mb-4">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span>{error}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Upload a WhatsApp chat export (.txt file) to analyze patterns
          </p>
        </div>
      </div>
    </div>
  );
}