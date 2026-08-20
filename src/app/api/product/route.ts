import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getProductDataAsync, updateProductData } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const product = await getProductDataAsync();
    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updated = updateProductData(body);
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
      revalidatePath('/admin');
      revalidatePath('/admin/product');
    } catch (e) {}
    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
