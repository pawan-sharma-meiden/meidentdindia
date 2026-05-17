import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { revalidateTag } from 'next/cache';

type Params = { params: Promise<{ key: string }> };

type SessionUserWithRole = { role?: string };

export async function GET(_req: NextRequest, { params }: Params) {
  const { key } = await params;

  try {
    const config = await prisma.siteConfig.findUnique({
      where: { key },
    });

    if (!config) {
      return NextResponse.json(
        { error: `No config found for key: '${key}'` },
        { status: 404 }
      );
    }

    return NextResponse.json(config.data);
  } catch (error) {
    console.error(`[GET /api/site-config/${key}]`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ── PUT /api/site-config/[key] ─────────────────────────────────────────────
// Admin only — requires a valid NextAuth session with role: 'admin'.
export async function PUT(req: NextRequest, { params }: Params) {
  const { key } = await params;

  // ── Auth check ────────────────────────────────────────────────────────────
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized — login required' },
      { status: 401 }
    );
  }

  if (session.user?.role !== 'admin') {
    return NextResponse.json(
      { error: 'Forbidden — admin role required' },
      { status: 403 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    );
  }

  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return NextResponse.json(
      { error: 'Body must be a JSON object' },
      { status: 400 }
    );
  }

  try {
    const config = await prisma.siteConfig.upsert({
      where: { key },
      update: { data: body },
      create: { key, data: body },
    });

    // Bust the Next.js cache so public pages reflect changes immediately
    revalidateTag(`site-config`, {});
    revalidateTag(`site-config:${key}`, {});

    return NextResponse.json({
      success: true,
      key: config.key,
      updatedAt: config.updatedAt,
    });
  } catch (error) {
    console.error(`[PUT /api/site-config/${key}]`, error);
    return NextResponse.json(
      { error: 'Failed to save config' },
      { status: 500 }
    );
  }
}