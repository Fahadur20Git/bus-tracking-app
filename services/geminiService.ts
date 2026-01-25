
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export async function detectRoadSegmentAndRoutes(lat: number, lng: number) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a Tamil Nadu bus expert. A user is at coordinates ${lat}, ${lng}. 
      1. Identify the specific road segment or village they are in.
      2. List at least 5 major bus routes (Government TNSTC, SETC, MTC, or Private) that pass through this exact point, even if it's not a formal stop.
      3. For each route, provide the Bus Number, Name, Source, Destination, and Estimated Frequency.
      4. If this is a rural area between two towns, explicitly mention that.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            locationName: { type: Type.STRING, description: "Descriptive name of the road segment/locality" },
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
                  estimatedArrivalTimeMinutes: { type: Type.NUMBER }
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

export async function searchBusesOnRoute(source: string, destination: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `List all Tamil Nadu bus services (TNSTC, SETC, Private, Mini-buses) operating between ${source} and ${destination}. Include local rural buses.`,
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
                  tripsPerDay: { type: Type.NUMBER }
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
      contents: `Create a digital timing board for ${standName} Bus Stand in Tamil Nadu. List 10 upcoming departures including bus numbers, destinations, and scheduled times.`,
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
                  status: { type: Type.STRING, description: "ON TIME or DELAYED X MINS" },
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
