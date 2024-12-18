// src/app/api/analyze/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ChatMessage } from '../../lib/types';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    // Combine messages into a single string for analysis
    const chatText = messages.map((msg: ChatMessage) => msg.content).join('\n');

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: `Analyze the following chat messages and identify key patterns, themes, and insights:
        
        Analysis Requirements:
        - Detect recurring themes and communication patterns
        - Provide actionable and meaningful insights
        - Format output as strict JSON with following structure:
        {
          "patterns": [
            {
              "theme": string,
              "frequency": number,
              "representativeSamples": string[],
              "insights": string[]
            }
          ]
        }
        
        Examples of Themes:
        - Personal Development
        - Work Motivation
        - Learning Resources
        - Productivity Strategies
        - Inspirational Quotes
        
        Provide precise, concise, and meaningful insights.`
      }, {
        role: "user",
        content: chatText
      }],
      response_format: { type: "json_object" },
      max_tokens: 500,
      temperature: 0.7
    });

    // Parse the AI-generated insights
    const aiResponse = JSON.parse(response.choices[0].message.content || '{"patterns": []}');
    
    return NextResponse.json(aiResponse.patterns || []);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    return NextResponse.json({ error: 'Failed to analyze content' }, { status: 500 });
  }
}