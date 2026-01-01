'use client' // 👈 Ye line bohot zaroori hai!

import { SessionProvider } from "next-auth/react"

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}





// 3. Lekin humne alag file kyun banayi? Seedha layout.tsx mein kyun nahi likha?

// app/layout.tsx by default ek Server Component hota hai. (Server par render hota hai).

// SessionProvider (jo library se aata hai) wo React Context use karta hai.

// Rule: React Context sirf Client Components ('use client') mein chalta hai. Server Components mein Context kaam nahi karta.