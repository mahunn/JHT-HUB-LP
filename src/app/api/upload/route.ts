import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const mimeType = file.type || 'image/jpeg';
    const base64 = buffer.toString('base64');
    const dataUrl = `data:${mimeType};base64,${base64}`;

    // Optionally write to local disk if in local development
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const ext = path.extname(file.name) || '.jpg';
      const cleanFileName = `product_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
      const filePath = path.join(uploadsDir, cleanFileName);
      fs.writeFileSync(filePath, buffer);
    } catch {
      // Ignore filesystem write error on serverless environments
    }

    // Always return dataUrl as primary URL so image is self-contained and never 404s
    return NextResponse.json({ success: true, url: dataUrl });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

