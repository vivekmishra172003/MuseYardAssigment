'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChatMessage, ContentPattern } from '../lib/types';
import { analyzeContent } from '../lib/analyzeContent';
import InsightDisplay from './InsightDisplay';
import LoadingSpinner from './LoadingSpinner';

interface PatternAnalysisProps {
  initialMessages?: ChatMessage[];
}

export default function PatternAnalysis({ initialMessages }: PatternAnalysisProps) {
  const [patterns, setPatterns] = useState<ContentPattern[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const performAnalysis = () => {
      // Try to get messages from prop or local storage
      const messages = initialMessages || 
        JSON.parse(localStorage.getItem('chatMessages') || '[]');

      if (messages.length === 0) {
        router.push('/');
        return;
      }

      try {
        // Perform content analysis
        const detectedPatterns = analyzeContent(messages);
        setPatterns(detectedPatterns);
      } catch (error) {
        console.error('Analysis error:', error);
        // Optionally handle analysis errors
      } finally {
        setIsLoading(false);
      }
    };

    performAnalysis();
  }, [initialMessages, router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">
          Pattern Explorer Results
        </h1>
        {patterns.length > 0 ? (
          <InsightDisplay patterns={patterns} />
        ) : (
          <div className="text-center text-gray-600">
            <p>No significant patterns were detected in your chat.</p>
            <button 
              onClick={() => router.push('/')}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Try Another File
            </button>
          </div>
        )}
      </div>
    </div>
  );
}