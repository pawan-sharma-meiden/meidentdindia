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
        createdAt: { lt: twentyFourHoursAgo },
      },
      select: { id: true, fileUrl: true },
      take: 100, 
    });

    if (abandonedFiles.length === 0) {
      return NextResponse.json({ message: 'No files to clean up.' });
    }

    // ─── FIX 1: Strip query parameters from URLs ───
    // Stored URLs often have ?token=... which breaks del()
    const urlsToDelete = abandonedFiles.map((f) => {
      try {
        const url = new URL(f.fileUrl);
        return `${url.origin}${url.pathname}`;
      } catch {
        console.error('Invalid URL in DB:', f.fileUrl);
        return null;
      }
    }).filter(Boolean) as string[];

    console.log('🧹 Found', abandonedFiles.length, 'files');
    console.log('Clean URLs:', urlsToDelete);

    // ─── FIX 2: Delete individually instead of batch ───
    // Batch del([url1, url2]) can fail silently if one URL is bad
    let deletedBlobCount = 0;
    const failedUrls: string[] = [];

    for (const url of urlsToDelete) {
      try {
        await del(url);
        deletedBlobCount++;
        console.log('✅ Deleted:', url);
      } catch (blobError) {
        failedUrls.push(url);
        console.error('❌ Failed:', url, blobError);
      }
    }

    // ─── FIX 3: Only delete DB records for successfully deleted blobs ───
    // This prevents "ghost records" where DB is gone but blob remains
    const successfullyDeletedIds = abandonedFiles
      .filter((f) => {
        const cleanUrl = new URL(f.fileUrl);
        const normalized = `${cleanUrl.origin}${cleanUrl.pathname}`;
        return !failedUrls.includes(normalized);
      })
      .map((f) => f.id);

    if (successfullyDeletedIds.length > 0) {
      await prisma.pendingUpload.deleteMany({
        where: { id: { in: successfullyDeletedIds } },
      });
    }

    console.log(`🧹 Janitor: ${deletedBlobCount} blobs deleted, ${successfullyDeletedIds.length} DB records removed`);

    return NextResponse.json({
      success: true,
      deletedBlobCount,
      dbDeletedCount: successfullyDeletedIds.length,
      failedCount: failedUrls.length,
      failedUrls,
    });

  } catch (error) {
    console.error('Cron Job Failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}