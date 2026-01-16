"use client";

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User } from 'next-auth';

import { Button } from "@/components/ui/button";
import { Eye, LogOut, LayoutDashboard, User as UserIcon } from 'lucide-react';
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

            {session ? (
    <div className="flex items-center gap-3 sm:gap-4">
        
        {/* 1. Dashboard Button (New Feature: Quick Access) */}
        <Link href="/dashboard">
            <Button 
                size="sm" 
                variant="outline"
                className="border-purple-500/30 text-purple-400 bg-purple-500/5 hover:bg-purple-500 hover:text-white transition-all duration-300"
            >
                <LayoutDashboard className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline font-medium">Dashboard</span>
            </Button>
        </Link>

        {/* 2. User Badge (Stylish Chip with Online Dot) */}
        <div className="hidden md:flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-full border border-slate-800 shadow-inner">
            {/* Green Dot (Pulse Effect) */}
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            
            <span className="text-xs font-medium text-slate-300 tracking-wide">
                {user?.username || "User"}
            </span>
        </div>

        {/* 3. Logout Button (Sleek Icon Style) */}
        <Button 
            onClick={() => signOut()} 
            size="sm"
            variant="ghost" // Background transparent rakha hai
            className="text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Logout"
        >
            <LogOut className="h-5 w-5 sm:mr-2" />
            <span className="hidden sm:inline font-medium">Logout</span>
        </Button>

    </div>
) : (
    // Login/Signup wala code same rahega...
    <div className="flex items-center gap-2">
       {/* ... */}
    </div>
)}
            
            
        </div>

      </div>
    </nav>
  );
}

export default Navbar;