"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios, { AxiosError } from 'axios';
import { Eye, Copy, Loader2, RefreshCcw, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MessageCard } from '@/components/MessageCard';
import { Feedback } from '@prisma/client'; 
import { ApiResponse } from '@/types/ApiResponse';

// ✅ Recharts for Graph
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// Types
type ChartDataPoint = {
  date: string;
  positive: number;
  negative: number;
  neutral: number;
  averageScore: number;
};

type AlertState = {
  type: 'success' | 'error';
  message: string;
} | null;

export default function Dashboard() {
  const { data: session } = useSession();
  
  // ✅ States
  const [messages, setMessages] = useState<Feedback[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // 🔥 Toggle State (User Model: isAcceptingMessages)
  const [acceptMessages, setAcceptMessages] = useState(false); 
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  // ✅ Alert State (No Toast)
  const [alert, setAlert] = useState<AlertState>(null);

  // Helper: Show Alert
  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 3000); // 3 sec baad gayab
  };

  // ✅ 1. Fetch Messages & User Settings
  const fetchDashboardData = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    try {
      // Messages fetch karo
      const response = await axios.get<ApiResponse>('/api/get-messages');
      setMessages(response.data.feedbacks || []);
      
      // 🔥 Important: Backend se current 'isAcceptingMessages' status bhi maangna padega
      // Filhal hum ise session se sync kar sakte hain agar session update ho, 
      // ya alag API endpoint se laa sakte hain.
      // (Assumption: get-messages API also returns 'isAcceptingMessages' in future updates)
      // Abhi ke liye hum ise alag API call se check karte hain (Step 2 dekhein).

      if (refresh) {
        showAlert('success', 'Dashboard refreshed successfully.');
      }
    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        showAlert('error', axiosError.response?.data.message ?? 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ 2. Fetch User Status (Specifically for Toggle)
  const fetchAcceptMessageStatus = useCallback(async () => {
    try {
      const response = await axios.get('/api/accept-messages');
      setAcceptMessages(response.data.isAcceptingMessages);
    } catch (error) {
      console.log("Error fetching user settings");
    }
  }, []);

  // ✅ 3. Fetch Graph Stats
  const fetchStats = useCallback(async () => {
    try {
      const response = await axios.get('/api/get-dashboard-stats');
      if (response.data.success) {
        setChartData(response.data.chartData);
      }
    } catch (error) {
      console.error("Failed to load stats", error);
    }
  }, []);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchDashboardData();
    fetchStats();
    fetchAcceptMessageStatus(); // Load initial toggle state
  }, [session, fetchDashboardData, fetchStats, fetchAcceptMessageStatus]);

  // ✅ 4. Handle Toggle Switch Change
  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try {
      // API call to toggle status
      const response = await axios.post('/api/accept-messages', {
        acceptMessages: !acceptMessages // Jo abhi hai, uska ulta bhejo
      });

      // UI Update
      setAcceptMessages(!acceptMessages);
      showAlert('success', response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      showAlert('error', axiosError.response?.data.message ?? "Failed to update settings");
    } finally {
      setIsSwitchLoading(false);
    }
  };

  // ✅ 5. Handle Delete
  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    showAlert('success', 'Message deleted.');
    fetchStats(); // Graph update karo
  };

  const username = session?.user?.username;
  const baseUrl = typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.host}` : '';
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    showAlert('success', 'Link copied to clipboard!');
  };

  if (!session || !session.user) {
    return <div className="flex justify-center items-center h-screen bg-gray-950 text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-slate-200 selection:bg-purple-500/30">
      
      {/* Header */}
    

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* ✅ Alert Box */}
        {alert && (
          <div className={`p-4 rounded-lg border flex items-center justify-between animate-in fade-in slide-in-from-top-2 ${
            alert.type === 'success' 
              ? 'bg-green-500/10 border-green-500 text-green-400' 
              : 'bg-red-500/10 border-red-500 text-red-400'
          }`}>
            <span className="font-medium text-sm">{alert.message}</span>
            <button onClick={() => setAlert(null)} className="text-xs hover:underline opacity-80">Dismiss</button>
          </div>
        )}

        {/* Section 1: Controls */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Copy Link */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-white mb-4">Your Feedback Link</h2>
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={profileUrl}
                        disabled
                        className="flex-1 bg-slate-900 border border-slate-700 text-slate-300 text-sm rounded-lg p-2.5 focus:outline-none"
                    />
                    <Button onClick={copyToClipboard} className="bg-purple-600 hover:bg-purple-700 text-white">
                        <Copy className="h-4 w-4 mr-2" /> Copy
                    </Button>
                </div>
            </div>

            {/* ✅ Custom Toggle Switch (Accept Messages) */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-sm flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-white">Accept Messages</h2>
                    <p className="text-sm text-slate-500">
                       {acceptMessages ? "Status: ON (Receiving feedback)" : "Status: OFF (Messages paused)"}
                    </p>
                </div>
                
                {/* Custom Checkbox Logic */}
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={acceptMessages}
                    onChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                  />
                  {/* Switch Track */}
                  <div className={`w-14 h-7 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all duration-300 ${
                      acceptMessages ? 'peer-checked:bg-purple-600' : ''
                  }`}></div>
                  
                  {isSwitchLoading && <Loader2 className="h-4 w-4 absolute -right-6 animate-spin text-purple-500" />}
                </label>
            </div>
        </section>

        {/* Custom Separator */}
        <div className="border-b border-slate-800 my-4"></div>

        {/* Section 2: Graph */}
        <section className="bg-slate-950 border border-slate-800 rounded-xl p-6 shadow-md">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <TrendingUp className="text-purple-500 h-5 w-5" /> Sentiment Trends
                    </h2>
                    <p className="text-sm text-slate-500">Last 30 days analysis</p>
                </div>
            </div>

            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                        <Legend />
                        <Line type="monotone" dataKey="positive" name="Positive" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="negative" name="Negative" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                        <Line type="monotone" dataKey="neutral" name="Neutral" stroke="#94a3b8" strokeWidth={2} strokeDasharray="5 5" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </section>

        {/* Section 3: Feedback Grid */}
        <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Recent Feedback</h2>
                <Button 
                    variant="outline" 
                    onClick={() => { fetchDashboardData(true); fetchStats(); }}
                    className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
                </Button>
            </div>

            {messages.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {messages.map((msg) => (
                        <MessageCard
                            key={msg.id}
                            message={msg}
                            onMessageDelete={handleDeleteMessage}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-950/50 border border-dashed border-slate-800 rounded-xl">
                    <p className="text-slate-500">No feedback received yet. Share your link!</p>
                </div>
            )}
        </section>

      </main>
    </div>
  );
}