import { createWorker } from 'tesseract.js';
import { PDFDocument } from 'pdf-lib';
import sharp from 'sharp';
import { Storage } from '@google-cloud/storage';

// Initialize cloud storage
const storage = new Storage();
const bucket = storage.bucket(process.env.GOOGLE_CLOUD_STORAGE_BUCKET!);

// File upload handler
export async function handleFileUpload(file: any) {
  const fileType = determineFileType(file);
  let extractedData;

  switch (fileType) {
    case 'image':
      extractedData = await processImage(file);
      break;
    case 'pdf':
      extractedData = await processPDF(file);
      break;
    case 'document':
      extractedData = await processDocument(file);
      break;
    default:
      throw new Error('Unsupported file type');
  }

  // Store the file in cloud storage
  const fileName = `${Date.now()}-${file.name}`;
  await uploadToCloudStorage(file, fileName);

  return {
    extractedData,
    fileUrl: getPublicUrl(fileName),
  };
}

// Image processing
async function processImage(file: any) {
  // Optimize image
  const optimizedImage = await sharp(file.buffer)
    .resize(1200, 1200, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: 80 })
    .toBuffer();

  // Extract text from image
  const worker = await createWorker('eng');
  const { data: { text } } = await worker.recognize(optimizedImage);
  await worker.terminate();

  // Extract property details from text
  const propertyDetails = extractPropertyDetailsFromText(text);

  return {
    text,
    propertyDetails,
    dimensions: await sharp(optimizedImage).metadata(),
  };
}

// PDF processing
async function processPDF(file: any) {
  const pdfDoc = await PDFDocument.load(file.buffer);
  const pages = pdfDoc.getPages();
  const extractedText = [];

  for (const page of pages) {
    const { text } = await page.extractTextAndMetadata();
    extractedText.push(text);
  }

  // Extract property details from text
  const propertyDetails = extractPropertyDetailsFromText(extractedText.join(' '));

  return {
    text: extractedText,
    propertyDetails,
    pageCount: pages.length,
  };
}

// Document processing
async function processDocument(file: any) {
  // Process various document formats (docx, txt, etc.)
  const text = await extractTextFromDocument(file);
  
  // Extract property details from text
  const propertyDetails = extractPropertyDetailsFromText(text);

  return {
    text,
    propertyDetails,
  };
}

// Helper functions
function extractPropertyDetailsFromText(text: string) {
  return {
    price: extractPrice(text),
    bedrooms: extractBedrooms(text),
    bathrooms: extractBathrooms(text),
    sqft: extractSquareFootage(text),
    location: extractLocation(text),
    amenities: extractAmenities(text),
    description: extractDescription(text),
  };
}

async function uploadToCloudStorage(file: any, fileName: string) {
  const blob = bucket.file(fileName);
  const blobStream = blob.createWriteStream({
    resumable: false,
    metadata: {
      contentType: file.mimetype,
    },
  });

  return new Promise((resolve, reject) => {
    blobStream.on('error', reject);
    blobStream.on('finish', resolve);
    blobStream.end(file.buffer);
  });
}

function getPublicUrl(fileName: string) {
  return `https://storage.googleapis.com/${process.env.GOOGLE_CLOUD_STORAGE_BUCKET}/${fileName}`;
}
