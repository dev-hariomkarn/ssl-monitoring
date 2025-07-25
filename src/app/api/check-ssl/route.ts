// app/api/check-ssl/route.js
import { connectToDB } from '@/lib/mongo';
import Domain from '@/models/Domain';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import tls from 'tls';

export async function POST(req: NextRequest) {
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

  const { domain } = await req.json();
  await connectToDB();

  try {
    const cert: any = await new Promise((resolve, reject) => {
      const socket = tls.connect({ host: domain, port: 443, servername: domain, rejectUnauthorized: false }, () => {
        const cert = socket.getPeerCertificate();
        socket.end();
        resolve(cert);
      });
      socket.on('error', reject);
    });

    const issueDate = new Date(cert.valid_from).toISOString().split('T')[0];
    const expiryDate = new Date(cert.valid_to).toISOString().split('T')[0];
    const daysLeft = Math.floor((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    const status = daysLeft <= 0 ? 'Expired' : daysLeft <= 7 ? 'Expiring soon' : 'OK';

    const record = await Domain.create({ userId, domain, issueDate, expiryDate, daysLeft, status });

    return NextResponse.json(record);
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch SSL info' }, { status: 500 });
  }
}
