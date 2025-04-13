import { createWorker } from 'tesseract.js';
import { Configuration, OpenAIApi } from 'openai';

export class OCRService {
  private tesseract: any;
  private openai: OpenAIApi;

  constructor() {
    this.initTesseract();
    this.initOpenAI();
  }

  private async initTesseract() {
    this.tesseract = await createWorker('eng');
  }

  private initOpenAI() {
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }

  async extractText(document: any) {
    if (this.isImage(document)) {
      return this.extractFromImage(document);
    } else if (this.isPDF(document)) {
      return this.extractFromPDF(document);
    }
    return document;
  }

  private async extractFromImage(image: Buffer) {
    const { data } = await this.tesseract.recognize(image);
    return data.text;
  }

  private async extractFromPDF(pdf: any) {
    // Use PDF text extraction or OCR if needed
    return pdf.text;
  }

  private isImage(document: any): boolean {
    // Implement image detection
    return false;
  }

  private isPDF(document: any): boolean {
    // Implement PDF detection
    return false;
  }

  async enhanceExtraction(text: string) {
    // Use GPT-4 to enhance and clean up OCR results
    const response = await this.openai.createCompletion({
      model: 'gpt-4',
      prompt: `Clean and format the following OCR text:\n${text}`,
      max_tokens: 1000,
    });

    return response.data.choices[0].text;
  }
}
