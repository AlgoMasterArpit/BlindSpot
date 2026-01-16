//  this  file strengthen our graph in the frontend , like graph me dates ke  hisab se data hoga ki is date ko 
//  ye ye data aaya tha uske basis pe average score nikalta hh sab sentiments ka


import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import { User } from "next-auth";
export const dynamic = 'force-dynamic';
export async function GET(request: Request) {
  // 1. Authentication Check 👮‍♂️ ki login h user ya nhi
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 }
    );
  }

  const userId = user._id;

  try {
    // 2. Date Range Set karna (Last 30 Days) 📅
    // Ye computer ko batata hai ki "Aaj se theek 30 din pehle ki date kya thi?"
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // 3. Database Query (Sirf zaroori data lao) 🗄️
    const feedbacks = await prisma.feedback.findMany({
      where: {
        userId: userId, /*sirf mere msg*/
        createdAt: {
          gte: thirtyDaysAgo, // Greater than or equal to 30 days ago
        },
      },
      select: {
        // "Humein graph banane ke liye poori kahani (content) nahi chahiye. Bas Data points chahiye."
        //  toh humne feedback model se yhi nikala
        createdAt: true,
        sentiment: true,
        sentimentScore: true,
      },
      orderBy: {
        createdAt: "asc", // Graph ke liye date wise sort karna zaroori hai
      },
    });

    // 4. Data Transformation Logic (Raw Data -> Graph Data) 📊
    // Hum ek Map use karenge taaki dates duplicate na hon
    const dashboardData = new Map<string, { 
      date: string; 
      positive: number; 
      negative: number; 
      neutral: number;
      totalScore: number;
      count: number;
    }>();

    feedbacks.forEach((feedback) => {
      // Date ko readable format mein badlo (e.g., "Jan 01")
      const date = new Date(feedback.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      // Agar ye date pehli baar aayi hai, toh initialize karo
      if (!dashboardData.has(date)) {
        dashboardData.set(date, {
          date,
          positive: 0,
          negative: 0,
          neutral: 0,
          totalScore: 0,
          count: 0,
        });
      }
//  data updation ka kaam
      const entry = dashboardData.get(date)!;/*Us din ka page nikalo*/

      // Sentiment Count badhao
      if (feedback.sentiment === "Positive") {
        entry.positive += 1;
      } else if (feedback.sentiment === "Negative") {
        entry.negative += 1;
      } else {
        entry.neutral += 1;
      }

      // Average Score ke liye total add karo
      entry.totalScore += feedback.sentimentScore || 0; // Agar null ho toh 0
      entry.count += 1;/*// Total messages ki ginti badhao*/
    });

    // 5. Map ko Array mein convert karo aur Average nikaalo
    const chartData = Array.from(dashboardData.values()).map((item) => ({
      date: item.date,
      positive: item.positive,
      negative: item.negative,
      neutral: item.neutral,
      // Average Score (Total score /  total msg Count) e.g., 7.5
    //    to fixed 1  means  1 decimal place tak leke aao
    //  to fixed converts number to string isliye parseFloat kar rahe hain wapas number me
      averageScore: item.count > 0 ? parseFloat((item.totalScore / item.count).toFixed(1)) : 0
    }));

    return NextResponse.json(
      { success: true, chartData },
      { status: 200 }
    );

  } catch (error) {
    console.log("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching dashboard stats" },
      { status: 500 }
    );
  }
}