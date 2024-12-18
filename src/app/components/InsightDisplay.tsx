'use client';

import { useState } from 'react';
import { ContentPattern } from '../lib/types';

interface InsightDisplayProps {
  patterns: ContentPattern[];
}

export default function InsightDisplay({ patterns }: InsightDisplayProps) {
  const [selectedPattern, setSelectedPattern] = useState<ContentPattern | null>(null);

  const handlePatternSelect = (pattern: ContentPattern) => {
    setSelectedPattern(pattern);
  };

  return (
    <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Pattern List */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-2xl font-bold mb-4">Detected Patterns</h2>
        {patterns.map((pattern, index) => (
          <div 
            key={index} 
            onClick={() => handlePatternSelect(pattern)}
            className={`cursor-pointer p-3 mb-2 rounded-lg transition-colors ${
              selectedPattern === pattern 
                ? 'bg-blue-100 border-blue-300 border' 
                : 'hover:bg-gray-100'
            }`}
          >
            <h3 className="font-semibold text-lg">{pattern.theme}</h3>
            <p className="text-sm text-gray-600">
              Frequency: {pattern.frequency} occurrences
            </p>
          </div>
        ))}
      </div>

      {/* Detailed Insight Panel */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <h2 className="text-2xl font-bold mb-4">Pattern Details</h2>
        {selectedPattern ? (
          <div>
            <h3 className="text-xl font-semibold mb-2">{selectedPattern.theme}</h3>
            
            <div className="mb-4">
              <h4 className="font-medium">Representative Samples:</h4>
              <ul className="list-disc pl-5 text-gray-700">
                {selectedPattern.representativeSamples.map((sample, i) => (
                  <li key={i} className="mb-2">{sample}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium">Insights:</h4>
              <ul className="list-disc pl-5 text-gray-700">
                {selectedPattern.insights.map((insight, i) => (
                  <li key={i} className="mb-2">{insight}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center">
            Select a pattern to view detailed insights
          </p>
        )}
      </div>
    </div>
  );
}