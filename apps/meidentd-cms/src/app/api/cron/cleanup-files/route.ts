export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { del } from '@vercel/blob';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const abandonedFiles = await prisma.pendingUpload.findMany({
      where: {
        createdAt: {
          lt: twentyFourHoursAgo,
        },
      },
      select: { id: true, fileUrl: true },
      take: 100, 
    });

    // ---- FOR TESTING (1 Minute) ----

    // const thresholdTime = new Date(Date.now() - 1 * 60 * 1000);

    // const abandonedFiles = await prisma.pendingUpload.findMany({
    //   where: {
    //     createdAt: {
    //       lt: thresholdTime,
    //     },
    //   },
    //   select: { id: true, fileUrl: true },
    //   take: 100, 
    // });

    if (abandonedFiles.length === 0) {
      return NextResponse.json({ message: 'No files to clean up.' });
    }

    const urlsToDelete = abandonedFiles.map((f) => f.fileUrl);
    
    try {
        await del(urlsToDelete);
    } catch (blobError) {
        console.warn("Blob deletion warning (files might already be gone):", blobError);
    }

    await prisma.pendingUpload.deleteMany({
      where: {
        id: { in: abandonedFiles.map((f) => f.id) },
      },
    });

    console.log(`🧹 Janitor: Cleaned up ${abandonedFiles.length} abandoned files.`);

    return NextResponse.json({
      success: true,
      deletedCount: abandonedFiles.length,
      deletedUrls: urlsToDelete,
    });

  } catch (error) {
    console.error('Cron Job Failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}