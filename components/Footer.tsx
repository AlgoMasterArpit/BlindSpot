"use client";

import React from 'react';
import Link from 'next/link';
import { Eye, Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-white/10 bg-gray-950/80 backdrop-blur-lg pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top Section: Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* 1. Brand & Description */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2 group w-fit">
                <div className="bg-purple-600 p-1.5 rounded-lg group-hover:bg-purple-500 transition-colors">
                  <Eye className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">
                  BlindSpot
                </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Share your thoughts anonymously. A safe space for honest feedback and genuine connections, powered by AI.
            </p>
          </div>

          {/* 2. Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold tracking-wide">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-slate-400 hover:text-purple-400 text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-slate-400 hover:text-purple-400 text-sm transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/sign-up" className="text-slate-400 hover:text-purple-400 text-sm transition-colors">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Socials & Contact */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold tracking-wide">Connect</h3>
            <div className="flex items-center gap-4">
              {/* GitHub */}
              <a 
                href="https://github.com/AlgoMasterArpit" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
              >
                <Github className="h-5 w-5" />
              </a>
              {/* Twitter/X */}
              <a 
                href="#" 
                className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
              >
                <Twitter className="h-5 w-5" />
              </a>
              {/* LinkedIn */}
              <a 
                href="#" 
                className="text-slate-400 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
            <a href="mailto:support@blindspot.com" className="flex items-center gap-2 text-sm text-slate-400 hover:text-purple-400 transition-colors">
                <Mail className="h-4 w-4" /> support@blindspot.com
            </a>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-8"></div>

        {/* Bottom Section: Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} BlindSpot. All rights reserved.</p>
          
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="h-3 w-3 text-red-500 fill-red-500 animate-pulse" />
            <span>by Arpit Tyagi</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;