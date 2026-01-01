import NextAuth, { NextAuthOptions } from "next-auth";

// NextAuth by default Google/GitHub login ke liye bana tha. Agar humein 
// "Email & Password" wala login chahiye, toh humein ye specific CredentialsProvider import karna padta hai.
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "../../../../lib/dbConnect";

export const authOptions: NextAuthOptions = {
  // 1. Configure Providers (Login ke tareeke)
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      // Yahan asli login logic likha jata hai
// : any: Yeh TypeScript ka rule hai.

// Hum TypeScript ko bol rahe hain: "Dekho bhai, credentials ke andar kya aayega mujhe abhi pakka nahi pata (maybe email, maybe username, maybe phone number). 
// Toh please strict checking mat karna, isey 'Any' (kuch bhi) man kar jaane do."
// <any>: Hum bol rahe hain ki jo data wapas aayega (User Object),
//  wo bhi kuch bhi ho sakta hai. TypeScript us return value ko check nahi karega.
    
      async authorize(credentials: any): Promise<any> {
        // Step A: Check karo credentials aaye hain ya nahi
        if (!credentials.identifier || !credentials.password) {
            // email ki jagah identifier word use kiya hai, taaki user Email ya Username kuch bhi daal sake.
            throw new Error("Email aur Password dono chahiye");
        }

        try {
          // Step B: User ko dhoondho (Email ya Username se)
          const user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: credentials.identifier }, // Ya toh email match kare
                { username: credentials.identifier }, // Ya username match kare
              ],
            },
          });

          if (!user) {
            throw new Error("Koi user nahi mila is email se");
          }

          // Step C: Check karo Verified hai ya nahi (Optional)
          if (!user.isVerified) {
             throw new Error("Pehle apna email verify karein");
          }

          // Step D: Password Check karo (Bcrypt se)
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,/*// User ne jo abhi type kiya (e.g., "cat123")*/
            user.password /*Database mein jo encrypted hai (e.g., "$2b$10$...")*/
          );

          if (isPasswordCorrect) {
            // Success: User object return karo
            return user;
          } else {
            throw new Error("Wrong Password");
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  
  // 2. Configure Callbacks (Session mein extra data daalne ke liye)
  callbacks: {
    // JWT Token banate waqt
    async jwt({ token, user }) {
      if (user) {
        token._id = user.id?.toString(); // ID save kar li
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
        // token.favoriteColor = "Red"; // ❌ ERROR! (Humne JWT interface inside types/next-auth.d.ts mein 'favoriteColor' define nahi kiya)
      }
      return token;
    },
    // Session (Frontend)  ko bhejo backend me bnake
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
  },

  // 3. Configure Pages (Custom Login Page)
//   extAuth ke paas pehle se ek bana-banaya Login Page hota hai. 
//  usko ovwrwrite karne ke liye humein yeh page option use karna padta hai.
  pages: {
    signIn: '/sign-in', // Hum apna khud ka page banayenge
  },

  // 4. Session Strategy
//    save the user data in in cookie we sent to browser
  session: {
    strategy: "jwt",
  },
  //used to decript the jwt token
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

// GET Request: Jab browser session maangta hai (useSession).

// POST Request: Jab user Login form submit karta hai (Email/Pass bhejta hai).
// Dono kaam ye akela handler function manage karega.
export { handler as GET, handler as POST };















