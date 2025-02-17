"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

const SimpleMarkdown = ({ text }) => {
  if (!text) return null;

  // Clean up any markdown syntax indicators
  const cleanText = text.replace(/^```markdown\s*/, '').replace(/```\s*$/, '');
  
  // Split text into lines and process each line
  const lines = cleanText.split('\n');
  
  const processLine = (line, index) => {
    // Process headings
    if (line.startsWith('## ')) {
      return <h2 key={index} className="text-xl font-semibold mt-6 mb-4">{line.slice(3)}</h2>;
    }
    if (line.startsWith('# ')) {
      return <h1 key={index} className="text-2xl font-bold mt-8 mb-6">{line.slice(2)}</h1>;
    }

    // Process lists
    if (line.trim().startsWith('- ')) {
      // Process bold text within list items
      const listContent = line.slice(2);
      const parts = listContent.split(/(\*\*.*?\*\*)/g);
      
      return (
        <div key={index} className="flex items-start my-2 ml-4">
          <span className="mr-2 text-gray-600">•</span>
          <span className="text-gray-800">
            {parts.map((part, i) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
          </span>
        </div>
      );
    }

    // Process blockquotes
    if (line.trim().startsWith('>')) {
      return (
        <blockquote key={index} className="border-l-4 border-gray-300 pl-4 my-4 italic text-gray-700">
          {line.slice(1).trim()}
        </blockquote>
      );
    }

    // Process bold text in regular paragraphs
    if (line.includes('**')) {
      const parts = line.split(/(\*\*.*?\*\*)/g);
      return (
        <p key={index} className="my-3 text-gray-800 leading-relaxed">
          {parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
              return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    }

    // Empty lines become spacing
    if (line.trim() === '') {
      return <div key={index} className="h-4" />;
    }

    // Default to paragraph
    return <p key={index} className="my-3 text-gray-800 leading-relaxed">{line}</p>;
  };

  return (
    <div className="space-y-1">
      {lines.map((line, index) => processLine(line, index))}
    </div>
  );
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [generatedText, setGeneratedText] = useState("");

  const formatAsMarkdown = (text) => {
    // Add markdown formatting to headings
    text = text.replace(/^(.*?):(?!\/)$/gm, '## $1');
    
    // Convert asterisk points to proper markdown bullet points
    text = text.replace(/^\s*\*\s*/gm, '- ');
    
    // Ensure proper spacing around lists and sections
    text = text.replace(/\n(?=##)/g, '\n\n');
    text = text.replace(/\n(?=-)/g, '\n\n');
    
    // Add emphasis to key terms
    text = text.replace(/\*\*(.*?)\*\*/g, '**$1**');
    
    // Format any potential quotes
    text = text.replace(/^>"?(.*?)"?$/gm, '> $1');

    return text;
  };

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
        const formattedText = formatAsMarkdown(data.result.parts[0].text);
        setGeneratedText(formattedText);
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
      <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Text Generator</h1>
        <Input 
          type="text" 
          placeholder="What type of business do you have?" 
          value={businessType} 
          onChange={(e) => setBusinessType(e.target.value)} 
          className="w-full mb-4" 
        />
        <Input 
          type="text" 
          placeholder="Who is your target audience?" 
          value={targetAudience} 
          onChange={(e) => setTargetAudience(e.target.value)} 
          className="w-full mb-4" 
        />
        <Input 
          type="text" 
          placeholder="Enter your content idea..." 
          value={prompt} 
          onChange={(e) => setPrompt(e.target.value)} 
          className="w-full mb-4" 
        />
        <Button 
          onClick={handleGenerate} 
          className="w-full bg-black text-white py-2"
        >
          Generate
        </Button>
      </div>
      <div className="w-full md:w-2/3 mt-6 md:mt-0 md:ml-6">
        <Card className="w-full h-full bg-white shadow-lg border rounded-lg">
          <h2 className="text-xl font-semibold p-6 pb-0">Generated Content:</h2>
          <CardContent className="overflow-y-auto max-h-[75vh] p-6 text-base">
            <SimpleMarkdown text={generatedText} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}