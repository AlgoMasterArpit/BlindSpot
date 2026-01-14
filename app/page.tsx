"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  QrCode, 
  Sparkles, 
  Bell, 
  ArrowRight, 
  Play, 
  LayoutDashboard,
  Eye
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950 text-slate-200 selection:bg-purple-500/30">
      {/* ------------------- HERO SECTION ------------------- */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 pt-20 pb-16 text-center">
        
        {/* Badge */}
        <div className="mb-8 inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-sm font-medium text-purple-300 backdrop-blur-sm">
          <Sparkles className="mr-2 h-4 w-4" />
          <span>Now with AI-powered insights</span>
        </div>

        {/* Main Heading */}
        <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-white sm:text-7xl mb-6">
          See what your clients are <br />
          <span className="bg-gradient-to-r from-purple-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
            actually thinking
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-lg text-slate-400 mb-10 leading-relaxed">
          Anonymous feedback platform with AI-driven sentiment analysis. 
          Get honest insights that help you improve customer experience directly.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
          <Link href="/auth/sign-up">
            <Button size="lg" className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white font-semibold h-12 px-8 text-base">
              Start Free Trial <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          
          <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white h-12 px-8 text-base bg-transparent">
            <Play className="mr-2 h-4 w-4" /> View Demo
          </Button>
        </div>

        {/* Small Note */}
        <p className="mt-6 text-sm text-slate-500">
          No credit card required • 14-day free trial
        </p>
      </main>


      {/* ------------------- FEATURES SECTION ------------------- */}
      <section className="py-24 bg-gray-900/50 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-white mb-4">
              Everything you need to understand <span className="text-purple-400">your customers</span>
            </h1>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Powerful features designed to help you collect, analyze, and act on customer feedback effortlessly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Feature 1: QR Code */}
            <div className="p-8 rounded-2xl bg-gray-950 border border-slate-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group">
              <div className="h-12 w-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors">
                <QrCode className="h-6 w-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">QR Code Integration</h3>
              <p className="text-slate-400 leading-relaxed">
                Generate unique QR codes for each location or touchpoint. Customers scan and share feedback instantly without logging in.
              </p>
            </div>

            {/* Feature 2: AI Analysis */}
            <div className="p-8 rounded-2xl bg-gray-950 border border-slate-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group">
              <div className="h-12 w-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
                <Sparkles className="h-6 w-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">AI Sentiment Analysis</h3>
              <p className="text-slate-400 leading-relaxed">
                Our AI automatically categorizes feedback by sentiment and urgency, so you can prioritize what matters most immediately.
              </p>
            </div>

            {/* Feature 3: Real-time Alerts */}
            <div className="p-8 rounded-2xl bg-gray-950 border border-slate-800 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 group">
              <div className="h-12 w-12 bg-orange-500/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-colors">
                <Bell className="h-6 w-6 text-orange-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Real-time Alerts</h3>
              <p className="text-slate-400 leading-relaxed">
                Get instant notifications for critical feedback. Never miss an urgent issue that needs immediate attention from your team.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}