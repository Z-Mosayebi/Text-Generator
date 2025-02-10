"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { marked } from "marked";

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
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4">
      <h1 className="text-3xl font-bold">Text Generator</h1>

      {/* Business Type Input */}
      <Input
        type="text"
        placeholder="What type of business do you have?"
        value={businessType}
        onChange={(e) => setBusinessType(e.target.value)}
        className="w-96"
      />

      {/* Target Audience Input */}
      <Input
        type="text"
        placeholder="Who is your target audience?"
        value={targetAudience}
        onChange={(e) => setTargetAudience(e.target.value)}
        className="w-96"
      />

      {/* Main Prompt Input */}
      <Input
        type="text"
        placeholder="Enter your content idea..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-96"
      />

      {/* Generate Button */}
      <Button onClick={handleGenerate} className="w-32">
        Generate
      </Button>

      {/* Output Section */}
      {generatedText && (
        <Card className="w-96 p-4">
          <CardContent>
            <div dangerouslySetInnerHTML={{ __html: marked(generatedText) }} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
