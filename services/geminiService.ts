
import { GoogleGenAI } from "@google/genai";
import { BusinessProfile } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async searchBusinesses(category: string, region: string, lat?: number, lng?: number): Promise<{ profiles: BusinessProfile[], rawText: string }> {
    try {
      const prompt = `Find top-rated ${category} in ${region}. For each business, extract:
      1. Name
      2. Full Address
      3. Phone Number (if available)
      4. Official Website URL (if available)
      5. Rating and Number of Reviews
      6. About (A short summary of the business)
      7. Owner/Manager details (if available)
      8. Contact Email (if available)

      Format the list clearly with labels for each field (e.g., Name:, Address:, About:, Owner:, Email:).`;

      const config: any = {
        tools: [{ googleMaps: {} }],
      };

      if (lat !== undefined && lng !== undefined) {
        config.toolConfig = {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        };
      }

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: config,
      });

      const text = response.text || "";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      
      const profiles = this.parseResponse(text, chunks);

      return { profiles, rawText: text };
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  private parseResponse(text: string, chunks: any[]): BusinessProfile[] {
    const lines = text.split('\n');
    const profiles: BusinessProfile[] = [];
    let currentProfile: Partial<BusinessProfile> = {};

    lines.forEach((line) => {
      const trimmed = line.trim();
      
      const nameMatch = trimmed.match(/^\d+\.\s+\**(.+?)\**$/) || trimmed.match(/^\*\s+\**(.+?)\**$/);
      
      if (nameMatch) {
        if (currentProfile.name) {
          profiles.push({ ...currentProfile, id: Math.random().toString(36).substr(2, 9) } as BusinessProfile);
          currentProfile = {};
        }
        currentProfile.name = nameMatch[1];
      } else if (trimmed.toLowerCase().includes('address:')) {
        currentProfile.address = trimmed.replace(/address:/i, '').replace(/^\W+/, '').trim();
      } else if (trimmed.toLowerCase().includes('phone:')) {
        currentProfile.phone = trimmed.replace(/phone:/i, '').replace(/^\W+/, '').trim();
      } else if (trimmed.toLowerCase().includes('website:')) {
        currentProfile.website = trimmed.replace(/website:/i, '').replace(/^\W+/, '').trim();
      } else if (trimmed.toLowerCase().includes('about:')) {
        currentProfile.about = trimmed.replace(/about:/i, '').replace(/^\W+/, '').trim();
      } else if (trimmed.toLowerCase().includes('owner:')) {
        currentProfile.owner = trimmed.replace(/owner:/i, '').replace(/^\W+/, '').trim();
      } else if (trimmed.toLowerCase().includes('email:')) {
        currentProfile.email = trimmed.replace(/email:/i, '').replace(/^\W+/, '').trim();
      } else if (trimmed.toLowerCase().includes('rating:')) {
        const ratingMatch = trimmed.match(/(\d+(\.\d+)?)/);
        if (ratingMatch) currentProfile.rating = parseFloat(ratingMatch[1]);
      }
    });

    if (currentProfile.name) {
      profiles.push({ ...currentProfile, id: Math.random().toString(36).substr(2, 9) } as BusinessProfile);
    }

    profiles.forEach((p, idx) => {
      const chunkMatch = chunks.find(c => c.maps?.title?.toLowerCase().includes(p.name?.toLowerCase() || ''));
      if (chunkMatch) {
        p.mapUrl = chunkMatch.maps.uri;
      } else if (chunks[idx]) {
        p.mapUrl = chunks[idx].maps?.uri;
      }
    });

    return profiles;
  }
}
