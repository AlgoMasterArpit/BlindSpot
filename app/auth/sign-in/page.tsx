"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"; // ✅ NextAuth Hook
import { Loader2, Eye, LogIn } from "lucide-react";
import { signInSchema } from "@/schemas/signInSchema"; 
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function SignInPage() {
  const router = useRouter();
  
  // ✅ 1. State for Alerts (Matching your SignUp reference)
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form Setup
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  // Submit Handler
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    setError("");   // Clear previous errors
    setSuccess(""); // Clear previous success messages
    
    // ⚠️ Note: Sign In uses NextAuth's signIn() function, NOT Axios.
    const result = await signIn("credentials", {
      redirect: false, // Prevent auto-redirect so we can show alerts first
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      // ❌ Login Failed Logic
    //   result.error === "CredentialsSignin": Matlab login fail hua (Generic error). ye next auth  use karta  h khudko samjhane ke liye ki login fail hua  
      if (result.error === "CredentialsSignin") {
        setError("Incorrect username or password");
      } else {
        setError(result.error);
      }
    } 
    
    if (result?.url) {
      // ✅ Login Success Logic
      setSuccess("Logged in successfully! Redirecting...");
      
      // Delay redirect slightly so user sees the success message
      setTimeout(() => {
          router.replace("/dashboard");
      }, 1000);
    }

    setIsSubmitting(false);
  };

  return (
    // ✅ Main Container: Dark background (Matches SignUp)
    <div className="flex justify-center items-center min-h-screen bg-gray-900 px-4">
      
      {/* ✅ Card: Darker gray, rounded corners, shadow */}
      <div className="w-full max-w-md p-8 space-y-8 bg-slate-950 rounded-lg shadow-xl border border-slate-800">
        
        {/* Header Section */}
        <div className="text-center">
            {/* Logo Link */}
            <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
                <div className="bg-purple-600 p-2 rounded-xl group-hover:bg-purple-500 transition-colors">
                    <Eye className="h-6 w-6 text-white" />
                </div>
            </Link>
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-2 text-white">
            Welcome Back
          </h1>
          <p className="text-slate-400 mb-4">Sign in to continue your secret conversations</p>
        </div>

        {/* ✅ Success Alert Box */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Success! </strong>
            <span className="block sm:inline">{success}</span>
          </div>
        )}

        {/* ✅ Error Alert Box */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Identifier Field (Email/Username) */}
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">Email or Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter email or username"
                      {...field}
                      // Styling matches SignUp inputs
                      className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-purple-500 focus-visible:ring-offset-0"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Password Field */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter Password"
                      {...field}
                      className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-purple-500 focus-visible:ring-offset-0"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 transition-all duration-300"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
                </>
              ) : (
                <>
                    SignIn <LogIn className="ml-2 h-4 w-4"/>
                </>
              )}
            </Button>
          </form>
        </Form>

        {/* Footer Text */}
        <div className="text-center mt-4">
          <p className="text-slate-400 text-sm">
            Not a member yet?{' '}
            {/* Link points to Sign Up page */}
            <Link href="/auth/sign-up" className="text-purple-400 hover:text-purple-300 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}