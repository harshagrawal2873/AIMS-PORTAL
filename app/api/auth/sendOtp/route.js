// import { connectToDatabase } from '@/lib/dbConnect';
import { connectDB } from '@/utils/db';
import Otp from '@/models/Otp';
import { sendOtpEmail } from '@/lib/mailer';

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ message: 'Email is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // await connectToDatabase();
    await connectDB();

    // Store OTP in DB (overwrite if email exists)
    await Otp.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { upsert: true }
    );

    // Send OTP via email
    await sendOtpEmail(email, otp);

    return new Response(
      JSON.stringify({ message: 'OTP sent successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error sending OTP:', error);
    return new Response(
      JSON.stringify({ message: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
