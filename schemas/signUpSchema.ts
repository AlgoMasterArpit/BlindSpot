import { z } from 'zod'

// 1. Username ka rule (Validation)
// Hum chahte hain username thoda dhang ka ho.
export const usernameValidation = z
  .string()
  .min(2, "Username must be at least 2 characters") // Kam se kam 2 letter
  .max(20, "Username must be no more than 20 characters") // Zyada se zyada 20
  .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special characters") 
  // Regex ka matlab: Sirf A-Z, 0-9 aur _ (underscore) allowed hai. No @, #, $.

// 2. Sign Up Form ka main rule
export const signUpSchema = z.object({
username: usernameValidation, // Upar wala rule yahan lagaya
  
  email: z.string().email({ message: 'Invalid email address' }), 
//   Zod ye check karta hai: "Kya ye Text (String) hai?
  // .email() check karega ki '@' aur '.' hai ya nahi.
//   .email() ke paas ek Hidden Pattern (Regex) hota hai. 
//  ye regex zod ke andar hi defined hota hai.
// Wo check karta hai ki kya ye text Email jaisa dikhta hai ya nahi?
  
  password: z.string().min(6, { message: 'Password must be at least 6 characters' })
  // Password kam se kam 6 digit ka hona chahiye
})
export type SignUpInput = z.infer<typeof signUpSchema>
//  in mongoose we have to write ki password required : true 
// Zod mein sab kuch automatically REQUIRED hota hai jab tak aap khud usey Optional na bolein.
// password: z.string()
// Toh Zod ka matlab hota hai:

// Ye field hona hi chahiye (Missing nahi  ho sakta).

// Ye String hi hona chahiye.

// Ye null ya undefined nahi ho sakta.
// // 
// 










//  what is this line ?
// export type SignUpInput = z.infer<typeof signUpSchema>
//  answer hume validation 2 baar lgana hota ek bar zod k liye and ek baar typescript check karta code me
//  now this line 2 baar code likhne se bachati hh
// typeof SignUpSchema: TypeScript, zara us Zod schema ko dekho.

// z.infer<...>: Us schema ko padh kar, usme se Type nikaal lo.

// Agar wahan z.string() hai, toh yahan string maan lo.

// Agar wahan .optional() hai, toh yahan ? laga do.
// 


// ques then zod jab validation dekh rha tha app chalte waqt to type script se kyu type btana
// ans  //  Type script validation is fir developers and zod is for users
// Galti se 'email' ki jagah 'emial' likh diya
// console.log(userData.emial) 
// Agar TypeScript Type nahi hai: VS Code chup rahega. Code run hoga -> Phatega -> User ko error dikhega. 💥

// Agar TypeScript Type (z.infer) hai: VS Code turant Red Line dikha dega aur bolega:

// "Bhai, 'emial' naam ki koi cheez nahi hai. Kya aapka matlab 'email' tha?"

// Matlab: TypeScript aapko App Crash hone se pehle hi bacha leta hai.