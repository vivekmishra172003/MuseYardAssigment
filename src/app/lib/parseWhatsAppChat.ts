import { ChatMessage } from './types';

export function parseWhatsAppChat(fileContent: string): ChatMessage[] {
  const lines = fileContent.split('\n');
  const messages: ChatMessage[] = [];

  const timestampRegex = /\[(\d{1,2}\/\d{1,2}\/\d{2,4}), (\d{1,2}:\d{2}:\d{2} [AP]M)\]/;

  lines.forEach(line => {
    const timestampMatch = line.match(timestampRegex);
    if (timestampMatch) {
      const content = line.replace(timestampMatch[0], '').trim();
      
      // Categorize message types
      let type: ChatMessage['type'] = 'text';
      if (content.startsWith('http')) type = 'link';
      if (content.startsWith('"')) type = 'quote';
      if (content.startsWith('Note:') || content.startsWith('Journal')) type = 'note';

      messages.push({
        timestamp: new Date(timestampMatch[1]),
        content,
        type
      });
    }
  });

  return messages;
}