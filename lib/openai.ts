import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OPENAI_API_KEY environment variable');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzePropertyPreferences(description: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are a real estate expert AI assistant. Analyze the user\'s property preferences and extract key features and requirements.',
      },
      {
        role: 'user',
        content: description,
      },
    ],
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}

export async function generatePropertyInsights(propertyData: any) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {
        role: 'system',
        content: 'You are a real estate market analyst. Provide detailed insights about the property and its investment potential.',
      },
      {
        role: 'user',
        content: JSON.stringify(propertyData),
      },
    ],
    temperature: 0.7,
  });

  return response.choices[0].message.content;
}
