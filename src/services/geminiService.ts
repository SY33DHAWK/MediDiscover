import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface MedicineDetails {
  medicineName: string;
  genericName: string;
  drugClass: string;
  prescriptionType: "OTC" | "Prescription" | "Varies";
  manufacturers: string[];
  suitableFor: {
    adults: boolean;
    children: boolean;
    elderly: boolean;
    pregnantWomen: "Safe" | "Caution" | "Avoid" | "Consult Doctor";
    specialConditions: string[];
  };
  conditionsTreated: string[];
  dosage: {
    adult: string;
    child: string;
    frequency: string;
    maxDailyDose: string;
  };
  whenToTake: string[];
  sideEffects: {
    common: string[];
    serious: string[];
  };
  drugInteractions: string[];
  warnings: string[];
  brands: {
    brandName: string;
    country: string;
    manufacturer: string;
  }[];
  doctorRecommendation: {
    condition: string;
    doctorType: string;
  }[];
}

export interface SearchResult {
  name: string;
  type: "Generic" | "Brand";
  description: string;
}

export async function searchMedicines(query: string): Promise<SearchResult[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Search for medicines, brands, or symptoms related to: "${query}". Return a list of relevant medicines.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Name of the medicine or brand" },
            type: { type: Type.STRING, description: "Either 'Generic' or 'Brand'" },
            description: { type: Type.STRING, description: "Brief description of what it is and what it treats" }
          },
          required: ["name", "type", "description"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse search results", e);
    return [];
  }
}

export async function getMedicineDetails(medicineName: string): Promise<MedicineDetails | null> {
  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: `Provide detailed medical information for the medicine or brand: "${medicineName}". Include generic name, drug class, prescription type, manufacturers, suitability, conditions treated, dosage, when to take, side effects, interactions, warnings, popular brands globally, and doctor recommendations for the conditions it treats.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          medicineName: { type: Type.STRING },
          genericName: { type: Type.STRING },
          drugClass: { type: Type.STRING },
          prescriptionType: { type: Type.STRING, enum: ["OTC", "Prescription", "Varies"] },
          manufacturers: { type: Type.ARRAY, items: { type: Type.STRING } },
          suitableFor: {
            type: Type.OBJECT,
            properties: {
              adults: { type: Type.BOOLEAN },
              children: { type: Type.BOOLEAN },
              elderly: { type: Type.BOOLEAN },
              pregnantWomen: { type: Type.STRING, enum: ["Safe", "Caution", "Avoid", "Consult Doctor"] },
              specialConditions: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["adults", "children", "elderly", "pregnantWomen", "specialConditions"]
          },
          conditionsTreated: { type: Type.ARRAY, items: { type: Type.STRING } },
          dosage: {
            type: Type.OBJECT,
            properties: {
              adult: { type: Type.STRING },
              child: { type: Type.STRING },
              frequency: { type: Type.STRING },
              maxDailyDose: { type: Type.STRING }
            },
            required: ["adult", "child", "frequency", "maxDailyDose"]
          },
          whenToTake: { type: Type.ARRAY, items: { type: Type.STRING } },
          sideEffects: {
            type: Type.OBJECT,
            properties: {
              common: { type: Type.ARRAY, items: { type: Type.STRING } },
              serious: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["common", "serious"]
          },
          drugInteractions: { type: Type.ARRAY, items: { type: Type.STRING } },
          warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
          brands: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                brandName: { type: Type.STRING },
                country: { type: Type.STRING },
                manufacturer: { type: Type.STRING }
              },
              required: ["brandName", "country", "manufacturer"]
            }
          },
          doctorRecommendation: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                condition: { type: Type.STRING },
                doctorType: { type: Type.STRING }
              },
              required: ["condition", "doctorType"]
            }
          }
        },
        required: [
          "medicineName", "genericName", "drugClass", "prescriptionType", "manufacturers",
          "suitableFor", "conditionsTreated", "dosage", "whenToTake", "sideEffects",
          "drugInteractions", "warnings", "brands", "doctorRecommendation"
        ]
      }
    }
  });

  try {
    return JSON.parse(response.text || "null");
  } catch (e) {
    console.error("Failed to parse medicine details", e);
    return null;
  }
}

export async function compareMedicines(med1: string, med2: string): Promise<any> {
    const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `Compare the medicines "${med1}" and "${med2}". Provide a structured comparison including their primary uses, mechanism of action, side effect profile comparison, and which one is generally preferred for what.`,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    medicine1: { type: Type.STRING },
                    medicine2: { type: Type.STRING },
                    comparisonPoints: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                feature: { type: Type.STRING },
                                med1Value: { type: Type.STRING },
                                med2Value: { type: Type.STRING }
                            },
                            required: ["feature", "med1Value", "med2Value"]
                        }
                    },
                    summary: { type: Type.STRING }
                },
                required: ["medicine1", "medicine2", "comparisonPoints", "summary"]
            }
        }
    });

    try {
        return JSON.parse(response.text || "null");
    } catch (e) {
        console.error("Failed to parse comparison", e);
        return null;
    }
}
