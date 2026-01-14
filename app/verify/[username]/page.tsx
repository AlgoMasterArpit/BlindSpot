"use client";

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { verifySchema } from '@/schemas/verifySchema'; // Ya niche define kar lo
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

// ✅ Agar verifySchema file nahi hai toh ye use karein:
// const verifySchema = z.object({
//   code: z.string().length(6, 'Verification code must be 6 digits'),
// });

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>(); // URL se username nikaalne ke liye
 //  for alerts like error alert only
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(""); // ✅ New: Success alert ke liye
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Form Setup
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: '',
    },
  });

  // 2. Submit Handler
  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      // API Call: Username URL se + Code Form se
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });
      if (response.data.success) {
        // ✅ 1. Message set karo
        setSuccess(response.data.message); 

        // ✅ 2. Yahan 'setTimeout' lagao (2 second ka delay) yaani alert 2 sec k liye dikhega 
        setTimeout(() => {
          // http://localhost:3000/verify/arpit aisa url aayega 
           router.replace(`/sign-in`)
        }, 2000); // 2000 ms = 2 seconds
      }


      

      // User verify ho gaya, ab Login karwao
      router.replace('/sign-in');
    } catch (error) {
      // ❌ Error Handling
      console.error('Error in verification of user', error);
      const axiosError = error as AxiosError<ApiResponse>;
      
      
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    
    <div className="flex justify-center items-center min-h-screen bg-gray-900 px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-slate-950 rounded-lg shadow-xl border border-slate-800">
        {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Success! </strong>
          <span className="block sm:inline">{success}</span>
        </div>
      )}
       {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-2 text-white">
            Verify Your Account
          </h1>
          <p className="text-slate-400 mb-4">
            Enter the verification code sent to your email
          </p>
        </div>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">Verification Code</FormLabel>
                  <FormControl>
                    <Input 
                        placeholder="Enter 6-digit code" 
                        {...field} 
                        className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-purple-500 focus-visible:ring-offset-0"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 transition-all duration-300"
                disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
                </>
              ) : ('Submit')}
            </Button>

          </form>
        </Form>
      </div>
    </div>
  );
}