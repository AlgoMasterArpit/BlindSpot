import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { User } from "next-auth";


export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User; 

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 }
    );
  }

  const userId = user._id;

  try {
    //  is user ke saare feedbacks nikal lo
    // Is code se USER nikalta hai, lekin uske andar uska DATA (feedbacks) bhi saath mein pack hokar aata hai.
    //  inside feedbacks array
    const userWithFeedbacks = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        feedbacks: {
          orderBy: {
            createdAt: 'desc',
          }
        }
      }
    });

    if (!userWithFeedbacks) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 401 }
      );
    }    

    return NextResponse.json(
        //  ye feebacks  schema.prisma me h feedbacks  feedback[]
      { success: true, messages: userWithFeedbacks.feedbacks }, // Frontend ko 'messages' key hi bhej rahe hain
      { status: 200 }
    );

  } catch (error) {
    console.log("An unexpected error occurred: ", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}