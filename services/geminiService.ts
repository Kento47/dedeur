
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// Initialize the Gemini API client using the environment variable directly.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Je bent de behulpzame AI-assistent van 'Evangelie Gemeente De Deur Lelydorp'.
Je toon is vriendelijk, gastvrij en duidelijk.
Context:
- Locatie: Lelydorp, Suriname.
- Identiteit: Onderdeel van de wereldwijde Christian Fellowship Ministries (CFM).
- Doel: Evangelisatie, discipelschap en kerkplanting.
- Sfeer: Een plek waar levens veranderen, genezing en hoop te vinden zijn.
- Diensten: Zondag 11:00 & 18:00, Woensdag 19:00.
Geef antwoorden in het Nederlands. Wees kort en bondig.
`;

let chatSession: Chat | null = null;

export const initChat = () => {
  if (!chatSession) {
    // Start a chat session using the gemini-3-flash-preview model for basic text tasks.
    chatSession = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
  }
  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const chat = initChat();
    // Use sendMessage to get a response from the model.
    const result: GenerateContentResponse = await chat.sendMessage({ message });
    // Use the .text property to get the generated text output.
    return result.text || "Ik kan momenteel geen verbinding maken. Probeert u het later nog eens.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Verbindingsfout. Controleer uw internetverbinding.";
  }
};
