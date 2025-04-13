import { UploadProcessor } from './processor';
import { DataBreakdown } from './breakdown';
import { ValidationService } from './validation';
import { StorageService } from './storage';

export class UploadIntegration {
  private processor: UploadProcessor;
  private breakdown: DataBreakdown;
  private validator: ValidationService;
  private storage: StorageService;

  constructor() {
    this.processor = new UploadProcessor();
    this.breakdown = new DataBreakdown();
    this.validator = new ValidationService();
    this.storage = new StorageService();
  }

  async processUpload(files: File[], metadata: any = {}) {
    // 1. Validate files
    await this.validator.validateFiles(files);

    // 2. Process uploads
    const processedFiles = await this.processor.processFiles(files);

    // 3. Break down data
    const dataBreakdown = await this.breakdown.analyzeFiles(processedFiles);

    // 4. Store results
    const storageResults = await this.storage.storeFiles(processedFiles, {
      metadata,
      breakdown: dataBreakdown,
    });

    return {
      files: storageResults,
      breakdown: dataBreakdown,
      summary: await this.breakdown.generateSummary(dataBreakdown),
    };
  }

  async generateReport(uploadIds: string[]) {
    const uploads = await Promise.all(
      uploadIds.map(id => this.storage.getUpload(id))
    );

    return this.breakdown.generateReport(uploads);
  }

  async searchUploads(query: string) {
    return this.storage.searchUploads(query);
  }
}
