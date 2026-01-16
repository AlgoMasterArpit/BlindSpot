import { prisma } from '@/lib/dbConnect';
import { NextResponse } from 'next/server';
import { sendVerificationEmail } from '../../../helper/sendVerificationEmail'; // Aapka helper function
export const dynamic = 'force-dynamic';
export async function POST(request: Request) {
  try {
    const { username } = await request.json();
    const decodedUsername = decodeURIComponent(username);

    // 1. User dhoondho
    const user = await prisma.user.findFirst({
      where: { username: decodedUsername },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        { success: false, message: "User is already verified" },
        { status: 400 }
      );
    }

    // 2. Naya Code Generate Karo
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // 3. User ko Update Karo (Naya Code Save karo)
    await prisma.user.update({
      where: { email: user.email },
      data: {
        verifyCode: verifyCode,
        verifyCodeExpiry: new Date(Date.now() + 3600000), // 1 Hour Expiry
      },
    });

    // 4. Email Bhejo
    const emailResponse = await sendVerificationEmail(
      user.email,
      user.username,
      verifyCode
    );

    if (!emailResponse.success) {
      return NextResponse.json(
        { success: false, message: emailResponse.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Verification code sent successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error resending code", error);
    return NextResponse.json(
      { success: false, message: "Error resending code" },
      { status: 500 }
    );
  }
}