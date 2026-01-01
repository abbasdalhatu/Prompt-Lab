import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePerfectPrompt = async (userInput: string): Promise<string> => {
  const systemPrompt = `You are an expert prompt engineer. Transform the user's request into a highly effective prompt using the RCCF Formula (Role, Context, Command, Format).

  1. Role: Assign a specific, expert persona (e.g., "Act as a Senior Physicist").
  2. Context: Provide background, audience, and specific constraints.
  3. Command: clearly state the specific task or action required.
  4. Format: Define exactly how the output should look (e.g., table, list, tone).

  OUTPUT RULES:
  - Return ONLY the final prompt text.
  - Do NOT include section headers like "Role:", "Context:", "Goal:", or "Task:".
  - Do NOT use markdown formatting (no asterisks, no hashtags).
  - The result must be a single cohesive block of instructions ready for the user to copy.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userInput,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    let text = response.text?.trim() || "Failed to generate prompt. Please try again.";
    
    // Post-processing to strictly remove any stray hashtags or asterisks
    text = text.replace(/[*#]/g, '');

    return text;
  } catch (error) {
    console.error("Error generating prompt:", error);
    throw error;
  }
};