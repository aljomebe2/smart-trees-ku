import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';

const QR_DIR = path.join(process.cwd(), 'public', 'qr');

export async function ensureQrDir(): Promise<string> {
  if (!fs.existsSync(QR_DIR)) {
    fs.mkdirSync(QR_DIR, { recursive: true });
  }
  return QR_DIR;
}

export async function generateQrPng(slug: string, baseUrl: string): Promise<string> {
  await ensureQrDir();
  const url = `${baseUrl}/tree/${slug}`;
  const filePath = path.join(QR_DIR, `${slug}.png`);
  await QRCode.toFile(filePath, url, { width: 512, margin: 2 });
  return `/qr/${slug}.png`;
}

export async function generateQrDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, { width: 512, margin: 2 });
}

/** Generate QR as PNG buffer (for API/serverless where filesystem may be read-only). */
export async function generateQrBuffer(slug: string, baseUrl: string): Promise<Buffer> {
  const url = `${baseUrl}/tree/${slug}`;
  const dataUrl = await QRCode.toDataURL(url, { width: 512, margin: 2 });
  const base64 = dataUrl.split(',')[1];
  if (!base64) throw new Error('Invalid QR data URL');
  return Buffer.from(base64, 'base64');
}
