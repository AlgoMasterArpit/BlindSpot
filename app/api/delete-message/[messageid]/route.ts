import { getServerSession } from "next-auth";
 import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/dbConnect";
import { User } from "next-auth";

export async function DELETE(
  request: Request,
  { params }: { params: { messageid: string } }
) {
  // 1. URL se ID nikali
  const feedbackId = params.messageid;
//  ye session tells ki user lohin h bhi ya nhi 
  // 2. Session Check (Security)
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !user) {
    return Response.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 }
    );
  }

  try {
    // 3. Prisma Delete Logic (Feedback Model)
    // Hum 'deleteMany' use kar rahe hain safety ke liye
    
    const result = await prisma.feedback.deleteMany({
      where: {
        id: feedbackId,      // Feedback ki ID
        userId: user._id     // 👈 Check: Ye Feedback isi user ka hona chahiye
      }
    });

    // 4. Result Check
    // Agar 'count' 0 hai, matlab ya toh feedback nahi mila ya user galat hai
    if (result.count === 0) {
      return Response.json(
        { success: false, message: "Feedback not found or unauthorized" },
        { status: 404 }
      );
    }

    return Response.json(
      { success: true, message: "Feedback Deleted Successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.log("Error deleting feedback:", error);
    return Response.json(
      { success: false, message: "Error deleting feedback" },
      { status: 500 }
    );
  }
}