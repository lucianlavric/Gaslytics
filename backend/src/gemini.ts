import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function getPrompt(clips: any[]): string {
  const clipsJson = JSON.stringify(clips, null, 2);
  return `
    You are an expert relationship counselor and communication analyst.
    Based on the following JSON data which contains transcribed clips of a conversation, please provide:
    1.  **Conversation Summary**: A brief, neutral summary of the entire conversation's dynamics and key topics.
    2.  **Mediator's Perspective**: A compassionate and insightful perspective as a neutral mediator. Offer advice on how the participants could have communicated more effectively and suggest a path toward resolution.

    Here is the analysis data:
    \`\`\`json
    ${clipsJson}
    \`\`\`

    Please format your response as a single JSON object with two keys: "summary" and "mediatorPerspective".
    Do not include the names of the speakers.
    `;
}

export async function generateInsights(
  clips: any[]
): Promise<{ summary: string; mediatorPerspective: string }> {
  if (!clips || clips.length === 0) {
    throw new Error("Cannot generate insights from empty analysis.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const prompt = getPrompt(clips);

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the response to ensure it's valid JSON
    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const insights = JSON.parse(cleanedText);

    if (!insights.summary || !insights.mediatorPerspective) {
      throw new Error("Invalid response format from Gemini API.");
    }

    return insights;
  } catch (error) {
    console.error("Error generating insights with Gemini:", error);
    throw new Error("Failed to generate insights from Gemini.");
  }
}
