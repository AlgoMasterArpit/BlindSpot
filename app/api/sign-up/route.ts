import { prisma } from '../../../lib/dbConnect';
import { sendVerificationEmail } from '../../../helper/sendVerificationEmail';
import bcrypt from 'bcryptjs';


export async function POST(request: Request) {
  try {
    // 1. Frontend se Data nikalo
    const { username, email, password } = await request.json();

    // 2. Check karo: Kya Username pehle se verified user ke paas hai?
    const existingUserVerifiedByUsername = await prisma.user.findFirst({
      where: {
        username,
        isVerified: true,
      },
    });

    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          //  agar me yha success and messgae me kuch bhi typo karu toh red line nhi aayegi jo ki aaani 
          //  chye as  tumne hi kha ki type define h  types/Apirespone file me ,  
          //  red line isiliyenhi aayegi kyuki humne btaya nhi ki ye message , success us apiresponse vale hi hone
          //  chye uske liye we need to import Apiresponse par hum abhi nhi kar rhe as vo apiresponse file me type
          //  define karna it will help us in frontend me typo se vha karege 
          success: false,
          message: 'Username is already taken',
        },
        { status: 400 }
      );
    }

    // 3. Check karo: Kya Email pehle se exist karta hai?
    //  in model we have User and yh
    // .a pe its prisma.user remember its prisma ke rules
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    // 4. OTP Generate karo (6 Digit ka Random Number)
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUserByEmail) {
      // CASE A: User hai aur VERIFIED bhi hai -> Galti (Register mat karne do)
      if (existingUserByEmail.isVerified) {
        return Response.json(
          {
            success: false,
            message: 'User already exists with this email',
          },
          { status: 400 }
        );
      } 
      // CASE B: User hai par VERIFIED NAHI hai (Matlab pichli baar sign up adhoora choda tha)
      else {
        // Password update karo (Naya wala)
        //  10 rounds of hashing
        const hashedPassword = await bcrypt.hash(password, 10);
        // Expiry time  of otp update karo (Ab se 1 ghanta)
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + 1);

        // Database update karo
        await prisma.user.update({
          where: { email },
          data: {
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry: expiryDate,
          },
        });
      }
    } else {
      // CASE C: Bilkul Naya User hai -> Naya account banao
      const hashedPassword = await bcrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      // Database mein naya user create karo
      await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          verifyCode,
          verifyCodeExpiry: expiryDate,
          isVerified: false,
          isAcceptingMessages: true,
        },
      });
    }

    // 5. Email Bhejo (Jo helper humne banaya tha)
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );

    // Agar Email fail ho gaya
    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        { status: 500 }
      );
    }

    // 6. Sab Success! 🎉
    return Response.json(
      {
        success: true,
        message: 'User registered successfully. Please verify your email.',
      },
      { status: 201 }
    );

  } 
  
  
  
  
  catch (error) {
    console.error('Error registering user', error);
    return Response.json(
      {
        success: false,
        message: 'Error registering user',
      },
      { status: 500 }
    );
  }
}
//  api test karte waqt error aarha tha ki   {
      //   success: false,
      //   message: 'Error registering user',
      // },
      // { status: 500 }
      //  toh  maine ye kia 
      // npx prisma db push
      // npx prisma generate( it update the node modules me prisma ka code)
      // npm run dev and then test karo api toh success aayega
      //  do  npm run dev then always check api in postman
      //  / also make sure abhi api test karne ke liye resend pe jo account  email id h vhi postman ki body me 
      //  honi chye tabhi mail jayega ye resend ki settings hoti h to avoid spam