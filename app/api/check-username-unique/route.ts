import { z } from 'zod';
import { prisma } from '@/lib/dbConnect';
import { usernameValidation } from '@/schemas/signUpSchema';
import { NextResponse } from 'next/server';

// Is route ke liye Query Schema banate hain
// Humne jo rules signUpSchema mein banaye thay (ki username kam se kam 2 character ka ho, 
// special character na ho), wahi rules hum yahan bhi use kar rahe hai


//  main motive of this file is ki username in the DB should be unique

const UsernameQuerySchema = z.object({
  username: usernameValidation,/*username should fulfill usernamevalidation*/
});
// GET function banaya (kyunki hum data sirf padh rahe hain, bhej nahi rahe)
export async function GET(request: Request) {
  try {
    // URL se query params nikalna (e.g., localhost:3000/api/check-username?username=arpit)
    //  search params me poora url aajata hai
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get('username'),
    };

    // 1. Validate with Zod
    const result = UsernameQuerySchema.safeParse(queryParam);

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return NextResponse.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(', ')
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