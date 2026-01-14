"use client";

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';
import { Eye, LogOut } from 'lucide-react'; // ✅ Import Eye correctly
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { data: session } = useSession();
  const user: User = session?.user as User;

  return (
    // ✅ Main Nav Container: Sticky, Dark, Blur effect
    <nav className="sticky top-0 z-50 w-full backdrop-blur-lg border-b border-white/10 bg-gray-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* ✅ LEFT SIDE: Logo (Eye + Text) -> Goes to Home */}
        <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-purple-600 p-1.5 rounded-lg group-hover:bg-purple-500 transition-colors">
              <Eye className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">
              BlindSpot
            </span>
        </Link>

        {/* ✅ RIGHT SIDE: Links & Buttons */}
        <div className="flex items-center gap-4 sm:gap-6">
            
            {/* 1. Home Link */}
            <Link 
              href="/" 
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
            >
              Home
            </Link>

            {/* 2. Session Logic */}
            {session ? (
                <>
                    {/* Welcome Message (Hidden on mobile) */}
                    <span className="text-sm font-medium text-slate-300 hidden md:block">
                        Welcome, {user?.username || user?.email}
                    </span>
                    
                    {/* Logout Button */}
                    <Button 
                        onClick={() => signOut()} 
                        size="sm"
                        variant="destructive" // Red color for logout
                        className="font-bold"
                    >
                        Logout <LogOut className="ml-2 h-4 w-4"/>
                    </Button>
                </>
            ) : (
                // Login Button
                <Link href='/sign-in'>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white font-bold">
                        Login
                    </Button>
                </Link>    
            )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;