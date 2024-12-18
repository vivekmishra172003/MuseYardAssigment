'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { parseWhatsAppChat } from '../lib/parseWhatsAppChat';

export default function FileUploader() {
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        const parsedMessages = parseWhatsAppChat(text);
        
        // Store in local storage for analysis page
        localStorage.setItem('chatMessages', JSON.stringify(parsedMessages));
        
        // Navigate to analysis page
        router.push('/analyze');
      };
      reader.readAsText(uploadedFile);
      setFile(uploadedFile);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Pattern Explorer</h1>
      <input 
        type="file" 
        accept=".txt"
        onChange={handleFileUpload}
        className="file-input file-input-bordered w-full max-w-xs"
        title="Upload your WhatsApp chat file"
      />
      {file && <p className="mt-4">Selected file: {file.name}</p>}
    </div>
  );
}