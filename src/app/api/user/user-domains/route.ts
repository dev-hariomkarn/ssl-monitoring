// app/api/user-domains/route.js
import { connectToDB } from '@/lib/mongo';
import jwt from 'jsonwebtoken';
import Domain from '@/models/Domain';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const token = auth.split(' ')[1];
  let userId;
  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    userId = decoded.userId;
  } catch {
    return Response.json({ error: 'Invalid token' }, { status: 401 });
  }

  await connectToDB();
  const domains = await Domain.find({ userId }).sort({ createdAt: -1 });
  return NextResponse.json(domains);
}
