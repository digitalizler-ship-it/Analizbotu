
import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, AdInputs, TrackingInputs, BusinessModel } from '../types';

export const generateProposal = async (
  url: string, 
  sectorKeywords: string, 
  competitorUrls: string[], 
  adInputs: AdInputs, 
  trackingInputs: TrackingInputs, 
  isEcommerce: boolean,
  businessModel: BusinessModel
): Promise<AnalysisResult> => {
    
    // API anahtarı sistem tarafından (Vercel vb.) otomatik olarak enjekte edilir.
    // Herhangi bir manuel girdi veya .env dosyası gerektirmez.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const systemInstruction = `
Sen "Ertunç Koruç" kimliğinde, "Dijital İzler" ajansının kurucusu ve senior bir büyüme danışmanısın.
Pazarlama stratejileri konusunda dürüst ve doğrudan analizler yaparsın.

DİL: Türkçe.
TON: Profesyonel, sert, çözüm odaklı.

GÖREV:
1. Verilen URL'i Google Search kullanarak analiz et.
2. SEO, Reklam (Meta, Google) ve UX durumunu değerlendir.
3. Çıktıyı MUTLAK SURETLE JSON formatında ver.
    `;

    const prompt = `
STRATEJİK VERİLER:
Site: ${url}
Sektör: ${sectorKeywords}
İş Modeli: ${businessModel}
E-ticaret: ${isEcommerce ? 'Evet' : 'Hayır'}
Rakipler: ${competitorUrls.filter(u => u).join(', ')}
Reklam Durumu: ${JSON.stringify(adInputs)}
Takip Altyapısı: ${JSON.stringify(trackingInputs)}

Aşağıdaki JSON formatında teşhis koy:
{
  "executiveRealitySummary": "...",
  "scoreMeaning": {
    "overallScore": 0,
    "detailedScores": {"seo": 0, "ads": 0, "ux": 0, "brand": 0, "growth": 0},
    "classification": "0–40",
    "consequences": "...",
    "notPossible": "...",
    "commonError": "..."
  },
  "technicallyRightCommerciallyWrong": ["..."],
  "seoReality": {
    "trafficPotential": "...",
    "salesPotential": "...",
    "competitorGap": "...",
    "marketReality": "...",
    "quickWins": ["..."]
  },
  "adsReality": {
    "targetingVsPersuasion": "...",
    "messagingScore": 0,
    "valuePriceBalance": "...",
    "clickReason": "..."
  },
  "uxFriction": {
    "hesitationPoint": "...",
    "trustLossPoint": "...",
    "exitPoint": "...",
    "expertVerdict": "..."
  },
  "coreProblem": {"type": "Trafik", "reason": "..."},
  "failureRisk": {"wastedInvestment": "...", "burningChannel": "..."},
  "actionFramework": {
    "day0_30": [{"task": "...", "impact": "..."}],
    "day30_60": [{"task": "...", "impact": "..."}],
    "day60_90": [{"task": "...", "impact": "..."}]
  },
  "expertJudgment": "...",
  "nextStep": "...",
  "emailDraft": "..."
}
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                tools: [{ googleSearch: {} }],
                responseMimeType: "application/json",
            },
        });

        if (!response.text) {
            throw new Error("Boş yanıt.");
        }

        return JSON.parse(response.text);
    } catch (error: any) {
        console.error("Diagnosis Engine Error:", error);
        throw new Error("Analiz motoru şu an çok yoğun. Lütfen birkaç saniye sonra tekrar deneyin.");
    }
};
