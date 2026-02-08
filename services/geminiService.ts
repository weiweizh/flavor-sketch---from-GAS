import { GoogleGenAI } from "@google/genai";
import { CoffeeDetails } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY environment variable is not set");
  }
  return new GoogleGenAI({ apiKey });
};

export const translateToTC = async (
  notes: string,
  details: CoffeeDetails
): Promise<{ notes: string; details: CoffeeDetails }> => {
  const ai = getClient();
  
  // Prompt updated to be conditional: Translate SC to TC, but keep English/TC as is.
  const prompt = `
    You are a professional coffee translator. 
    Review the following coffee information:
    Input JSON:
    ${JSON.stringify({ notes, details })}

    Rules:
    1. **Language Detection**: Check if the content is in Simplified Chinese (SC).
    2. **Simplified Chinese Handling**: If any part is in Simplified Chinese, translate it to Traditional Chinese (Taiwan standard / 繁體中文).
       - 'notes' should become descriptive, appetizing Traditional Chinese.
       - 'details' fields like 'processMethod' (e.g., 水洗), 'roastLevel', 'brewingMethod' should be standard TC terms.
       - 'beanName', 'roaster', 'origin' -> Translate to TC common names (e.g., 衣索比亞) if recognized, otherwise keep specific branding.
    3. **English / Traditional Chinese Handling**: If the input is ALREADY in English or Traditional Chinese, **KEEP IT EXACTLY AS IS**. 
       - DO NOT translate English to Chinese.
       - DO NOT translate Traditional Chinese to English.
       - Simply return the original text.
    4. Return ONLY valid JSON with the exact same structure as the input.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { responseMimeType: 'application/json' }
    });

    const text = response.text?.trim();
    if (!text) throw new Error("Empty translation response");
    
    return JSON.parse(text);
  } catch (error) {
    console.warn("Translation failed, returning original text", error);
    // Fallback to original if translation fails
    return { notes, details };
  }
};

export const generateFlavorImage = async (flavorNotes: string): Promise<{ imageUrl: string, backgroundColor: string }> => {
  const ai = getClient();
  
  // 1. Color Extraction Prompt
  const colorPrompt = `
    Analyze these coffee flavor notes: "${flavorNotes}".
    1. Identify the most dominant flavor element (e.g., strawberry, citrus, chocolate, herbal).
    2. Determine the characteristic color of that element.
    3. Convert that color into a VERY LIGHT, PASTEL background hex code.
       - It must be high brightness, low saturation.
       - It must be light enough for black text to be perfectly legible on top.
       - It should basically be an off-white or very faint wash of the flavor color.
    
    Examples:
    - Strawberry -> #fff0f5
    - Chocolate -> #f5f0eb
    - Citrus -> #fffbe6
    - Herb -> #f0f7f0
    - Blueberry -> #f0f4f8
    
    Return ONLY the hex code string (e.g., #fdfbf7). Do not add any other text.
  `;

  try {
    // STEP 1: Determine the background color first (Sequential execution)
    let backgroundColor = '#fdfbf7'; // Default warm white
    
    try {
        const colorResponse = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: colorPrompt,
        });
        const colorText = colorResponse.text?.trim();
        if (colorText && /^#[0-9A-Fa-f]{6}$/.test(colorText)) {
            backgroundColor = colorText;
        }
    } catch (e) {
        console.warn("Color generation failed, defaulting to warm white", e);
    }

    // STEP 2: Generate Image using the specific background color
    const imagePrompt = `
      Create a square digital illustration representing the flavors described in these coffee tasting notes: "${flavorNotes}".
      
      Style Guide:
      - Art Style: Mix of Y2K vector illustration aesthetic and organic hand-drawn sketch styles.
      - Composition: Artfully arranged ingredients (fruits, flowers, chocolates, etc.) corresponding to the tasting notes.
      - Layout Constraints: To maintain aesthetic balance and sufficient white space (negative space), DO NOT display any single specific food item mentioned in the notes more than 2 times. For example, if 'strawberry' is mentioned, draw at most 1 or 2 strawberries, never a pile. Keep the composition airy, simple, and balanced.
      - Technique: Looks like a high-quality marker or ink drawing on paper.
      - Color Palette: Warm, cozy, vibrant but slightly desaturated (retro feel).
      - Text Policy: STRICTLY NO TEXT. NO WORDS. NO CHARACTERS. Do not include the flavor names, letters, or any Chinese characters in the illustration. The image must be purely visual.
      - Background: SOLID, FLAT, SINGLE COLOR with hex code ${backgroundColor}. The entire background of the square image must be this exact color.
      - Vibe: Indie coffee shop flavor card art.
      
      Do not make it photorealistic. Make it illustrative and artistic.
    `;

    const imageResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: imagePrompt }] },
    });

    // --- Process Image ---
    let imageUrl = '';
    const parts = imageResponse.candidates?.[0]?.content?.parts;
    if (parts) {
        for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
                imageUrl = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                break;
            }
        }
    }
    if (!imageUrl) throw new Error("No image data found in response");

    return { imageUrl, backgroundColor };

  } catch (error: any) {
    console.error("Gemini Generation Error:", error);
    throw new Error(error.message || "Failed to generate flavor card");
  }
};