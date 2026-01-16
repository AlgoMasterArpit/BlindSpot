import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/lib/dbConnect";
import { NextResponse } from "next/server"; // Using NextResponse for consistency
import { User } from "next-auth";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ messageid: string }> }
) {
  // ✅ FIX 1: Extract 'messageid' from the awaited params object
  const { messageid } = await params;

  // 2. Session Check (Security)
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !user) {
    return NextResponse.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 }
    );
  }

  // ✅ FIX 2: Safe User ID extraction (Handles both _id and id)
  const userId = user._id || user.id;

  try {
    // 3. Prisma Delete Logic (Feedback Model)
    const result = await prisma.feedback.deleteMany({
      where: {
        id: messageid,     // ✅ Use the string ID extracted above
        userId: userId     // ✅ Use the safe User ID
      }
    });

    // 4. Result Check
    if (result.count === 0) {
      return NextResponse.json(
        { success: false, message: "Feedback not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Feedback Deleted Successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.log("Error deleting feedback:", error);
    return NextResponse.json(
      { success: false, message: "Error deleting feedback" },
      { status: 500 }
    );
  }
}