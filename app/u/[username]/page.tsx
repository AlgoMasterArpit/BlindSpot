"use client";

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import axios, { AxiosError } from 'axios';
import { Eye, Send, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApiResponse } from '@/types/ApiResponse';

export default function PublicFeedbackPage() {
  const params = useParams<{ username: string }>();
  
  // States
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(5); // Slider ke liye
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Helper: Rating ke labels
  const getRatingLabel = (val: number) => {
    if (val <= 2) return "Poor";
    if (val <= 4) return "Fair";
    if (val <= 6) return "Average";
    if (val <= 8) return "Good";
    return "Excellent";
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      // ✅ Logic: Hum Rating ko Content ke sath jod kar bhej rahe hain
      // Kyunki API sirf 'content' le rahi hai.
      const finalContent = `[Rating: ${rating}/10] ${content}`;

      const response = await axios.post<ApiResponse>('/api/send-message', {
        username: params.username, // URL se username
        content: finalContent,     // Message + Rating
      });

      if (response.data.success) {
        setMessage({ text: 'Feedback sent successfully!', type: 'success' });
        setContent(''); // Form clear
        setRating(5);   // Rating reset
      }

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      setMessage({ 
        text: axiosError.response?.data.message ?? "Failed to send message", 
        type: 'error' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4">
      
      {/* 1. Header Logo */}
      <div className="mb-8 flex items-center gap-2">
         <div className="bg-purple-600 p-2 rounded-lg">
            <Eye className="h-6 w-6 text-white" />
         </div>
         <span className="text-2xl font-bold text-white tracking-tight">
            BlindSpot
         </span>
      </div>

      {/* 2. Main Feedback Card */}
      <div className="w-full max-w-md bg-slate-900/50 border border-slate-800 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
        
        <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Share your feedback</h1>
            <p className="text-slate-400 text-sm">
                Your response is completely anonymous
            </p>
        </div>

        {/* Success/Error Alert */}
        {message && (
            <div className={`mb-4 p-3 rounded-lg text-sm text-center font-medium ${
                message.type === 'success' 
                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
                {message.text}
            </div>
        )}

        <form onSubmit={onSubmit} className="space-y-8">
            
            {/* Rating Slider */}
            <div>
                <div className="flex justify-between items-end mb-4">
                    <label className="text-white font-medium text-sm">
                        How would you rate your experience?
                    </label>
                </div>
                
                <div className="flex items-center justify-between mb-2">
                    <span className="text-4xl font-bold text-white">{rating}</span>
                    <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium uppercase tracking-wider">
                        {getRatingLabel(rating)}
                    </span>
                </div>

                <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={rating} 
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                    <span>Not likely</span>
                    <span>Very likely</span>
                </div>
            </div>

            {/* Message Box */}
            <div className="space-y-2">
                <label className="text-white font-medium text-sm">
                    Tell us more (optional)
                </label>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What could we do better? What did you love?"
                    required
                    className="w-full h-32 bg-slate-950/50 border border-slate-700 rounded-xl p-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none transition-all"
                />
            </div>

            {/* Submit Button */}
            <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_-5px_rgba(147,51,234,0.5)] hover:shadow-[0_0_25px_-5px_rgba(147,51,234,0.7)]"
            >
               {isSubmitting ? (
                   <Loader2 className="h-5 w-5 animate-spin" />
               ) : (
                   <span className="flex items-center gap-2">
                       <Send className="h-4 w-4" /> Submit Anonymously
                   </span>
               )}
            </Button>

        </form>

        {/* Footer Note */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
            <Lock className="h-3 w-3" />
            <span>Your feedback is encrypted and cannot be traced back to you</span>
        </div>

      </div>
    </div>
  );
}