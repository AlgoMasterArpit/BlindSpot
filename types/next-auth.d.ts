import 'next-auth';
import { DefaultSession } from 'next-auth';

// Jo data aapke schema.prisma mein hai, aur aap chahte hain ki wo Frontend (React) tak 
// pahunche bina alag se API call kiye, wo sab yahan define karna padta hai.like username
// isVerified?: boolean;
    // isAcceptingMessages?
    // username?:



// Yeh teeno interfaces (User, JWT, Session) sirf TypeScript ki santushti (satisfaction) ke liye hain. 
// Inse login hota nahi hai, ye bas login ke data ko manage karne mein madad karte hain.


// 1. Hum existing 'Session' interface ko modify kar rahe hain
// // Hum TypeScript ko bol rahe hain: 
  // "NextAuth module ko 'Re-declare' (Dobara open) karo."











//    we need to define thses three interfaces so that we can use them in our project without getting error
declare module 'next-auth' {
  interface User {
// Ho sakta hai kuch users Google se login karein aur unka username set na ho.
// Ho sakta hai token corrupt ho jaye. Agar hum ? nahi lagayenge, toh TypeScript bolega: "Guarantee do ki username hamesha hoga!" 
// Hum guarantee nahi de sakte, isliye hum kehte hain: "Ho bhi sakta hai, nahi bhi (Optional)."
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
  
  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
    } & DefaultSession['user']; // Default keys (name, email, image) ko bhi rakho
  }
}

// 2. Hum existing 'JWT' interface ko modify kar rahe hain
declare module 'next-auth/jwt' {
  interface JWT {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
}









// By default, NextAuth kehta hai: " i will provide 3 things to user in front end

// Name

// Email

// Image (Photo)

// Lekin Humari Problem: Humare Database (User model) mein extra cheezein hain jo humein chahiye:

// _id (User ki ID)

// username (Arpit123)

// isVerified (Blue Tick)

// isAcceptingMessages (Switch)
// : Jab aap code mein likhte hain session.user.username so it was giving error so we modified this file