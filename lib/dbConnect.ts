import { PrismaClient } from '@prisma/client'

// 1. Global object declare kar rahe hain
// globalThis use karne ka ekmatra (only) reason yahi hai ki humein us connection ko file ke scope se bahar nikal kar "Global" jagah par rakhna hai.
//  now global this me pehle se defined hain ki ye kya kya le sakta h , and prisma nhi le sakta so hum forcefully bolte hain  ki lele 
//  toh for that we used as unknown as
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 2. Check karte hain: "Kya pehle se connection hai?"
// Agar hai toh wahi use karo, nahi toh naya banao.
export const prisma = globalForPrisma.prisma ?? new PrismaClient()

// 3. Agar Development mode hai, toh global variable mein save kar lo
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma


//  explanantion in Hindi:
// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined
// }
// Problem: Next.js mein jab hum file save karte hain, purane variables mit (delete) jate hain.

// Solution: globalThis ek aisi jagah hai jo Delete nahi hoti.

// Matlab: Hum TypeScript ko bata rahe hain: "Bhai, sun! globalThis ke andar ek prisma naam ka dabba ho sakta hai, ya toh wo khaali hoga (undefined) ya usme connection hoga."

// Line 2: The "Magic Logic" (Sabse Important) ✨
// TypeScript

// export const prisma = globalForPrisma.prisma ?? new PrismaClient()
// Yahan ?? ka matlab hai "Agar pehla wala nahi hai, toh doosra wala use karo."

// Is line ka Logic Flow dekhiye:

// Code poochta hai: "Kya globalThis (wo permanent dabba) mein pehle se prisma rakha hai?"

// Scenario A (Pehli Baar run hua):

// Jawaab: "Nahi, dabba khaali hai."

// Action: new PrismaClient() chalao (Naya connection banao).

// Scenario B (Aapne file save ki / Reload hua):

// Jawaab: "Haan, pichli baar wala rakha hua hai."

// Action: Purana wala hi utha lo (Naya mat banao).

// Line 3: Development Mode ka Rule 🚧
// TypeScript

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
// Check: "Kya hum abhi Development (Localhost) par kaam kar rahe hain?"

// Action: "Haan! Toh jo naya connection abhi banaya hai, usko turant globalThis wale dabbe mein sambhaal kar rakh do."

// Kyun? Taaki jab agli baar file reload ho (Line 2 chale), toh usko ye connection wahan mil jaye.
// Production mein hum connection ko global variable mein zabardasti store NAHI karte.
// means production me new connection hi banta h and vo new connection database provider(neron , supabase etc)  dektat h