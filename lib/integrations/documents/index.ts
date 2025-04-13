import { DocumentProcessor } from './processor';
import { OCRService } from './ocr';
import { DocumentAnalyzer } from './analyzer';
import { DocumentStorage } from './storage';

export class DocumentIntegration {
  private processor: DocumentProcessor;
  private ocr: OCRService;
  private analyzer: DocumentAnalyzer;
  private storage: DocumentStorage;

  constructor() {
    this.processor = new DocumentProcessor();
    this.ocr = new OCRService();
    this.analyzer = new DocumentAnalyzer();
    this.storage = new DocumentStorage();
  }

  async processDocument(file: File | Buffer) {
    // 1. Process the document
    const processedDoc = await this.processor.process(file);

    // 2. Extract text using OCR
    const extractedText = await this.ocr.extractText(processedDoc);

    // 3. Analyze the content
    const analysis = await this.analyzer.analyze(extractedText);

    // 4. Store the results
    const storageResult = await this.storage.store({
      originalFile: file,
      processedDoc,
      extractedText,
      analysis,
    });

    return {
      id: storageResult.id,
      text: extractedText,
      analysis,
      metadata: storageResult.metadata,
    };
  }

  async batchProcessDocuments(files: (File | Buffer)[]) {
    return Promise.all(files.map(file => this.processDocument(file)));
  }

  async searchDocuments(query: string) {
    return this.storage.search(query);
  }

  async generateReport(documentIds: string[]) {
    const documents = await Promise.all(
      documentIds.map(id => this.storage.retrieve(id))
    );

    return this.analyzer.generateReport(documents);
  }
}
