import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log(" API HIT: /api/generate (Gemini)");

    // Read request body
    const { prompt, businessType, targetAudience } = await req.json();
    console.log(" Received Input:", { prompt, businessType, targetAudience });

    if (!prompt || !businessType || !targetAudience) {
      return NextResponse.json({ error: "Missing input fields" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key is missing" }, { status: 500 });
    }

    //  **Updated AI Prompt to Ensure Blog Post Structure**
    const fullPrompt = `
      You are a professional blog writer specializing in ${businessType}.
      Your target audience is ${targetAudience}.
      Write a **detailed, well-structured blog post** based on the following user request:

      ---
      "${prompt}"
      ---

      **Follow this blog structure:**
      - Use a **catchy, SEO-optimized title**.
      - Write an **engaging introduction** (hook, problem statement, and solution preview).
      - Organize the content with **headings (## Section Name)**.
      - Use **bullet points, numbered lists, and bold key points** where helpful.
      - Ensure **natural flow and readability** (short paragraphs, transitions).
      - Conclude with a **strong ending** and a **call to action (CTA)**.
      - **Format the response in Markdown**.
    `;

    console.log("🔗 Sending request to Gemini...");
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
      }),
    });

    console.log(" Response received from Gemini");
    const data = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
      return NextResponse.json({ error: "Gemini API response was empty" }, { status: 500 });
    }

    console.log(" AI Response:", data.candidates[0].content);
    return NextResponse.json({ result: data.candidates[0].content });
  } catch (error) {
    console.error(" API ERROR:", error);

    // Ensure error is treated as an Error object
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
}
}
