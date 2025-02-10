"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [generatedText, setGeneratedText] = useState("");

  const handleGenerate = async () => {
    if (!prompt || !businessType || !targetAudience) {
      setGeneratedText("⚠️ Please fill in all fields before generating content.");
      return;
    }

    setGeneratedText("⏳ Generating content... Please wait.");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, businessType, targetAudience }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      if (data.result && data.result.parts && data.result.parts.length > 0) {
        setGeneratedText(data.result.parts[0].text);
      } else {
        setGeneratedText("⚠️ No response from AI.");
      }
    } catch (error) {
      console.error("API Error:", error);
      setGeneratedText("❌ Error generating content. Please try again.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen p-4 md:p-8 bg-gray-100">
      {/* Left Section (Inputs) */}
      <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Text Generator</h1>

        {/* Business Type Input */}
        <Input
          type="text"
          placeholder="What type of business do you have?"
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
          className="w-full mb-4"
        />

        {/* Target Audience Input */}
        <Input
          type="text"
          placeholder="Who is your target audience?"
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
          className="w-full mb-4"
        />

        {/* Main Prompt Input */}
        <Input
          type="text"
          placeholder="Enter your content idea..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full mb-4"
        />

        {/* Generate Button */}
        <Button onClick={handleGenerate} className="w-full bg-black text-white py-2">
          Generate
        </Button>
      </div>

      {/* Right Section (Generated Content) */}
      <div className="w-full md:w-2/3 mt-6 md:mt-0 md:ml-6">
        <Card className="w-full p-6 bg-white shadow-lg border rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Generated Content:</h2>
          <CardContent className="overflow-y-auto max-h-[75vh] p-4 bg-gray-50 rounded-lg">
            <div className="prose prose-lg max-w-full whitespace-normal break-words">
              <ReactMarkdown>{generatedText}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
