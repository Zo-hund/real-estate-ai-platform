import { createWorker } from 'tesseract.js';
import { PDFDocument } from 'pdf-lib';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Process print media sources
export class PrintMediaProcessor {
  private ocrWorker: any;

  async initialize() {
    this.ocrWorker = await createWorker('eng');
  }

  async processPrintMedia(file: Buffer, type: 'newspaper' | 'magazine' | 'brochure') {
    let text = '';

    if (file.toString().startsWith('%PDF')) {
      text = await this.processPdf(file);
    } else {
      text = await this.processImage(file);
    }

    const structuredData = await this.extractStructuredData(text, type);
    return structuredData;
  }

  private async processPdf(file: Buffer) {
    const pdfDoc = await PDFDocument.load(file);
    const pages = pdfDoc.getPages();
    const textContent = [];

    for (const page of pages) {
      const { text } = await page.extractTextAndImages();
      textContent.push(text);
    }

    return textContent.join('\n');
  }

  private async processImage(file: Buffer) {
    const { data: { text } } = await this.ocrWorker.recognize(file);
    return text;
  }

  private async extractStructuredData(text: string, type: string) {
    // Use GPT-4 to extract structured data from the text
    const prompt = this.generateExtractionPrompt(text, type);
    
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a real estate data extraction expert. Extract structured property information from the given text.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return JSON.parse(completion.data.choices[0].message?.content || '{}');
  }

  private generateExtractionPrompt(text: string, type: string) {
    return `Extract real estate property information from the following ${type} text. 
    Include: property type, price, location, features, contact information, and any special offers.
    Format the output as JSON.

    Text:
    ${text}`;
  }

  async cleanup() {
    if (this.ocrWorker) {
      await this.ocrWorker.terminate();
    }
  }
}

// Newspaper section processor
export class NewspaperProcessor extends PrintMediaProcessor {
  async processClassifiedSection(file: Buffer) {
    const text = await this.processImage(file);
    const listings = await this.extractListings(text);
    return listings;
  }

  private async extractListings(text: string) {
    // Use GPT-4 to identify and extract individual listings
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Extract individual real estate listings from the classified section. Format each listing as a separate JSON object.',
        },
        {
          role: 'user',
          content: text,
        },
      ],
    });

    return JSON.parse(completion.data.choices[0].message?.content || '[]');
  }
}

// Magazine processor
export class MagazineProcessor extends PrintMediaProcessor {
  async processFeatureArticle(file: Buffer) {
    const text = await this.processImage(file);
    const articleData = await this.extractArticleData(text);
    return articleData;
  }

  private async extractArticleData(text: string) {
    // Use GPT-4 to extract detailed information from feature articles
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Extract detailed property information from real estate magazine articles. Include property details, market analysis, and expert quotes.',
        },
        {
          role: 'user',
          content: text,
        },
      ],
    });

    return JSON.parse(completion.data.choices[0].message?.content || '{}');
  }
}

// Brochure processor
export class BrochureProcessor extends PrintMediaProcessor {
  async processPropertyBrochure(file: Buffer) {
    const text = await this.processImage(file);
    const brochureData = await this.extractBrochureData(text);
    return brochureData;
  }

  private async extractBrochureData(text: string) {
    // Use GPT-4 to extract detailed information from property brochures
    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'Extract comprehensive property information from real estate brochures. Include all amenities, features, floor plans, and pricing details.',
        },
        {
          role: 'user',
          content: text,
        },
      ],
    });

    return JSON.parse(completion.data.choices[0].message?.content || '{}');
  }
}
