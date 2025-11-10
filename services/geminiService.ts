// Fix: Removed unused Type import as responseSchema is no longer used.
import { GoogleGenAI } from "@google/genai";
import { ProductInfo } from "../types";

// Fix: Per guidelines, initialize GoogleGenAI with process.env.API_KEY directly and remove unnecessary checks.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });


// Fix: Switched to Google Search grounding to allow the model to access live URL content.
// This requires removing responseSchema/responseMimeType and updating the prompt to request JSON explicitly.
export const fetchProductInfoFromUrl = async (url: string): Promise<ProductInfo> => {
  const prompt = `
    Based on the content of the provided Amazon product URL, extract the following information:
    1.  Product Title
    2.  Current Price (including currency symbol, e.g., '$29.99'). If not found, use 'Price not found'.
    3.  Availability Status (e.g., 'In Stock', 'Currently unavailable.', 'Out of Stock'). If not found, use 'Availability not found'.
    4.  Main Product Image URL (must be a direct link to an image file, e.g., .jpg, .png). If not found, use 'Image not found'.

    URL: ${url}

    Return ONLY a single, valid JSON object with the keys "title", "price", "availability", and "imageUrl".
    Do not include markdown formatting like \`\`\`json or any other text outside of the JSON object.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        // Fix: Use googleSearch tool to enable fetching live data from the URL.
        tools: [{googleSearch: {}}],
      },
    });

    let jsonString = response.text.trim();
    // The model can sometimes wrap the JSON in markdown, so we need to strip it.
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.slice(7, -3).trim();
    } else if (jsonString.startsWith('```')) {
        jsonString = jsonString.slice(3, -3).trim();
    }
    
    const productInfo: ProductInfo = JSON.parse(jsonString);

    // Fix: Extract and return grounding sources as required by guidelines when using googleSearch.
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    if (groundingMetadata?.groundingChunks) {
      productInfo.sources = groundingMetadata.groundingChunks
        .filter(chunk => chunk.web && chunk.web.uri)
        .map(chunk => ({
          uri: chunk.web.uri,
          title: chunk.web.title || 'Source',
        }));
    }

    return productInfo;

  } catch (error) {
    console.error("Error fetching or parsing product info from Gemini:", error);
    throw new Error("Failed to get product details from the Gemini API.");
  }
};
