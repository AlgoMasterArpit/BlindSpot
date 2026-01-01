import { Feedback } from "@prisma/client";

export interface ApiResponse {
  success: boolean;
  message: string;
  isAcceptingMessages?: boolean; // Optional: Sirf dashboard status check karte waqt chahiye
  feedbacks?: Array<Feedback>;     // Optional: Jab employees ke messages fetch karenge tab chahiye
}

//  api response ko 2 part me samjo 2 are what are necessary and other 2 are as per project 
//  1. success: boolean

// Kyun chahiye: Frontend (React) ko faisla lena hota hai.

// if (response.success === true) -> User ko Dashboard par bhejo.

// else -> Error dikhao.

// Iske bina Frontend confuse ho jayega ki request pass hui ya fail.

// 2. message: string

// Kyun chahiye: Frontend user ko kya bol kar notify kare?

// "Password changed!"

// "Invalid OTP"
// Hum backend se hi message bhejte  in different files  taaki frontend par hardcode na karna pade.

// isAcceptingMessages and Feedback should be in schema.prisma file as well.
// Ab Frontend Developer ko pata hai ki chahe koi bhi API hit karun:

// Hamesha response.success check karna hai.

// Hamesha response.message print karna hai.

// Agar data chahiye toh response.feedbacks check karna hai





// Jab frontend developer (axios ya fetch se) data mangayega, wo likhega:
// const data: ApiResponse = await response.json();
// console.log(data.messsage); // 🚨 RED LINE! (TypeScript bolega: Spelling 'message' hai bhai)