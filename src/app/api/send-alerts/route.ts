import { connectToDB } from '@/lib/mongo';
import User from '@/models/User';
import Domain from '@/models/Domain';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (!auth) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const token = auth.split(' ')[1];
    const { userId }: any = jwt.verify(token, process.env.JWT_SECRET!);

    await connectToDB();
    const user = await User.findById(userId);
    const domains = await Domain.find({ userId });

    const expiring = domains.filter(
      d => d.status === 'Expired' || d.status === 'Expiring soon'
    );

    if (expiring.length === 0) {
      return NextResponse.json({ message: 'No expiring domains to email.' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_PASS,
      },
    });

    const htmlList = expiring.map(d =>
      `<li><strong>${d.domain}</strong> - Status: ${d.status}, Expiry: ${d.expiryDate}</li>`
    ).join('');

    console.log('htmlList', htmlList)

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'SSL Expiry Alert from SSL Monitor',
      html: `<h3>Your domains with expiring SSL:</h3><ul>${htmlList}</ul>`,
    });

    return NextResponse.json({ message: 'Email sent successfully.' });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
