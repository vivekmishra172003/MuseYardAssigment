export interface ChatMessage {
    timestamp: Date;
    content: string;
    type: 'text' | 'link' | 'quote' | 'note';
  }
  
  export interface ContentPattern {
    theme: string;
    frequency: number;
    representativeSamples: string[];
    insights: string[];
  }