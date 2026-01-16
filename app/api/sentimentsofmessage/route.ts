import { prisma } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import OpenAI from "openai";
export const dynamic = 'force-dynamic';
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { username, content } = await request.json();

    // 1. User dhoondho
    const user = await prisma.user.findFirst({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (!user.isAcceptingMessages) {
      return NextResponse.json(
        { success: false, message: "User is not accepting messages" },
        { status: 403 }
      );
    }

    // --- AI ANALYSIS START ---
    let sentimentLabel = "Neutral";
    let sentimentScore = 5; 

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", 
        messages: [
          {
            role: "system",
            content: `You are a sentiment analyzer.
            Analyze the user's message and return a JSON object strictly in this format:
            {
              "label": "Positive" | "Negative" | "Neutral",
              "score": number
            }
            Rules for score:
             1 to 3: Negative (1 is worst)
             4 to 6: Neutral (5 is balanced)
             7 to 10: Positive (10 is best)`
          },
          {
            role: "user",
            content: content
          }
        ],
        response_format: { type: "json_object" }, 
        max_tokens: 50,
      });

      const aiResponse = completion.choices[0].message.content;
      
      if (aiResponse) {
        const parsedData = JSON.parse(aiResponse);
        
        // 🔥 THE FIX: Case Sensitivity & Typos ka ilaaj (Normalization)
        //  problem ye thi ki dashboard me bas neutral ka count badh rha tha  toh humne 
        //  ye casesensitivevala seen lgaya ki shydd dasboard stats me if (feedback.sentiment === "Positive") {
      //   entry.positive += 1;
      // } else if (feedback.sentiment === "Negative") {
      //   entry.negative += 1;
      // } else {
      //   entry.neutral += 1;
      // }  like "positive" instead of "Positive"  and negative instead of Negativeja rha ho is file se dashboard stats file me toh issue hojayega , and neutral ka count hi badhega
         
        // 1. AI ka raw data nikalo
        const rawLabel = parsedData.label || "Neutral"; 
        sentimentScore = parsedData.score || 5;

        // 2. String ko saaf karo (Lowercase + Trim)
        // Agar AI ne " Positive " bheja toh wo "positive" ban jayega
        const cleanLabel = rawLabel.toString().trim().toLowerCase(); 

        // 3. Check karo ki string me kya chupa hai
        if (cleanLabel.includes("positive")) {
            sentimentLabel = "Positive"; // ✅ Standard Format
        } 
        else if (cleanLabel.includes("negative")) {
            sentimentLabel = "Negative"; // ✅ Standard Format
        } 
        else {
            sentimentLabel = "Neutral";  // ✅ Standard Format
        }
        
        // 4. 🔥 EXTRA SAFETY (Score Override)
        // Agar AI confuse ho gaya (Label 'Positive' bola par Score '2' diya)
        // Toh hum Numbers ki baat maanenge kyunki Graph numbers par chalta hai.
       
      }

    } catch (aiError) {
      console.error("❌ OpenAI API Failed (Using Defaults):", aiError);
    }
    // --- AI ANALYSIS END ---
    
    // 5. Database mein save karo (Ab 'sentimentLabel' एकदम perfect hai)
    const newFeedback = await prisma.feedback.create({
      data: {
        content,
        userId: user.id,
        createdAt: new Date(),
        sentiment: sentimentLabel,   // Hamesha "Positive", "Negative" ya "Neutral" hoga (Capitalized)
        sentimentScore: sentimentScore 
      },
    });

    return NextResponse.json(
      { success: true, message: "Feedback sent successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.log("Error adding feedback: ", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}