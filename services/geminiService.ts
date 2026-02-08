import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is not set");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateFlavorImage = async (flavorNotes: string): Promise<string> => {
  const ai = getClient();
  
  // Constructing a prompt that targets the specific aesthetic requested:
  // Y2K illustration, handwriting styles, aesthetic mix, hand drawing style.
  const prompt = `
    Create a square digital illustration representing these coffee tasting notes: "${flavorNotes}".
    
    Style Guide:
    - Art Style: Mix of Y2K vector illustration aesthetic and organic hand-drawn sketch styles.
    - Composition: Artfully arranged ingredients (fruits, flowers, chocolates, etc.) corresponding to the tasting notes.
    - Layout Constraints: To maintain aesthetic balance and sufficient white space (negative space), DO NOT display any single specific food item mentioned in the notes more than 2 times. For example, if 'strawberry' is mentioned, draw at most 1 or 2 strawberries, never a pile. Keep the composition airy, simple, and balanced.
    - Technique: Looks like a high-quality marker or ink drawing on paper.
    - Color Palette: Warm, cozy, vibrant but slightly desaturated (retro feel).
    - Text: If the flavor notes are in English, include the flavor names written in a messy but stylish handwritten font integrated into the illustration. If the flavor notes are in Chinese or any other non-English language, DO NOT include any text or words in the illustration.
    - Background: Solid warm white or very light cream hex code #fdfbf7.
    - Vibe: Indie coffee shop flavor card.
    
    Do not make it photorealistic. Make it illustrative and artistic.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        // While responseMimeType isn't supported for nano banana models for *content* generation,
        // we are generating an image where the output format is handled by the model's native image generation capabilities.
        // We rely on extracting inlineData.
      }
    });

    // Extract the image from the response candidates
    const parts = response.candidates?.[0]?.content?.parts;
    
    if (!parts) {
      throw new Error("No content generated");
    }

    // Iterate to find the image part
    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found in response");

  } catch (error: any) {
    console.error("Gemini Image Generation Error:", error);
    throw new Error(error.message || "Failed to generate flavor card");
  }
};