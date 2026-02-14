
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export async function detectRoadSegmentAndRoutes(lat: number, lng: number) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a Tamil Nadu bus expert. A user is at coordinates ${lat}, ${lng}. 
      1. Identify the specific road segment, village, or town they are in.
      2. List at least 8 major and local bus routes (TNSTC, SETC, MTC, Private, or Rural Mini Buses) that pass through this exact point.
      3. For each, provide Bus Number, Name, Source, Destination, and Estimated Frequency.
      4. Include specific timing: what time do buses usually pass this exact coordinate?`,
      config: {
        tools: [{ googleSearch: {} }],
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
                }
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

export async function searchBusesOnRoute(source: string, destination: string, userLocationName: string = "") {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `List ALL Tamil Nadu bus services (TNSTC, SETC, Private) between ${source} and ${destination}. 
      Include every possible rural bus that connects these points.
      For each bus, provide:
      - Departure time from ${source}
      - Arrival time at ${destination}
      - If they pass through ${userLocationName}, estimate what time they will be there.
      - Frequency and total trips.
      Use real timing data found via search.`,
      config: {
        tools: [{ googleSearch: {} }],
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
                  departureTime: { type: Type.STRING },
                  arrivalTime: { type: Type.STRING },
                  timeAtUserLocation: { type: Type.STRING },
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
      contents: `Search for the ACTUAL current or standard timing board for ${standName} Bus Stand in Tamil Nadu. 
      List 15 upcoming or major departures covering all directions (State, Town, and Village routes).
      Include Platform number if known. Use real names and bus numbers.`,
      config: {
        tools: [{ googleSearch: {} }],
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
