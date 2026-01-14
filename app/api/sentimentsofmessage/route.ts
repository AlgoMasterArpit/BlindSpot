
//  jab koi bhi  employee apna  feedback dega toh this api will run and  take help of gpt to find sentiment 
//  and sentiment score and then  will save that data in db 
import { prisma } from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import OpenAI from "openai";

// 1. OpenAI Config Setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure .env mein ye key ho
});

export async function POST(request: Request) {
  try {
    const { username, content } = await request.json();

    // 2. User ko dhoondho (Receiver)
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // 3. Check karo: Kya user message accept kar raha hai?
    if (!user.isAcceptingMessages) {
      return NextResponse.json(
        { success: false, message: "User is not accepting messages" },
        { status: 403 }
      );
    }

    // 4. --- AI ANALYSIS START ---
    // Default values (agar AI fail ho jaye toh ye save honge)
    let sentimentLabel = "Neutral";
    let sentimentScore = 5; 

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", 
        messages: [
          {
            //  this is prompt  that goes to gpt when api hit hogi
            role: "system",
            content: `You are a sentiment analyzer.
            Analyze the user's message and return a JSON object strictly in this format:
            {
              "label": "Positive" | "Negative" | "Neutral",
              "score": number
            }
            Rules for score:
            - 1 to 3: Negative (1 is worst)
            - 4 to 6: Neutral (5 is balanced)
            - 7 to 10: Positive (10 is best)`
          },
          {
            //  we describe our role ki me user hu meko ye sentiment btao
            role: "user",
            // content: "Pizza thanda tha"
            //  left side vala content is openai ka fix  and right side vala comes from frontend
            content: content
          }
        ],
        // JSON Mode ON (Taaki parsing error na aaye)
        response_format: { type: "json_object" }, 
        max_tokens: 50, // Cost bachane ke liye
      });

      // AI ka response parse karo
    //   choices: Kyunki AI multiple answers de sakta hai (humne 1 maanga hai, isliye [0]).

// message.content: Asli text (JSON string) yahan chupa hota hai.
      const aiResponse = completion.choices[0].message.content;
      
      if (aiResponse) {
        //  gpt sends {"label": "Positive"} and we want label: "Positive" so JSOn.parse helps us
        const parsedData = JSON.parse(aiResponse);
        sentimentLabel = parsedData.label; // Example: "Positive"
        sentimentScore = parsedData.score; // Example: 9
      }

    } catch (aiError) {
      console.error("OpenAI Error (Saving with defaults):", aiError);
      // Note: Agar AI fail hota hai, hum process nahi rokenge.
      // Message default Neutral/5 ke saath save ho jayega.
    }
    // 4. --- AI ANALYSIS END ---
    
    // 5. Database mein save karo (With AI Data)
    const newFeedback = await prisma.feedback.create({
      data: {
        content,
        userId: user.id,
        createdAt: new Date(),
        sentiment: sentimentLabel,   // AI wala label
        sentimentScore: sentimentScore // AI wala score
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