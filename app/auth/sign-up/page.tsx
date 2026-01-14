"use client";
//  react hook form dont understand zod ke rules as it is a different library , so zod resolver is a translater
//  that do so
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState, useEffect } from "react";
//  router is used to send user to different pages programmatically
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { useDebounceCallback } from 'usehooks-ts';
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from 'axios';
import { ApiResponse } from "@/types/ApiResponse";
//  icons are imported from lucid react
import { Check, AlertCircle } from "lucide-react";
//  ye saare form ke  import we have in built in ui/components/form
import { Form, FormItem } from "@/components/ui/form";
import { FormField } from "@/components/ui/form";
import { FormLabel } from "@/components/ui/form";
import { FormControl } from "@/components/ui/form";
import { FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {

  const [username, setUsername] = useState('');
  //   humare paas backend se aayega  ek api call jo check karega ki username unique h ya nhi so usko hum
  //  usernameMessage me store karege
  const [UsernameMessage, SetUsernameMessage] = useState('');
  //  loading state ko manage karne k liye we use  this state
  const [IsCheckingUsername, setIsCheckingUsername] = useState(false);
  //  form submit hora hoga toh us state ko manage karne k liye
  //  now Agar isSubmitting nahi hai: Aapka code 10 baar chalega -> 10 baar database hit hoga ->
  //  Duplicate entries ban jayengi ya server crash ho jayega.
  // Agar isSubmitting hai: Jaise hi pehli baar button dabba, hum setIsSubmitting(true)
  //  kar dete hain aur button ko DISABLE kar dete hain. Ab wo jitna marzi click kare, kuch nahi hoga.
  const [isSubmitting, setIsSubmitting] = useState(false);


  //  this hoook will manage debouncing time 3 milli sec ka lga dia ab api call hogi har 3 sec me
  // useDebounceCallback  use karte waqt debounced variable hi banta hein and  uske andar set  yaani function hi aata hei
  const debounced = useDebounceCallback(setUsername, 300)
  //  for alerts like error alert only
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(""); // ✅ New: Success alert ke liye

  //   like check unique username file bnai thi to  h like usme tha ki username daalte hi we get to 
  //  know ki unique h ya nhi ek api call hoti hh par  har key board type me  api call na ho usey optimise 
  //   bhi karna hoga hume   usey debounce technique bolte h

  const router = useRouter();

  // 2. Form Setup

  // hum Zod se kehte hain: "Jo schema mein likha hai, wahi Type bana do form ke data ke"
  //  isiliye signin schema me export bhi aise hi hua tha z.infer<typeof signInSchema> taaki yha directly use kar
  //  sake hume TS na likhni pade

  // interface FormData {
  //   email: string;
  //   password: string;
  // }
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      //  form ki deafault values empty string hain
      username: "",
      email: "",
      password: "",
    },
  });

  //  check unique username vali api caal hogi par jab debouncedUsername change hoga toh use effect chalega 
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        SetUsernameMessage('')/* like ho sakta h pehle bhi humne data manga ho and usme error aaaya ho return me backend se toh UsernameMessge ko khali karo*/

        try {
          const response = await axios.get('/api/check-username-unique?username=' + username);
          //   axios se agar data managaya toh response me data me message field jo hume chye vo aayega ki success ya failed jo
          //  backend se check uniqe username file se aayega
          SetUsernameMessage(response.data.message)
        } catch (error) {
          //  errror aise denge agar api fail hui toh
          const axiosError = error as AxiosError<ApiResponse>
          SetUsernameMessage(
            axiosError.response?.data.message ?? "Error Checking Username"
          )
        }
        finally {
          setIsCheckingUsername(false)
        }
      }

    }
    checkUsernameUnique()
  }, [username]);


  // 3. Submit Handler (Login Logic)
  //    on submit is method it can be of any name
  //  ye data vo hei jo user daalta hei  in sign up page toh humne form me toh usey zod ke karvaya tha
  //  verify ek baar aur kralete hei
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true);
    setError("");
    setSuccess(""); 

    try {
      //  since in sign up api vha pe     const { username, email, password } = await request.json();  comes from frontend so data sent with api call
      const response = await axios.post<ApiResponse>('/api/sign-up', data);
      
      if (response.data.success) {
        // ✅ 1. Message set karo
        setSuccess(response.data.message); 

        // ✅ 2. Yahan 'setTimeout' lagao (2 second ka delay) yaani alert 2 sec k liye dikhega 
        setTimeout(() => {
          // http://localhost:3000/verify/arpit aisa url aayega 
           router.replace(`/verify/${username}`)
        }, 2000); // 2000 ms = 2 seconds
      }

    } catch (error) {
       // ... error handling same rahega
       const axiosError = error as AxiosError<ApiResponse>
      //   error me aajayega msg signup/route.ts me jo ye hei yha se  //    emailResponse.message aaya send verification mail vali file se
    // if (!emailResponse.success) {
    //   return Response.json(
    //     {
    //       success: false,
    //       message: emailResponse.message,
    //     },
    //     { status: 500 }
       let errorMessage = axiosError.response?.data.message ?? "Error in SignUp"
       setError(errorMessage)
    } finally {
      setIsSubmitting(false);
    }
};


  return (
    // ✅ Main Container: Dark background, Centered Content
    <div className="flex justify-center items-center min-h-screen bg-gray-900 px-4">
      {/* ✅ Card: Darker gray, rounded corners, shadow */}
      <div className="w-full max-w-md p-8 space-y-8 bg-slate-950 rounded-lg shadow-xl border border-slate-800">
        {/* ... Header parts ... */}

      {/* 👇 YEH CODE HONA ZAROORI HAI ALERT DIKHANE KE LIYE */}
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
        {/* ✅ Header Section */}
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight lg:text-4xl mb-2 text-white">
            Create your account
          </h1>
          <p className="text-slate-400 mb-4">Start your journey with BlindSpot</p>
        </div>

        {/* ✅ Logic kept intact, but structure fixed to remove error */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Username Field */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Username"
                      {...field}
                      // ✅ Input Styling: Dark bg, light text, purple border on focus
                      className="bg-slate-900 border-slate-800 text-white placeholder:text-slate-500 focus-visible:ring-purple-500 focus-visible:ring-offset-0"
                      //  react hook form use karte hue we dont use on change but humra yha customise use hei  username field ke saath debouncing ka 
                      //  toh hun custom onchange bnate hein and RHF  ke on change   ko override karte hei
                      onChange={(e) => {
                        field.onChange(e);
                        //  ye debounced function se  har 3 ms ke baad api call hogi toh humne ye likha
                        debounced(e.target.value); // Logic preserved
                      }}
                    />
                  </FormControl>
                  
                  {/* Loader for username check  agar username check hora toh loader lgao spiner chota sa */}
                  {IsCheckingUsername && <Loader2 className="animate-spin text-purple-500 mt-2 h-4 w-4" />}
                  
                  {/* Username availability message */}
                  {/*  ye yha pe backend file(check unique username ) se msg aaaya jo username msg me store hua toh success ka msg likha tha ""Username is unique */}
                  <p className={`text-sm mt-1 ${UsernameMessage === "Username is unique" ? 'text-green-500' : 'text-red-500'}`}>
                    {UsernameMessage}
                  </p>
                  
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            {/* Email Field */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium">Email</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter Email" 
                      {...field} 
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

            {/* ✅ Submit Button: Purple Background, Hover effect */}
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 transition-all duration-300"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
                </>
              ) : ('Create Account')}
            </Button>
          </form>
        </Form>

        {/* Footer Text */}
        <div className="text-center mt-4">
          <p className="text-slate-400 text-sm">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-purple-400 hover:text-purple-300 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}