// import { connectToDatabase } from '@/lib/dbConnect';
import {connectDB} from "@/utils/db"
import Otp from '@/models/Otp';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie'; // named import of serialize required for vercel deployment local is fine with both >>
import Admin from "@/models/Admin";
import Student from "@/models/Student";
import { Professor } from "@/models/Professor";


const generateToken = (newToken) => {
  const token = jwt.sign(
    newToken,
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  return token;
};

// Handle POST request for OTP verification
export async function POST(req) {
  console.log('Received request for OTP verification:', req.method);

  const { email, otp } = await req.json();  // Updated for the app structure
  console.log('Received email:', email);
  console.log('Received OTP:', otp);

  if (!email || !otp) {
    console.log('Email or OTP missing');
    return new Response(
      JSON.stringify({ message: 'Email and OTP are required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    // await connectToDatabase();
    await connectDB();
    console.log('Connected to database');

    // Find OTP record
    const otpRecord = await Otp.findOne({ email, otp });
    console.log('OTP Record found:', otpRecord);

    if (!otpRecord) {
      console.log('Invalid or expired OTP for:', email);
      return new Response(
        JSON.stringify({ message: 'Invalid or expired OTP' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check if OTP is expired
    const isOtpExpired = otpRecord.expiresAt && otpRecord.expiresAt < new Date();
    if (isOtpExpired) {
      console.log('OTP expired for:', email);
      await Otp.deleteOne({ email });
      return new Response(
        JSON.stringify({ message: 'OTP expired, please request a new one' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // OTP verified, delete OTP from DB
    await Otp.deleteOne({ email });
    console.log('OTP deleted from database for:', email);

    // Generate JWT token
    await connectDB();
    var newToken = {}
    newToken.email = email
    const admin = await Admin.findOne({email : newToken.email});
    const professor = await Professor.findOne({email : newToken.email});
    const student = await Student.findOne({email : newToken.email})
    console.log(newToken)
    console.log(admin)
    // console.log(professor)
    // console.log(student)
    if(admin) {
      newToken.id = admin.id;
      newToken.role = "admin";
      console.log("hello ADMIN ", newToken);
    }
    else if(professor) {
      newToken.id = professor.id
      newToken.role = "professor";
    }
    else if(student) {
      newToken.id = student.id
      newToken.role = "student";
    }
    else{
      console.log(`User Not Registered: ${email}`);
      throw new Error("User not registered");
    }
    const token = generateToken(newToken);

    // Set the JWT token as an HTTP-only cookie
    return new Response(
      JSON.stringify({ message: 'OTP verified successfully',
         redirectTo: '/home' ,
         user: { email: newToken.email, role: newToken.role , id: newToken.id }}),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': serialize('authToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production' ? true : false, // For local testing
            maxAge: 3600,
            path: '/',
            sameSite: 'strict'
          }),
        },
      }
    );
  }catch (error) {
    console.error('Error verifying OTP:', error.message);
    
    const errorMessage = error.message === "User not registered"
      ? "User not registered."
      : "Internal server error. Please try again later.";
  
    return new Response(
      JSON.stringify({ errormessage: errorMessage }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }  // Change status to 400 for user errors
    );
  }
}
