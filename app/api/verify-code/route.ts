import { prisma } from '@/lib/dbConnect';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, code } = await request.json();

    // URL se aane wale username ko decode karein (space wagera handle karne ke liye) basically slug vala kaam
    const decodedUsername = decodeURIComponent(username);

    // 1. User ko dhoondho
    const user = await prisma.user.findFirst({
      where: {
        username: decodedUsername,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // 2. Check karo code sahi hai ya nahi aur expire toh nahi hua
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      // Success! User ko verify karo
      await prisma.user.update({
        where: { email: user.email }, // Email unique key hai update ke liye
        data: {
          isVerified: true,
          verifyCode: "", // Code clear kar do
          verifyCodeExpiry: new Date(0) // Expiry bhi clear kar do
        },
      });

      return NextResponse.json(
        { success: true, message: 'Account verified successfully' },
        { status: 200 }
      );

    } else if (!isCodeNotExpired) {
      // Code expire ho gaya
      return NextResponse.json(
        { success: false, message: 'Verification code has expired. Please sign up again to get a new code.' },
        { status: 400 }
      );
    } else {
      // Code galat hai
      return NextResponse.json(
        { success: false, message: 'Incorrect verification code' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error verifying user', error);
    return NextResponse.json(
      { success: false, message: 'Error verifying user' },
      { status: 500 }
    );
  }
}