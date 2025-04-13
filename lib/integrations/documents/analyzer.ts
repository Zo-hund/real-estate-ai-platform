import { Configuration, OpenAIApi } from 'openai';

export class DocumentAnalyzer {
  private openai: OpenAIApi;

  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async analyze(text: string) {
    const analysis = await Promise.all([
      this.extractPropertyDetails(text),
      this.identifyKeyFeatures(text),
      this.analyzePricing(text),
      this.extractDates(text),
    ]);

    return {
      propertyDetails: analysis[0],
      keyFeatures: analysis[1],
      pricing: analysis[2],
      dates: analysis[3],
    };
  }

  private async extractPropertyDetails(text: string) {
    const response = await this.openai.createCompletion({
      model: 'gpt-4',
      prompt: `Extract property details from the following text:\n${text}`,
      max_tokens: 500,
    });

    return JSON.parse(response.data.choices[0].text || '{}');
  }

  private async identifyKeyFeatures(text: string) {
    const response = await this.openai.createCompletion({
      model: 'gpt-4',
      prompt: `Identify key features from the following text:\n${text}`,
      max_tokens: 500,
    });

    return JSON.parse(response.data.choices[0].text || '[]');
  }

  private async analyzePricing(text: string) {
    const response = await this.openai.createCompletion({
      model: 'gpt-4',
      prompt: `Extract and analyze pricing information from the following text:\n${text}`,
      max_tokens: 500,
    });

    return JSON.parse(response.data.choices[0].text || '{}');
  }

  private async extractDates(text: string) {
    const response = await this.openai.createCompletion({
      model: 'gpt-4',
      prompt: `Extract important dates from the following text:\n${text}`,
      max_tokens: 500,
    });

    return JSON.parse(response.data.choices[0].text || '[]');
  }

  async generateReport(documents: any[]) {
    const combinedText = documents
      .map(doc => doc.text)
      .join('\n\n');

    const response = await this.openai.createCompletion({
      model: 'gpt-4',
      prompt: `Generate a comprehensive report from the following documents:\n${combinedText}`,
      max_tokens: 1000,
    });

    return response.data.choices[0].text;
  }
}
