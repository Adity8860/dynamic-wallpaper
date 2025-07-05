import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const imgUrl = searchParams.get('img');

  if (!imgUrl) {
    return NextResponse.json({ error: 'Image URL missing' }, { status: 400 });
  }

  try {
    new URL(imgUrl); // Validate URL format
  } catch {
    return NextResponse.json({ error: 'Invalid image URL' }, { status: 400 });
  }

  try {
    const res = await fetch(imgUrl, {
      headers: { 'User-Agent': 'Next.js Image Downloader' },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch image: ${res.status} ${res.statusText}` },
        { status: res.status || 500 }
      );
    }

    const contentType = res.headers.get('Content-Type') || 'application/octet-stream';
    if (!contentType.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Fetched content is not an image' },
        { status: 400 }
      );
    }

    const arrayBuffer = await res.arrayBuffer();
    const extension = contentType.split('/')[1]?.split(';')[0] || 'jpg';
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const finalExtension = validExtensions.includes(extension) ? extension : 'jpg';

    return new NextResponse(arrayBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="downloaded_image.${finalExtension}"`,
      },
    });
  } catch (err) {
    console.error('Error in /api/download:', err.message);
    return NextResponse.json(
      { error: `Server error: ${err.message}` },
      { status: 500 }
    );
  }
}