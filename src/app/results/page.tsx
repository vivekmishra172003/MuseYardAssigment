'use client';

import { useRouter } from 'next/navigation';
import { usePatternAnalysis } from '../hooks/usePatternAnalysis';
import LoadingSpinner from '../components/LoadingSpinner';
import InsightDisplay from '../components/InsightDisplay';

export default function ResultsPage() {
  const { 
    patterns, 
    isLoading, 
    error, 
    resetAnalysis, 
    exportPatterns 
  } = usePatternAnalysis();
  const router = useRouter();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Analysis Error</h2>
          <p className="text-gray-700 mb-6">{error}</p>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => router.push('/upload')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Try Again
            </button>
            <button 
              onClick={resetAnalysis}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Pattern Explorer Results</h1>
          <div className="space-x-4">
            <button 
              onClick={exportPatterns}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Export Patterns
            </button>
            <button 
              onClick={() => router.push('/upload')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              New Analysis
            </button>
          </div>
        </div>

        {patterns.length > 0 ? (
          <InsightDisplay patterns={patterns} />
        ) : (
          <div className="text-center text-gray-600">
            <p className="text-xl">No significant patterns were detected</p>
            <button 
              onClick={() => router.push('/upload')}
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