import { useState, useEffect } from 'react';
import { ChatMessage, ContentPattern } from '../lib/types';
import { analyzeContent } from '../lib/analyzeContent';

export function usePatternAnalysis() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [patterns, setPatterns] = useState<ContentPattern[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMessagesFromStorage = () => {
      try {
        const storedMessages = localStorage.getItem('chatMessages');
        if (storedMessages) {
          const parsedMessages: ChatMessage[] = JSON.parse(storedMessages);
          
          // Additional validation
          if (!Array.isArray(parsedMessages)) {
            throw new Error('Invalid messages format');
          }

          setMessages(parsedMessages);
          
          // Perform analysis
          const detectedPatterns = analyzeContent(parsedMessages);
          setPatterns(detectedPatterns);
        } else {
          setError('No chat messages found');
        }
      } catch (err) {
        const errorMessage = err instanceof Error 
          ? err.message 
          : 'Failed to load or analyze messages';
        
        setError(errorMessage);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessagesFromStorage();
  }, []);

  const resetAnalysis = () => {
    setMessages([]);
    setPatterns([]);
    setIsLoading(true);
    setError(null);
    localStorage.removeItem('chatMessages');
  };

  const exportPatterns = () => {
    if (patterns.length === 0) {
      alert('No patterns to export');
      return;
    }

    try {
      const patternsJson = JSON.stringify(patterns, null, 2);
      const blob = new Blob([patternsJson], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `pattern_analysis_${new Date().toISOString().split('T')[0]}.json`;
      
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed', err);
      alert('Failed to export patterns');
    }
  };

  return { 
    messages, 
    patterns, 
    isLoading, 
    error, 
    resetAnalysis, 
    exportPatterns 
  };
}