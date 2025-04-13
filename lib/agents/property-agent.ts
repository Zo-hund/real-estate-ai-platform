import { Configuration, OpenAIApi } from 'openai';
import { DataProviderIntegration } from '../integrations/providers';

export class PropertyAgent {
  private openai: OpenAIApi;
  private dataProvider: DataProviderIntegration;

  constructor() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
    this.dataProvider = new DataProviderIntegration();
  }

  async analyze(data: any) {
    const propertyData = await this.dataProvider.fetchPropertyData(data.propertyId);
    
    // Analyze property details
    const analysis = await this.analyzePropertyDetails(propertyData);
    
    // Generate recommendations
    const recommendations = await this.generateRecommendations(analysis);
    
    // Create action items
    const actionItems = await this.createActionItems(recommendations);

    return {
      analysis,
      recommendations,
      actionItems,
      metadata: {
        timestamp: new Date(),
        propertyId: data.propertyId,
      },
    };
  }

  private async analyzePropertyDetails(propertyData: any) {
    const response = await this.openai.createCompletion({
      model: 'gpt-4',
      prompt: `Analyze the following property details and provide insights:\n${JSON.stringify(propertyData)}`,
      max_tokens: 1000,
    });

    return JSON.parse(response.data.choices[0].text || '{}');
  }

  private async generateRecommendations(analysis: any) {
    const response = await this.openai.createCompletion({
      model: 'gpt-4',
      prompt: `Generate recommendations based on this analysis:\n${JSON.stringify(analysis)}`,
      max_tokens: 500,
    });

    return JSON.parse(response.data.choices[0].text || '[]');
  }

  private async createActionItems(recommendations: any) {
    const response = await this.openai.createCompletion({
      model: 'gpt-4',
      prompt: `Create action items from these recommendations:\n${JSON.stringify(recommendations)}`,
      max_tokens: 500,
    });

    return JSON.parse(response.data.choices[0].text || '[]');
  }
}
