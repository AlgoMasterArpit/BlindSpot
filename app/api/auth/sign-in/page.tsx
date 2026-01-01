// Toh useSession NextAuth ke backend se baat karta hai  mailny  [...nextauth]/route.ts se aur poochta hai:
// "Oye, kya koi banda login hai? Agar haan, toh uska naam, photo aur ID mujhe de do."
// Yeh aapko 2 cheezein laakar deta hai:
// const { data: session, status } = useSession();
// data (session): User ki details (Jo aapne backend callbacks mein set ki thi — _id, username, isVerified).
// status: Abhi kya chal raha hai? (3 states hoti hain).
// : "loading" | "authenticated" | "unauthenticated";


"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
//  router is used to send user to different pages programmatically
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react"; // Icons ke liye
import { useDebounceValue } from 'usehooks-ts'
import { signInSchema } from "@/schemas/signInSchema";
 const [username , setUsername] = useState('');
//   humare paas backend se aayega  ek api call jo check karega ki username unique h ya nhi so usko hum
//  usernameMessage me store karege
const [UsernameMessage, setSetUsernameMessage] = useState('');
//  loading state ko manage karne k liye we use isnameLoading
const [isUsernameLoading, setIsUsernameLoading] = useState(false);
//  form submit hora hoga toh us state ko manage karne k liye
 const [isSubmitting, setIsSubmitting] = useState(false);
//  this hoook will manage debouncing time 3 milli sec ka lga dia ab api call hogi har 3 sec me
  const debouncedUsername = useDebounceValue(username, 300)
//  for alerts like error alert only
const [error, setError] = useState("")



export default function SignInPage() {
    // /* like check unique username file bnai thi to  h like usme tha ki username daalte hi we get to 
    //  know ki unique h ya nhi ek api call hoti hh par  har key board type me  api call na ho usey optimise 
    //   bhi karna hoga hume   usey debounce technique bolte h
 
  const router = useRouter();
  
  // 2. Form Setup
//   z.infer<typeof signInSchema> is a type script ki hum  chahte ki resolver jo value dega unke type bhi signin schema jaise ho

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
        //  form ki deafault values empty string hain
        
    identifier: "",
      password: "",
    },
  });

  // 3. Submit Handler (Login Logic)
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    setError(""); // Submission start hote hi purana error clear kar do

    // NextAuth ka signIn function call kiya
    const result = await signIn("credentials", {
      redirect: false, // Page reload na ho, hum manual redirect karenge
      identifier: data.identifier, // Ye backend ke credentials provider me jayega
      password: data.password,
    });

    if (result?.error) {
      // Agar login fail hua
      // Update: Simple String set kar rahe hain Alert ke liye
      setError("Incorrect username or password. Please try again.");
      setIsSubmitting(false);
    }

    if (result?.url) {
      // Agar login success hua -> Dashboard bhejo
      router.replace("/dashboard");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back
          </h1>
          <p className="mb-4">Sign in to start your anonymous adventure</p>
        </div>

        {/* --- YAHAN ALERT ADD KIYA HAI --- */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Identifier Field */}
          <div>
            <label className="block text-sm font-medium mb-2">Email or Username</label>
            <input
              {...form.register("identifier")}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter username or email"
            />
            {form.formState.errors.identifier && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.identifier.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              {...form.register("password")}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter password"
            />
            {form.formState.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white p-3 rounded-lg font-bold hover:bg-gray-800 transition disabled:opacity-50 flex justify-center items-center"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="text-center mt-4">
          <p>
            Not a member yet?{" "}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}