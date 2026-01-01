import { prisma } from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { username, content } = await request.json();

    // 1. User dhoondho jisko feedback dena hai  database se
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // 2. Check karo kya wo feedback accept kar raha hai?
    if (!user.isAcceptingMessages) {
      return NextResponse.json(
        { success: false, message: "User is not accepting feedbacks" },
        { status: 403 }
      );
    }

    // 3. Feedback create karo
    const newFeedback = await prisma.feedback.create({ // 👈 Change: 'message' -> 'feedback'
      data: {
        content,
        //  here ye user db se aaya hai jisko feedback dena hai yha types vali file ka koi role nhi kabhi samjhe
        //  uski vajah se we are accessing id directly
        userId: user.id,
        createdAt: new Date(),
      },
    });

    return NextResponse.json(
      { success: true, message: "Feedback sent successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.log("Error adding feedback ", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}