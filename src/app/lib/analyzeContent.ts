// src/lib/analyzeContent.ts
import { ChatMessage, ContentPattern } from './types';

export async function analyzeContent(messages: ChatMessage[]): Promise<ContentPattern[]> {
  try {
    // Ensure messages have correct timestamp format
    const processedMessages = messages.map(msg => ({
      ...msg,
      timestamp: msg.timestamp instanceof Date 
        ? msg.timestamp 
        : new Date(msg.timestamp || Date.now())
    }));

    // In a real application, you'd fetch from an actual API
    // For now, we'll use local analysis as a fallback
    return localAnalyzeContent(processedMessages);
  } catch (error) {
    console.error("Analysis Error:", error);
    return [];
  }
}

// Local analysis function with comprehensive pattern detection
function localAnalyzeContent(messages: ChatMessage[]): ContentPattern[] {
  // Group messages by type and detect patterns
  const linkMessages = messages.filter(msg => msg.type === 'link');
  const quoteMessages = messages.filter(msg => msg.type === 'quote');
  const noteMessages = messages.filter(msg => msg.type === 'note');

  const patterns: ContentPattern[] = [];

  // Link Resources Pattern
  if (linkMessages.length > 0) {
    patterns.push({
      theme: 'Learning Resources',
      frequency: linkMessages.length,
      representativeSamples: linkMessages
        .slice(0, 3)
        .map(msg => msg.content),
      insights: [
        'Actively seeking external knowledge',
        'Interested in continuous learning',
        'Diverse information consumption'
      ]
    });
  }

  // Motivational Quotes Pattern
  if (quoteMessages.length > 0) {
    patterns.push({
      theme: 'Motivational Inspiration',
      frequency: quoteMessages.length,
      representativeSamples: quoteMessages
        .slice(0, 3)
        .map(msg => msg.content),
      insights: [
        'Uses quotes for personal motivation',
        'Draws inspiration from thought leaders',
        'Reflects on personal growth'
      ]
    });
  }

  // Personal Notes Pattern
  if (noteMessages.length > 0) {
    patterns.push({
      theme: 'Personal Reflection',
      frequency: noteMessages.length,
      representativeSamples: noteMessages
        .slice(0, 3)
        .map(msg => msg.content),
      insights: [
        'Practices self-reflection',
        'Tracks personal progress',
        'Maintains a growth mindset'
      ]
    });
  }

  // Topic Frequency Analysis
  const topicFrequency = messages.reduce((acc, msg) => {
    const words = msg.content.toLowerCase().split(/\s+/);
    words.forEach(word => {
      // Filter out very short words and common stop words
      if (word.length > 3 && 
          !['this', 'that', 'with', 'from', 'your', 'into'].includes(word)) {
        acc[word] = (acc[word] || 0) + 1;
      }
    });
    return acc;
  }, {} as Record<string, number>);

  const topTopics = Object.entries(topicFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  if (topTopics.length > 0) {
    patterns.push({
      theme: 'Recurring Topics',
      frequency: topTopics.length,
      representativeSamples: topTopics.map(([topic, count]) => `${topic} (${count} mentions)`),
      insights: [
        'Identifies key discussion themes',
        'Highlights areas of consistent interest',
        'Provides context for personal focus'
      ]
    });
  }

  // Time-based Pattern Analysis
  const messagesByDate = messages.reduce((acc, msg) => {
    const date = new Date(msg.timestamp).toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostActiveDay = Object.entries(messagesByDate)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 1);

  if (mostActiveDay.length > 0) {
    patterns.push({
      theme: 'Communication Rhythm',
      frequency: mostActiveDay[0][1],
      representativeSamples: [`Most active day: ${mostActiveDay[0][0]}`],
      insights: [
        'Identifies communication patterns',
        'Understands personal engagement cycles',
        'Reveals potential productivity windows'
      ]
    });
  }

  return patterns;
}