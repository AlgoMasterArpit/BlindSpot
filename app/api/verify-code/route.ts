import { prisma } from '@/lib/dbConnect';
import { NextResponse } from 'next/server';
import { json } from 'stream/consumers';

export async function POST(request: Request) {
  try {
    //  ye username and code user ne dala hai toh hum usse le rhe hai ye data frontend se aayega 
    //  hum page.tsx bnayege verify k liye vha pe ye data dalaege and api hit kargege ye vali
    //  and data bhej denge vo  vha se 

    // 
    const { username, code } = await request.json();

    // URL se aane wale username ko decode karein (space wagera handle karne ke liye) basically slug vala kaam
    //  jab api hit hogi  froned se and usme data like username humne likha arpit tyagi 
    //  toh browser space and special  characters allow nhi karta toh hume backend me username: arpit%20tyagi milega
    //  toh usko shi karne k liye we used  decodeURIComponent function
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


// now otp generate kia Db me save kia happend in signup /routeModule.ts and mail me usey bhej dia itta kaam toh hua in send verification mail file me , 
// but  ye vo  file kosi h that check ki haa user ne code daala and that Matches to DB me jo code tha




// body me raw me json
//  for postman 
// {
  // "username": "arpit",
  // "code": "123456"
// }