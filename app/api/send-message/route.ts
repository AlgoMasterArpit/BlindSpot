import { prisma } from '@/lib/dbConnect'; // Agar ye laal ho, toh relative path '../lib/dbConnect' try karein
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { username, content } = await request.json();

    // Debugging ke liye log lagayein
    console.log("📨 Receiving Feedback for:", username);

    // FIX 1: 'findUnique' ki jagah 'findFirst' use karein (Zyada safe hai)
    const user = await prisma.user.findFirst({
      where: { 
        username: username 
      },
    });

    if (!user) {
      console.log("❌ User not found in DB");
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // 2. Check accepting status
    if (!user.isAcceptingMessages) {
      return NextResponse.json(
        { success: false, message: "User is not accepting feedbacks" },
        { status: 403 }
      );
    }

    // FIX 2: Feedback create
    const newFeedback = await prisma.feedback.create({
      data: {
        content: content,
        userId: user.id,
        createdAt: new Date(),
      },
    });

    console.log("✅ Feedback Saved:", newFeedback.id);

    return NextResponse.json(
      { success: true, message: "Feedback sent successfully" },
      { status: 200 }
    );

  } catch (error) {
    // Error ko console me pura print karein
    console.error("❌ Error adding feedback:", error);
    
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}