"use client";
// Jab User dashboard kholega, toh uske paas bohot saare messages honge. MessageCard.tsx har ek message ko ek sundar box (Card) mein dikhayega.
import React, { useState } from 'react';
import axios, { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { X, Loader2 } from 'lucide-react';
import { prisma } from "../lib/dbConnect";
import { ApiResponse } from '@/types/ApiResponse';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Feedback } from '@prisma/client';

type MessageCardProps = {
  message: Feedback;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  // ✅ 1. Local State for Alerts
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message.id}`
      );

      // ✅ Success Message set karo
      setSuccess(response.data.message || "Message deleted successfully");

      // ✅ Thoda wait karo taaki user "Success Message" padh sake, fir card hatao
      setTimeout(() => {
         onMessageDelete(message.id as string);
      }, 1000); // 1 second delay

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      // ❌ Error Message set karo (Card delete nahi hoga, error dikhega)
      setError(
        axiosError.response?.data.message ?? 'Failed to delete message'
      );
      setIsDeleting(false); // Button wapas enable kar do
    }
  };

  return (
    <Card className="card-bordered bg-gray-950 border-slate-800 text-white shadow-md hover:shadow-purple-500/10 transition-all duration-300">
      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          
          {/* Message Content */}
          <CardTitle className="text-xl font-semibold break-words w-[85%] text-slate-200">
            {message.content}
          </CardTitle>

          {/* Delete Button with Alert Dialog */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                size="icon" 
                className="h-8 w-8 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            
            <AlertDialogContent className="bg-slate-950 border-slate-800 text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-slate-400">
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-slate-900 border-slate-800 text-white hover:bg-slate-800 hover:text-white">
                  Cancel
                </AlertDialogCancel>
                
                {/* Delete Confirm Button */}
                <AlertDialogAction 
                    onClick={handleDeleteConfirm}
                    disabled={isDeleting}
                    className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {isDeleting ? <Loader2 className="h-4 w-4 animate-spin"/> : "Continue"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Date */}
        <CardDescription className="text-slate-500 mt-2 text-xs font-mono">
          {dayjs(message.createdAt).format('MMM D, YYYY h:mm A')}
        </CardDescription>
      </CardHeader>

      {/* ✅ Alerts Section inside Card Content */}
      {(success || error) && (
          <CardContent className="pt-0 pb-4">
              {success && (
                <div className="bg-green-500/15 border border-green-500 text-green-400 px-3 py-2 rounded text-sm text-center">
                  {success}
                </div>
              )}

              {error && (
                <div className="bg-red-500/15 border border-red-500 text-red-400 px-3 py-2 rounded text-sm text-center">
                  {error}
                </div>
              )}
          </CardContent>
      )}

    </Card>
  );
}