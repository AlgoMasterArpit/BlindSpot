import { z } from 'zod';
import { prisma } from '@/lib/dbConnect';
import { usernameValidation } from '@/schemas/signUpSchema';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
// Is route ke liye Query Schema banate hain
// Humne jo rules signUpSchema mein banaye thay (ki username kam se kam 2 character ka ho, 
// special character na ho), wahi rules hum yahan bhi use kar rahe hai


//  main motive of this file is ki username in the DB should be unique


//  note isme jo username key h that should match  with key in  querParams same key honi chye 
const UsernameQuerySchema = z.object({
  username: usernameValidation,/*username should fulfill usernamevalidation*/
});


// Query Parameters :  yeh Server ko extra information dete hain ki user ko exactly kya chahiye.
// ? ke baad se query parameters start hote hain
//  serach params help to read that ?ke baad vala part and it has built in function like get







// GET function banaya (kyunki hum data sirf padh rahe hain, bhej nahi rahe)
export async function GET(request: Request) {
  try {
    // URL se query params nikalna (e.g., localhost:3000/api/check-username?username=arpit)
    //  search params me poora url aajata hai and then hum .get use karke username nikaal lete hai
    //  ye url frontend se aayega jab user api hit karega to check karne ke liye ki username unique hai ya nahi
    const { searchParams } = new URL(request.url);
    // queryParam is variable here just
    const queryParam = {
      username: searchParams.get('username'),
    };
// console.log(queryParam); 
// Output: { username: "tyagi" }

    // 1. Validate with Zod
    //  safe parse server crash hone se bachaata hai agar validation fail ho jaye
    //  bas paas and fail btata hai
    //  hum bas username jo query param se aaya usey paas karege to check ki zod rule follow kar rha h ya nhi
    const result = UsernameQuerySchema.safeParse(queryParam);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];/* agar username format me kuch gadbad nhi h ya nhi ?check that*/  
        return NextResponse.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(', ')/*, se we join all errors*/
              : 'Invalid query parameters',
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    // 2. Check Database
    const existingVerifiedUser = await prisma.user.findFirst({
      where: {
        username: username,
        isVerified: true, // Sirf verified users ka username block karenge
      },
    });

    if (existingVerifiedUser) {
      return NextResponse.json(
        { success: false, message: 'Username is already taken' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Username is unique' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error checking username', error);
    return NextResponse.json(
      { success: false,
         message: 'Error checking username' },
      { status: 500 }
    );
  }
}




//  for post man
// http://localhost:3000/api/check-username-unique?username=tyagi 
//  get request
// key me username value me naam
// 
