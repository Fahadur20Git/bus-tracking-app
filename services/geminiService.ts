
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export async function detectRoadSegmentAndRoutes(lat: number, lng: number) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a Tamil Nadu bus expert. A user is at coordinates ${lat}, ${lng}. 
      1. Identify the specific road segment or village they are in.
      2. List at least 8 major bus routes (Government TNSTC, SETC, MTC, or Private) that pass through this exact point.
      3. For each route, provide the Bus Number, Name, Source, Destination, Estimated Frequency, and Estimated time it passes this point.
      4. If this is a rural area between two towns, explicitly mention that.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            locationName: { type: Type.STRING },
            isRural: { type: Type.BOOLEAN },
            routes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  busNumber: { type: Type.STRING },
                  name: { type: Type.STRING },
                  type: { type: Type.STRING },
                  source: { type: Type.STRING },
                  destination: { type: Type.STRING },
                  frequencyMinutes: { type: Type.NUMBER },
                  estimatedArrivalTimeMinutes: { type: Type.NUMBER },
                  timeAtYourLocation: { type: Type.STRING }
                },
                required: ["busNumber", "name", "source", "destination"]
              }
            }
          },
          required: ["locationName", "routes"]
        }
      }
    });

    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini Detection Error:", error);
    return null;
  }
}

export async function getTravelAnalytics(location: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide travel analytics for the area around "${location}" in Tamil Nadu. 
      Estimate: 
      1. Percentage of people using Government vs Private buses.
      2. Hourly passenger demand (0-23 hours).
      3. Specific insights on night travel (9 PM - 5 AM).
      4. Daily passenger volume estimate.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            govShare: { type: Type.NUMBER, description: "Percentage share of Government buses" },
            privShare: { type: Type.NUMBER, description: "Percentage share of Private buses" },
            hourlyDemand: { 
              type: Type.ARRAY, 
              items: { type: Type.NUMBER },
              description: "24 values representing demand intensity 0-100" 
            },
            dailyVolume: { type: Type.STRING },
            nightTravelFactor: { type: Type.STRING },
            topDestinations: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini Analytics Error:", error);
    return null;
  }
}

export async function searchBusesOnRoute(source: string, destination: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `List all Tamil Nadu bus services operating between ${source} and ${destination}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            totalBusesPerDay: { type: Type.NUMBER },
            buses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  busNumber: { type: Type.STRING },
                  name: { type: Type.STRING },
                  type: { type: Type.STRING },
                  firstBus: { type: Type.STRING },
                  lastBus: { type: Type.STRING },
                  frequencyMinutes: { type: Type.NUMBER },
                  tripsPerDay: { type: Type.NUMBER },
                  departureTime: { type: Type.STRING },
                  arrivalTime: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini Route Search Error:", error);
    return null;
  }
}

export async function getBusStandTimingBoard(standName: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Create a digital timing board for ${standName} Bus Stand.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            standName: { type: Type.STRING },
            departures: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  busNumber: { type: Type.STRING },
                  destination: { type: Type.STRING },
                  scheduledTime: { type: Type.STRING },
                  platform: { type: Type.STRING },
                  status: { type: Type.STRING },
                  type: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text.trim());
  } catch (error) {
    console.error("Gemini Timing Board Error:", error);
    return null;
  }
}
