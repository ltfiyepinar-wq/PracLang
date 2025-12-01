import { GoogleGenAI, Type } from "@google/genai";
import { ChatMessage, UserProfile, AnalysisResult } from "../types";

// Initialize Gemini
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateConversationResponse = async (
  history: ChatMessage[],
  lastUserMessage: string,
  userProfile: UserProfile,
  scenarioTitle: string,
  languageName: string,
  tasks: string[]
): Promise<{ targetText: string; turkishText: string; isFinished: boolean; feedback: string | null }> => {
  
  const model = "gemini-2.5-flash";

  const systemInstruction = `
    Sen 'DilPratiği' uygulamasında ${languageName} öğreten bir yapay zeka öğretmenisin.
    Kullanıcı seviyesi: ${userProfile.level}.
    Senaryo: ${scenarioTitle}.
    Görevler: ${tasks.join(', ')}.
    
    Kullanıcı ile bir rol yapma (roleplay) konuşması yapıyorsun.
    Kısa, doğal ve konuşma diline uygun cevaplar ver.
    
    Her cevabında şu JSON formatını kullanmalısın:
    {
      "targetText": "${languageName} dilindeki cevabın",
      "turkishText": "Cevabının Türkçe çevirisi",
      "isFinished": false (eğer konuşma doğal bir sona ulaştıysa veya kullanıcı 3 görevi tamamladıysa true yap),
      "feedback": null (veya kullanıcı çok büyük bir hata yaptıysa kısa düzeltme)
    }
    
    Asla JSON dışında bir şey yazma.
  `;

  const chatHistory = history.map(h => ({
    role: h.role === 'model' ? 'model' : 'user',
    parts: [{ text: h.text }]
  }));

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: [
        ...chatHistory,
        { role: 'user', parts: [{ text: lastUserMessage }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            targetText: { type: Type.STRING },
            turkishText: { type: Type.STRING },
            isFinished: { type: Type.BOOLEAN },
            feedback: { type: Type.STRING, nullable: true }
          },
          required: ["targetText", "turkishText", "isFinished"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      targetText: "...",
      turkishText: "Bağlantı hatası.",
      isFinished: false,
      feedback: null
    };
  }
};

export const generateScenarioIntro = async (language: string, level: string, topic: string): Promise<string> => {
   try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Write a very short, 1 sentence greeting in ${language} to start a roleplay about ${topic} for a ${level} level student. Only the text.`,
    });
    return response.text || "Hello!";
   } catch (e) {
     return "Hello!";
   }
};

export const generateHint = async (
  history: ChatMessage[],
  scenarioTitle: string,
  languageName: string
): Promise<{ text: string; translation: string; pronunciation: string } | null> => {
  try {
    // Convert history for context
    const chatHistory = history.map(h => ({
      role: h.role === 'model' ? 'model' : 'user',
      parts: [{ text: h.text }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        ...chatHistory,
        { role: 'user', parts: [{ text: "I'm stuck. Give me a short, simple sentence I can say next in this roleplay. Provide the sentence, its Turkish translation, and a rough Turkish phonetic pronunciation." }] }
      ],
      config: {
        systemInstruction: `You are a helper. The user is stuck in a roleplay about '${scenarioTitle}'. 
        Provide ONE short, natural sentence in ${languageName} that the user could say to continue the conversation.
        Return ONLY JSON.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING, description: "The sentence in the target language" },
            translation: { type: Type.STRING, description: "Turkish translation" },
            pronunciation: { type: Type.STRING, description: "Turkish phonetic reading (e.g. 'Hav ar yu')" }
          },
          required: ["text", "translation", "pronunciation"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);

  } catch (error) {
    console.error("Hint Error:", error);
    return null;
  }
};

export const generateConversationAnalysis = async (
  history: ChatMessage[],
  scenarioTitle: string,
  languageName: string
): Promise<AnalysisResult> => {
  try {
    const chatHistory = history.map(h => ({
      role: h.role === 'model' ? 'model' : 'user',
      parts: [{ text: h.text }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        ...chatHistory,
        { role: 'user', parts: [{ text: "Evaluate my performance in this roleplay. Give me a score (0-100), overall feedback in Turkish, and list up to 3 grammar/vocabulary mistakes I made with corrections." }] }
      ],
      config: {
        systemInstruction: `You are a strict but encouraging language teacher evaluating a roleplay about '${scenarioTitle}' in ${languageName}.
        Analyze the USER'S messages.
        
        Return JSON with:
        - score: 0-100 (based on grammar, vocabulary, and relevance)
        - feedback: A short paragraph in Turkish summarizing the user's performance.
        - corrections: An array of up to 3 objects: { original: "user's wrong sentence", correction: "better version", reason: "short explanation in Turkish" }. If no major mistakes, provide better alternative phrasings.
        `,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            feedback: { type: Type.STRING },
            corrections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING },
                  correction: { type: Type.STRING },
                  reason: { type: Type.STRING }
                }
              }
            }
          },
          required: ["score", "feedback", "corrections"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No analysis generated");
    return JSON.parse(text);

  } catch (error) {
    console.error("Analysis Error:", error);
    return {
      score: 80,
      feedback: "Genel olarak iyiydin, ancak bağlantı sorunu nedeniyle detaylı analiz yapılamadı.",
      corrections: []
    };
  }
};
