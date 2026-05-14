import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { del } from '@vercel/blob';
import path from 'path';
import { rescueFilesFromContent } from "@/lib/rescue-files";
import { extractUrlsFromContent } from "@/lib/extract-urls";

async function getAllSectionIds(rootId: string): Promise<string[]> {
    const sections = await prisma.section.findMany({
        where: { parentId: rootId },
        select: { id: true }
    });
    let ids = [rootId]; 
    for (const section of sections) {
        const descendantIds = await getAllSectionIds(section.id);
        ids = [...ids, ...descendantIds];
    }
    return ids;
}

export async function PUT(request: Request) {
    try {
        const url = new URL(request.url);
        const id = url.pathname.split('/').pop();

        if (!id) {
            return NextResponse.json({ error: 'ID missing' }, { status: 400 });
        }

        const body  = await request.json();
        const { title, content, order } = body;

        const oldSection = await prisma.section.findUnique({
            where: { id },
            select: { content: true }
        });

        if (!oldSection) {
            return NextResponse.json({ error: 'Section not found' }, { status: 404 });
        }

        const updatedSection = await prisma.section.update({
            where: { id },
            data: { title, content, order },
        });

        if (content) {
            await rescueFilesFromContent(content);

            const oldUrls = extractUrlsFromContent(oldSection.content);
            const newUrls = extractUrlsFromContent(content);

            const removedUrls = oldUrls.filter(url => !newUrls.includes(url));

            if (removedUrls.length > 0) {
                const blobUrls = removedUrls.filter(u => u.includes('public.blob.vercel-storage.com'));

                for (const url of blobUrls) {
                    try {
                        await prisma.pendingUpload.upsert({
                            where: { fileUrl: url },
                            update: { createdAt: new Date() }, 
                            create: {
                                fileUrl: url,
                                fileKey: url, 
                                createdAt: new Date()
                            }
                        });
                    } catch (err) {
                        console.warn(`Failed to soft-delete file: ${url}`, err);
                    }
                }
                if (blobUrls.length > 0) {
                    console.log(`♻️ Recycled: Moved ${blobUrls.length} files to Pending Uploads (will be deleted in 24h if not restored).`);
                }
            }
        }

        return NextResponse.json(updatedSection, { status: 200 });
    }

    catch (error) {
        console.error('Error updating section:', error);
        return NextResponse.json({ error: 'Failed to update section' }, { status: 500 });
    }
}

// export async function DELETE(request: Request) {
//     try {
//         const url = new URL(request.url);
//         const id = url.pathname.split('/').pop();
        
//         if (!id) {
//             return NextResponse.json(
//                 { error: 'Section ID is missing from the URL' },
//                 { status: 400 }
//             );
//         }

//         const childCount = await prisma.section.count({
//             where: { parentId: id },
//         });

//         if (childCount > 0) {
//             return NextResponse.json(
//                 { error: 'Cannot delete section with existing child sections' },
//                 { status: 400 }
//             );
//         }

//         await prisma.section.delete({
//             where: { id },
//         });

//         return new NextResponse(null, { status: 204 });
//     }

//     catch (error) {
//         console.error('Error deleting section:', error);
        
//         if ((error as any).code === 'P2025') {
//             return NextResponse.json({ error: 'Section not found' }, { status: 404 });
//         }
//         return NextResponse.json(
//             { error: 'Failed to delete section' },
//             { status: 500 },
//         );
//     }
// }
export async function DELETE(request: Request) {
    try {
        const url = new URL(request.url);
        const id = url.pathname.split('/').pop();
        
        if (!id) return NextResponse.json({ error: 'ID missing' }, { status: 400 });

        const allSectionIds = await getAllSectionIds(id);

        const sectionsToDelete = await prisma.section.findMany({
            where: { id: { in: allSectionIds } },
            select: { id: true, content: true } 
        });

        const imagesToDelete = await prisma.image.findMany({
            where: { sectionId: { in: allSectionIds } },
            select: { url: true }
        });

        const documentsToDelete = await prisma.document.findMany({
            where: { sectionId: { in: allSectionIds } },
            select: { url: true }
        });

        let allUrlsToDelete = [
            ...imagesToDelete.map(i => i.url),
            ...documentsToDelete.map(d => d.url)
        ];

        sectionsToDelete.forEach(section => {
            const editorUrls = extractUrlsFromContent(section.content);
            allUrlsToDelete = [...allUrlsToDelete, ...editorUrls];
        });

        if (allUrlsToDelete.length > 0) {
             try {
                await del(allUrlsToDelete);
            } catch (err) {
                console.warn('Error deleting files from Blob storage', err);
            }
        }

        await prisma.section.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    }
    catch (error) {
        console.error('Error deleting section:', error);
        if ((error as any).code === 'P2025') {
            return NextResponse.json({ error: 'Section not found' }, { status: 404 });
        }
        return NextResponse.json({ error: 'Failed to delete section' }, { status: 500 });
    }
}