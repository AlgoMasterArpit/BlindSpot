import NextAuth from "next-auth";
import { authOptions } from "./options"; // Humne options file se logic import kiya

// Build error fix karne ke liye
export const dynamic = 'force-dynamic';

const handler = NextAuth(authOptions);

// GET Request: Jab browser session maangta hai (useSession).

// POST Request: Jab user Login form submit karta hai (Email/Pass bhejta hai).
// Dono kaam ye akela handler function manage karega.
export { handler as GET, handler as POST };