import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export const generateOutfit = async (params: { occasion: string; weather: string; style: string; budget: string }) => {
  // 1. Generate multiple outfit options
  const textResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate 3 distinct men's outfit options for: Occasion: ${params.occasion}, Weather: ${params.weather}, Style: ${params.style}, Budget: ${params.budget}. Each should have a 'visual_prompt'.`,
    config: {
      systemInstruction: "You are a men's fashion expert. Always focus ONLY on men's fashion. Provide 3 distinct outfit options. For each, include a 'visual_prompt' describing the look. Always return responses in clean JSON format.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            outfit_name: { type: Type.STRING },
            top: { type: Type.STRING },
            bottom: { type: Type.STRING },
            shoes: { type: Type.STRING },
            accessories: { type: Type.ARRAY, items: { type: Type.STRING } },
            color_palette: { type: Type.ARRAY, items: { type: Type.STRING } },
            style_tip: { type: Type.STRING },
            visual_prompt: { type: Type.STRING }
          },
          required: ["outfit_name", "top", "bottom", "shoes", "accessories", "color_palette", "style_tip", "visual_prompt"]
        }
      }
    }
  });

  const outfits = JSON.parse(textResponse.text || "[]");

  // 2. Generate images for each outfit
  const outfitsWithImages = await Promise.all(outfits.map(async (outfit: any) => {
    try {
      const imageResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
          parts: [{ text: `Professional men's fashion studio shot: ${outfit.visual_prompt}. High resolution, clean background.` }]
        },
        config: {
          imageConfig: {
            aspectRatio: "3:4"
          }
        }
      });

      let base64Image = "";
      for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          base64Image = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
      return { ...outfit, image_url: base64Image };
    } catch (error) {
      console.error("Outfit image generation failed:", error);
      return { ...outfit, image_url: `https://picsum.photos/seed/${outfit.outfit_name.replace(/\s/g, '')}/600/800` };
    }
  }));

  return outfitsWithImages;
};

export const analyzeBodyType = async (params: { height: string; weight: string; chest?: string; waist?: string }) => {
  // 1. Generate analysis text and image prompt
  const textResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze men's body type for: Height: ${params.height}, Weight: ${params.weight}, Chest: ${params.chest || "N/A"}, Waist: ${params.waist || "N/A"}. Include a 'visual_prompt' for image generation.`,
    config: {
      systemInstruction: "You are a men's fashion expert. Always focus ONLY on men's fashion. Analyze body type and provide styling advice. Include a 'visual_prompt' describing a man with this specific body type wearing well-fitted clothes. Always return responses in clean JSON format.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          feature: { type: Type.STRING },
          body_type: { type: Type.STRING },
          recommended_fits: { type: Type.ARRAY, items: { type: Type.STRING } },
          best_clothing_styles: { type: Type.ARRAY, items: { type: Type.STRING } },
          avoid_styles: { type: Type.ARRAY, items: { type: Type.STRING } },
          styling_tips: { type: Type.STRING },
          visual_prompt: { type: Type.STRING }
        },
        required: ["feature", "body_type", "recommended_fits", "best_clothing_styles", "avoid_styles", "styling_tips", "visual_prompt"]
      }
    }
  });

  const bodyData = JSON.parse(textResponse.text || "{}");

  // 2. Generate image
  try {
    const imageResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [{ text: `Professional men's physique and style reference: ${bodyData.visual_prompt}. High-fashion photography, clean background.` }]
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4"
        }
      }
    });

    let base64Image = "";
    for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        base64Image = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }

    return { ...bodyData, image_url: base64Image };
  } catch (error) {
    console.error("Body analysis image generation failed:", error);
    return { ...bodyData, image_url: `https://picsum.photos/seed/${bodyData.body_type.replace(/\s/g, '')}/600/800` };
  }
};

