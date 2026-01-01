//  what getServerSession do ? it check browser se aane waali ccokie 
// Agar cookie sahi hai, toh ye aapko Session Object deta hai (jisme user ka naam, email, id hoti hai).

import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { User } from "next-auth";
//  next auth  ke pass uska ek default user hota h
// import { User } from "next-auth" karte hain, toh TypeScript aapka types wala file padhta hai aur samajh jata hai: ki mera default
//  user modified ho gya tha us file me 






// POST: Jab aap button dabate hain toh Database mein status badalna (Update karna).

// GET: Jab page load hota hai toh check karna ki abhi status kya hai (Read karna).




export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 }
    );
  }


// request.json(): Frontend (React) jab data bhejta hai, wo JSON format mein hota hai (e.g., { acceptMessages: true }). 
// Yeh line us packet ko khol kar acceptMessages ki value (True/False) nikal leti hai.




  const userId = user._id;



  const { acceptMessages } = await request.json();

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isAcceptingMessages: acceptMessages },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Message acceptance status updated successfully",
        updatedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to update user status to accept messages");
    return NextResponse.json(
      { success: false, message: "Failed to update user status to accept messages" },
      { status: 500 }
    );
  }
}

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
    const foundUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!foundUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        isAcceptingMessages: foundUser.isAcceptingMessages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in getting message acceptance status");
    return NextResponse.json(
      { success: false, message: "Error in getting message acceptance status" },
      { status: 500 }
    );
  }
}