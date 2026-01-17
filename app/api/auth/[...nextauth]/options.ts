import { NextAuthOptions } from "next-auth";
//  next auth ooptions imported for sign in with goooogle ya github
// NextAuth by default Google/GitHub login ke liye bana tha. Agar humein 
// "Email & Password" wala login chahiye, toh humein ye specific CredentialsProvider import karna padta hai.
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/dbConnect"; // Note: Maine path thoda clean kar diya (@/ use karke), agar error aaye to wapas "../../../../" kar lena.

export const authOptions: NextAuthOptions = {
  // 1. Configure Providers (Login ke tareeke)
  providers: [
    //  inside  provider we will write  the way jis jis se hum login kar sakte hai
    //  agar humein email password se login karna hai to humein credentials provider use karna padega
    CredentialsProvider({
      id: "credentials",/*Yeh is provider ka Unique Naam (Internal ID) hai takki  fronend isey call kar sake 
      //  and usey bhi pta chal jaye ki hum kis provider se login kara rhe {google, ya email/password}.*/
      //  ye name :credentials is useful agar hum next ka signin page use karte , as wha likha aata singn in with [name]
      name: "Credentials",
      credentials: {/* this define ki login form me kya kya hona chahye*/
        //  hum apna custom  login in page bnayege na ki next ka login page use karege toh abhi k liye hum yha kuch bhi label
        //  me likh sakte hai , as vha pe page bnate hue we will give our own label
        //  yja we write email amd pass  , par yaad rhe it is used jab next ka page use karte , 
        //  since we r using custom page toh jo data frontend se  aayega that is checke d neeche  authorize function
        //  me  !credentials.identifier || !credentials.password)
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
        //  due to type :password Isse box mein jo type hoga wo •••••• ban jayega (hidden rahega).
      },
      // Yahan asli login logic likha jata hai
      // : any: Yeh TypeScript ka rule hai.

      // Hum TypeScript ko bol rahe hain: "Dekho bhai, credentials ke andar kya aayega mujhe abhi pakka nahi pata (maybe email, maybe username, maybe phone number). 
      // Toh please strict checking mat karna, isey 'Any' (kuch bhi) man kar jaane do."
      // <any>: Hum bol rahe hain ki jo data wapas aayega (User Object),
      //  wo bhi kuch bhi ho sakta hai. TypeScript us return value ko check nahi karega.



      // Jab bhi koi banda "Sign In" button dabata hai, toh NextAuth is authorize function ko call karta hai aur poochta hai:
      // "Bhai, check karke batao ki is bande ko andar aane dein ya bahar nikaal dein?"
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
            throw new Error("Can not find username ");
          }

          // Step C: Check karo Verified hai ya nahi (Optional)
          if (!user.isVerified) {
             throw new Error("Please verify your Email");
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
      // // Yeh tab chalta hai jab token decrypt ho chuka hota hai.
      if (user) {
        token._id = user.id?.toString(); // ID save kar li
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.username = user.username;
        // token.favoriteColor = "Red"; // ❌ ERROR! (Humne JWT interface inside types/next-auth.d.ts mein 'favoriteColor' define nahi kiya)
      }
      return token;/*// Ab ye token encrypted hokar wapas cookie ban jayega*/
    },
    // Session (Frontend)  ko bhejo backend me bnake
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
  //   NextAuth ke paas pehle se ek bana-banaya Login Page hota hai. 
  //  usko ovwrwrite karne ke liye humein yeh page option use karna padta hai.
  pages: {
    signIn: '/auth/sign-in', // Hum apna khud ka page banayenge
  },

  // 4. Session Strategy
  //    save the user data in in cookie we sent to browser
  session: {
    strategy: "jwt",
  },
  //used to decript the jwt token
  //  token ka decription next auth khud under hood karta hai and usey DB se match har baar nhi karta bas agar
  //  decript hogya token toh shi user hain maan kar kaam karta hai
  secret: process.env.NEXTAUTH_SECRET,
};