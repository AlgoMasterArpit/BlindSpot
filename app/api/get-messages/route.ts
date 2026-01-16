import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { User } from "next-auth";/*ye next auth ka user hai*/
// authuptions bnaya humne sign in ke route me 
//  ye file bas user ke feedbacks ko DB se leke aati hai and userid milti hai session se
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  //   agar session hai tohi vha se user nikle ga varna undefined return hoga
  const user: User = session?.user as User; 
  // "Ye jo user naam ka dabba (variable) main bana raha hoon, iske andar sirf wahi data aayega jo User blueprint(next js ka User) ko follow karega."
// blue print vala user yaani jo user import kia yaani  , next js ka user   , jisme name image email and image hogi and types file me humne usey 
//  modify kia tha toh hum user._id use kar paa rhe
  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 }
    );
  }

  // Humein database mein dhoondne ke liye user ki ID chahiye. Yeh ID humein session se mil gayi.
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
      { success: true, feedbacks: userWithFeedbacks.feedbacks }, // Frontend ko 'feedbacks' key hi bhej rahe hain
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