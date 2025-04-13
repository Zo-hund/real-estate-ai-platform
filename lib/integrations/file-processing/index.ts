import { createWorker } from 'tesseract.js';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import { Storage } from '@google-cloud/storage';

// Initialize cloud storage
const storage = new Storage({
  keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
});

const bucket = storage.bucket(process.env.GOOGLE_CLOUD_BUCKET!);

// OCR processing for scanned documents
export async function processScannedDocument(file: Buffer) {
  const worker = await createWorker('eng');
  const { data: { text } } = await worker.recognize(file);
  await worker.terminate();
  return text;
}

// PDF processing
export async function processPdfDocument(file: Buffer) {
  const pdfDoc = await PDFDocument.load(file);
  const pages = pdfDoc.getPages();
  
  const textContent = [];
  for (const page of pages) {
    const { text } = await page.extractTextAndImages();
    textContent.push(text);
  }

  return textContent.join('\n');
}

// Image processing
export async function processPropertyImages(files: Buffer[]) {
  const processedImages = [];

  for (const file of files) {
    const processed = await sharp(file)
      .resize(1200, 800, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({ quality: 80 })
      .toBuffer();

    processedImages.push(processed);
  }

  return processedImages;
}

// File upload handler
export async function uploadPropertyFiles(files: {
  name: string;
  buffer: Buffer;
  mimetype: string;
}[]) {
  const uploadResults = [];

  for (const file of files) {
    const fileName = `properties/${Date.now()}-${file.name}`;
    const fileUpload = bucket.file(fileName);

    await fileUpload.save(file.buffer, {
      metadata: {
        contentType: file.mimetype,
      },
    });

    const [url] = await fileUpload.getSignedUrl({
      action: 'read',
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    uploadResults.push({
      originalName: file.name,
      url,
      fileName,
    });
  }

  return uploadResults;
}

// Extract property data from documents
export async function extractPropertyData(text: string) {
  // Use AI to extract structured data from text
  const propertyData = {
    price: extractPrice(text),
    bedrooms: extractBedrooms(text),
    bathrooms: extractBathrooms(text),
    sqft: extractSquareFootage(text),
    address: extractAddress(text),
    features: extractFeatures(text),
  };

  return propertyData;
}

// Helper functions for data extraction
function extractPrice(text: string) {
  const priceMatch = text.match(/\$[\d,]+(?:\.\d{2})?/g);
  return priceMatch ? parseFloat(priceMatch[0].replace(/[$,]/g, '')) : null;
}

function extractBedrooms(text: string) {
  const bedroomMatch = text.match(/(\d+)\s*(?:bed|bedroom)/i);
  return bedroomMatch ? parseInt(bedroomMatch[1]) : null;
}

function extractBathrooms(text: string) {
  const bathroomMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:bath|bathroom)/i);
  return bathroomMatch ? parseFloat(bathroomMatch[1]) : null;
}

function extractSquareFootage(text: string) {
  const sqftMatch = text.match(/(\d+[,\d]*)\s*(?:sq\s*ft|sqft|square\s*feet)/i);
  return sqftMatch ? parseInt(sqftMatch[1].replace(/,/g, '')) : null;
}

function extractAddress(text: string) {
  // Basic address pattern matching
  const addressMatch = text.match(/\d+\s+[\w\s]+(?:street|st|avenue|ave|road|rd|boulevard|blvd|lane|ln|drive|dr)/i);
  return addressMatch ? addressMatch[0] : null;
}

function extractFeatures(text: string) {
  const features = [];
  const commonFeatures = [
    'garage',
    'pool',
    'fireplace',
    'hardwood',
    'granite',
    'stainless',
    'central air',
    'deck',
    'patio',
  ];

  for (const feature of commonFeatures) {
    if (text.toLowerCase().includes(feature)) {
      features.push(feature);
    }
  }

  return features;
}
