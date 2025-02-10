import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("🔥 API HIT: /api/generate (Gemini)");

    // Read request body
    const { prompt, businessType, targetAudience } = await req.json();
    console.log("📩 Received Input:", { prompt, businessType, targetAudience });

    // Validate input
    if (!prompt || !businessType || !targetAudience) {
      console.log("❌ Missing input fields");
      return NextResponse.json({ error: "Missing input fields" }, { status: 400 });
    }

    // Check if API key is available
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.log("❌ Gemini API Key Missing");
      return NextResponse.json({ error: "Gemini API key is missing" }, { status: 500 });
    }

    // Construct prompt message
    const fullPrompt = `Generate content for a ${businessType} targeting ${targetAudience}. Here is the user request: ${prompt}`;

    // Make request to Google's Gemini API
    console.log("🔗 Sending request to Gemini...");
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: fullPrompt }],
          },
        ],
      }),
    });

    console.log("✅ Response received from Gemini");
    const data = await response.json();

    // Check if Gemini returned a response
    if (!data.candidates || data.candidates.length === 0) {
      console.log("❌ Gemini returned an empty response");
      return NextResponse.json({ error: "Gemini API response was empty" }, { status: 500 });
    }

    console.log("📝 AI Response:", data.candidates[0].content);
    return NextResponse.json({ result: data.candidates[0].content });
  } catch (error) {
    console.error("❌ API ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
