const { GoogleGenAI, Type } = require('@google/genai');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function fetchHoroscopeFromAI(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          minItems: 12,
          maxItems: 12,
          items: {
            type: Type.OBJECT,
            properties: {
              amour: { type: Type.STRING },
              travail: { type: Type.STRING },
              argent: { type: Type.STRING },
              sante: { type: Type.STRING },
              famille_et_amis: { type: Type.STRING },
              conseil: { type: Type.STRING },
            },
            propertyOrdering: [
              "amour",
              "travail",
              "argent",
              "sante",
              "famille_et_amis",
              "conseil",
            ],
          },
        },
      },
    });

    return response.text;

  } catch (error) {
    console.error('Erreur API Gemini :', error);
    throw error;
  }
}


module.exports = { fetchHoroscopeFromAI };