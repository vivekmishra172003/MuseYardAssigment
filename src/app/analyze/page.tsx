'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChatMessage, ContentPattern } from '../lib/types';
import { analyzeContent } from '../lib/analyzeContent';

export default function AnalyzePage() {
  const [patterns, setPatterns] = useState<ContentPattern[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const messagesJson = localStorage.getItem('chatMessages');
    if (messagesJson) {
      try {
        const messages: ChatMessage[] = JSON.parse(messagesJson);
        analyzeContent(messages)
          .then(detectedPatterns => {
            setPatterns(detectedPatterns || []);
            setLoading(false);
          })
          .catch(err => {
            console.error('Analysis error:', err);
            setError('Failed to analyze content');
            setLoading(false);
          });
      } catch (parseError) {
        console.error('Failed to parse messages:', parseError);
        setError('Invalid message data');
        setLoading(false);
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [router]);

  if (loading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (patterns.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <p>No patterns found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Pattern Analysis</h1>
      {patterns.map((pattern, index) => (
        <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4">
          <h2 className="text-xl font-semibold">{pattern.theme}</h2>
          <p>Frequency: {pattern.frequency}</p>
          <div>
            <h3 className="font-medium mt-2">Representative Samples:</h3>
            <ul className="list-disc pl-5">
              {pattern.representativeSamples.map((sample, i) => (
                <li key={i}>{sample}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium mt-2">Insights:</h3>
            <ul className="list-disc pl-5">
              {pattern.insights.map((insight, i) => (
                <li key={i}>{insight}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}