export const virtualTryOn = async (params: { item_name: string; category: string; color: string; user_style: string }) => {
  // 1. Generate try-on text and image prompt
  const textResponse = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Virtual try-on assistant for: Item: ${params.item_name}, Category: ${params.category}, Color: ${params.color}, User Style: ${params.user_style}. Include a 'visual_prompt' for image generation.`,
    config: {
      systemInstruction: "You are a men's fashion expert. Always focus ONLY on men's fashion. Provide virtual try-on assistance and matching suggestions. Include a 'visual_prompt' describing a man wearing the item in a stylish setting. Always return responses in clean JSON format.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          feature: { type: Type.STRING },
          item_preview_description: { type: Type.STRING },
          matching_items: {
            type: Type.OBJECT,
            properties: {
              pants: { type: Type.STRING },
              shoes: { type: Type.STRING },
              accessories: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["pants", "shoes", "accessories"]
          },
          alternative_colors: { type: Type.ARRAY, items: { type: Type.STRING } },
          style_tip: { type: Type.STRING },
          visual_prompt: { type: Type.STRING }
        },
        required: ["feature", "item_preview_description", "matching_items", "alternative_colors", "style_tip", "visual_prompt"]
      }
    }
  });

  const tryOnData = JSON.parse(textResponse.text || "{}");

  // 2. Generate image
  try {
    const imageResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [{ text: `High-fashion men's try-on preview: ${tryOnData.visual_prompt}. Cinematic lighting, realistic texture.` }]
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4"
        }
      }
    });

    let base64Image = "";
    for (const part of imageResponse.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        base64Image = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }

    return { ...tryOnData, image_url: base64Image };
  } catch (error) {
    console.error("Try-on image generation failed:", error);
    return { ...tryOnData, image_url: `https://picsum.photos/seed/${tryOnData.item_preview_description.substring(0, 10)}/600/800` };
  }
};

// --- Restored Functions ---

export const chatWithAssistant = async (message: string, history: any[]) => {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: "You are Layered AI, a cool and helpful men's fashion assistant for a premium streetwear brand. Your tone is minimal, professional, and slightly edgy. Help users with styling advice, product info, and fashion trends. Focus ONLY on men's fashion.",
    },
    history: history
  });
  const response = await chat.sendMessage({ message });
  return response.text;
};

export interface Combo {
  id: string;
  name: string;
  description: string;
  productIds: string[];
}

export const getAICuratedCombos = async (products: any[]): Promise<Combo[]> => {
  const productList = products.map(p => ({ id: p.id, name: p.name, category: p.category }));
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Curate 3 stylish men's streetwear combos from this product list: ${JSON.stringify(productList)}`,
    config: {
      systemInstruction: "You are a men's fashion curator. Create 3 distinct combos. Each combo should have 2-3 items that look great together. Return as JSON array of objects with id, name, description, and productIds.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            description: { type: Type.STRING },
            productIds: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["id", "name", "description", "productIds"]
        }
      }
    }
  });
  return JSON.parse(response.text || "[]");
};

export const getOutfitRecommendations = async (product: any, allProducts: any[]) => {
  const productList = allProducts.map(p => ({ id: p.id, name: p.name, category: p.category }));
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `What should I wear with this item: ${product.name} (${product.category})? Choose 2-3 items from this list: ${JSON.stringify(productList)}`,
    config: {
      systemInstruction: "You are a men's fashion expert. Suggest 2-3 items to complete the look from the provided list. Return as JSON object with 'products' (array of objects with id) and 'explanation' (string).",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          products: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING }
              },
              required: ["id"]
            }
          },
          explanation: { type: Type.STRING }
        },
        required: ["products", "explanation"]
      }
    }
  });
  const data = JSON.parse(response.text || "{}");
  // Map back to full product objects
  const recommendedProducts = data.products.map((p: any) => allProducts.find(ap => ap.id === p.id)).filter(Boolean);
  return { products: recommendedProducts, explanation: data.explanation };
};

export const getSizeRecommendation = async (params: { height: number; weight: number; chest?: number; waist?: number; fitPreference?: string; product: any }) => {
  const { height, weight, chest, waist, fitPreference, product } = params;
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Recommend a size for ${product.name} (${product.category}) given:
      Height: ${height}cm, 
      Weight: ${weight}kg, 
      Chest: ${chest || 'N/A'}cm, 
      Waist: ${waist || 'N/A'}cm, 
      Fit Preference: ${fitPreference || 'Regular'}.
      Available sizes: ${product.sizes.join(', ')}.`,
    config: {
      systemInstruction: "You are a sizing expert. Recommend the best size and explain why. Consider the fit preference (Slim, Regular, Oversized). Return as JSON object with 'recommendedSize' and 'explanation'.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recommendedSize: { type: Type.STRING },
          explanation: { type: Type.STRING }
        },
        required: ["recommendedSize", "explanation"]
      }
    }
  });
  return JSON.parse(response.text || "{}");
};
