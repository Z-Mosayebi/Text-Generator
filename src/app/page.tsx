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
    <div className="flex min-h-screen p-6 bg-gray-100">
      {/* Left Side - Inputs */}
      <div className="w-1/3 bg-white p-6 rounded-lg shadow-md">
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

      {/* Right Side - Generated Text Output */}
      <div className="w-2/3 ml-6 bg-white p-6 rounded-lg shadow-md overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Generated Content:</h2>
        {generatedText ? (
          <Card className="w-full p-4 bg-gray-50">
            <CardContent>
              <ReactMarkdown className="prose max-w-full">{generatedText}</ReactMarkdown>
            </CardContent>
          </Card>
        ) : (
          <p className="text-gray-500">Enter details and click generate to see results.</p>
        )}
      </div>
    </div>
  );
}
