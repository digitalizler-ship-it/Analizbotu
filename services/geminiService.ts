
import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, AdInputs, TrackingInputs, BusinessModel } from '../types';

/**
 * STRATEJİK NOT: 
 * API anahtarı hiçbir zaman buraya yazılmaz. 
 * Vercel'deki Environment Variables kısmında ismi 'API_KEY' olmalıdır.
 */
export const generateProposal = async (
  url: string, 
  sectorKeywords: string, 
  competitorUrls: string[], 
  adInputs: AdInputs, 
  trackingInputs: TrackingInputs, 
  isEcommerce: boolean,
  businessModel: BusinessModel
): Promise<AnalysisResult> => {
    
    // Güvenlik ve güncellik için instance her çağrıda oluşturulur
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const systemInstruction = `
Sen senior dijital büyüme danışmanı ve dönüşüm stratejistisin. 
DİL: Sadece Türkçe.
TON: Profesyonel, doğrudan ve sert.
GÖREV: Web sitesi verilerini analiz edip ticari bir teşhis koymak.
JSON yanıtı dışında hiçbir şey yazma.
    `;

    const prompt = `
Aşağıdaki verilere göre 11 maddelik profesyonel teşhisini yap:
URL: ${url}
Sektör: ${sectorKeywords}
İş Modeli: ${businessModel}
Reklamlar: ${JSON.stringify(adInputs)}
Takip: ${JSON.stringify(trackingInputs)}

JSON formatında şu alanları doldur: executiveRealitySummary, scoreMeaning, technicallyRightCommerciallyWrong, seoReality, adsReality, uxFriction, coreProblem, failureRisk, actionFramework, expertJudgment, nextStep, emailDraft.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                tools: [{ googleSearch: {} }],
                responseMimeType: "application/json",
            },
        });

        if (!response.text) {
            throw new Error("Modelden boş yanıt döndü.");
        }

        return JSON.parse(response.text);
    } catch (error: any) {
        console.error("Analysis Engine Failure:", error);
        
        if (error.message?.includes("403")) {
          throw new Error("API Anahtarı Hatası: Vercel panelinde 'API_KEY' isminde bir değişken olduğundan ve anahtarın doğruluğundan emin olun.");
        }
        
        throw new Error("Analiz motoru şu an yanıt veremiyor. Lütfen biraz sonra tekrar deneyin.");
    }
};
