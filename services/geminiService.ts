import { GoogleGenAI, Type } from "@google/genai";
import { ReportFormData, ReportResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateReportText = async (data: ReportFormData): Promise<ReportResult> => {
  const modelId = "gemini-2.5-flash";
  
  const prompt = `
    You are an expert legal and content moderation assistant for social media platforms, specifically TikTok.
    A user wants to report a Live Stream that violates community guidelines.
    
    Here are the details provided by the user:
    - Streamer Username: ${data.username}
    - Violation Type: ${data.violationType}
    - Specific Details: ${data.details}
    ${data.timestamp ? `- Timestamp/Duration: ${data.timestamp}` : ''}

    Please generate a structured response with the following 4 fields:
    1. 'arabicReport': A formal, persuasive report message written in Arabic that the user can copy and paste into the "Other" or "Description" field of the reporting tool. It should cite general safety policies.
    2. 'englishReport': The same report written in formal English (as support teams often respond faster to English).
    3. 'advice': Brief advice on what else the user should do (e.g., block user, contact support via email) in Arabic.
    4. 'communityAlert': A short, urgent, and catchy message in Arabic designed to be shared on WhatsApp, Telegram, or Discord groups. It should ask people to help report this user immediately, mention the username clearly, and briefly state the reason. Use emojis (🚨, ⚠️) to grab attention.

    Tone: Professional, urgent, and factual.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            arabicReport: { type: Type.STRING },
            englishReport: { type: Type.STRING },
            advice: { type: Type.STRING },
            communityAlert: { type: Type.STRING }
          },
          required: ["arabicReport", "englishReport", "advice", "communityAlert"]
        }
      }
    });

    const text = response.text;
    if (!text) {
        throw new Error("No response from AI");
    }
    
    const result = JSON.parse(text) as ReportResult;
    return result;

  } catch (error) {
    console.error("Error generating report:", error);
    throw new Error("فشل في توليد التقرير. يرجى المحاولة مرة أخرى.");
  }
};