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
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Loader2, RefreshCw } from 'lucide-react'; // Refresh Icon import kiya
import { useState } from 'react';

export default function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();

  // States
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false); // ✅ Resend Loader State

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: '',
    },
  });

  // ✅ 1. Submit Handler (Verify ke liye)
  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    setError("");   
    setSuccess(""); 

    try {
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });

      if (response.data.success) {
        setSuccess(response.data.message);
        setTimeout(() => {
           router.replace('/auth/sign-in'); 
        }, 2000);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      setError(
        axiosError.response?.data.message ?? "An error occurred during verification"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ 2. Resend Code Handler (Naya Button Click hone par)
  const onResend = async () => {
    setIsResending(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post<ApiResponse>('/api/resend-code', {
        username: params.username,
      });

      if (response.data.success) {
        setSuccess("New verification code sent to your email.");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      setError(
        axiosError.response?.data.message ?? "Failed to resend code"
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 px-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-slate-950 rounded-lg shadow-xl border border-slate-800">
        
        {/* Alerts */}
        {success && (
          <div className="bg-green-500/15 border border-green-500 text-green-400 px-4 py-3 rounded relative mb-4 text-sm">
            <strong className="font-bold">Success: </strong> {success}
          </div>
        )}
        
        {error && (
          <div className="bg-red-500/15 border border-red-500 text-red-400 px-4 py-3 rounded relative mb-4 text-sm">
            <strong className="font-bold">Error: </strong> {error}
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
                        className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-purple-500 focus-visible:ring-offset-0 tracking-widest text-center"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Verify Button */}
            <Button 
                type="submit" 
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 transition-all duration-300"
                disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
                </>
              ) : ('Verify Code')}
            </Button>
            
          </form>
        </Form>

        {/* ✅ Resend Button Section */}
        <div className="text-center mt-4">
          <p className="text-slate-400 text-sm mb-2">Didn't receive the code?</p>
          <Button 
            variant="ghost" 
            onClick={onResend} 
            disabled={isResending}
            className="text-purple-400 hover:text-purple-300 hover:bg-slate-900"
          >
            {isResending ? (
               <>
                 <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
               </>
            ) : (
               <>
                 <RefreshCw className="mr-2 h-4 w-4" /> Resend Code
               </>
            )}
          </Button>
        </div>

      </div>
    </div>
  );
}