
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
    
    // SDK kurallarına göre doğrudan enjekte edilen anahtarı kullanıyoruz
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const systemInstruction = `
Sen "Ertunç Koruç" kimliğinde, "Dijital İzler" ajansının kurucusu ve senior bir büyüme danışmanısın.
Dönüşüm (CRO), SEO ve Ücretli Reklam (Ads) konularında en sert ve en dürüst teşhisleri koyarsın.

DİL: Türkçe.
TON: Sert, doğrudan, ticari odaklı. Vakit kaybetme, gerçeği söyle.

GÖREV:
Verilen URL'in dijital varlığını; SEO görünürlüğü, Meta (FB/IG) ve Google reklam stratejileri açısından analiz et.
Google Search aracını kullanarak güncel verileri kontrol et.
Yanıtını MUTLAK SURETLE sadece JSON formatında ver.
    `;

    const prompt = `
STRATEJİK VERİLER:
Web Sitesi: ${url}
Sektör/Odak: ${sectorKeywords}
İş Modeli: ${businessModel}
E-ticaret: ${isEcommerce ? 'Evet' : 'Hayır'}
Reklam Kanalları Girdisi: ${JSON.stringify(adInputs)}
Teknik Takip Altyapısı: ${JSON.stringify(trackingInputs)}

Aşağıdaki JSON formatında teşhis koy:
{
  "executiveRealitySummary": "Cümlelik sert özet",
  "scoreMeaning": {
    "overallScore": 0,
    "detailedScores": {"seo": 0, "ads": 0, "ux": 0, "brand": 0, "growth": 0},
    "classification": "0-40|41-70|71-85|86-100",
    "consequences": "...",
    "notPossible": "...",
    "commonError": "..."
  },
  "technicallyRightCommerciallyWrong": ["liste"],
  "seoReality": {
    "trafficPotential": "...",
    "salesPotential": "...",
    "competitorGap": "...",
    "marketReality": "...",
    "quickWins": ["liste"]
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
  "coreProblem": {"type": "Trafik|Güven|Konumlandırma|Mesaj", "reason": "..."},
  "failureRisk": {"wastedInvestment": "...", "burningChannel": "..."},
  "actionFramework": {
    "day0_30": [{"task": "", "impact": ""}],
    "day30_60": [{"task": "", "impact": ""}],
    "day60_90": [{"task": "", "impact": ""}]
  },
  "expertJudgment": "...",
  "nextStep": "...",
  "emailDraft": "..."
}
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
            throw new Error("Analiz motorundan yanıt alınamadı.");
        }

        return JSON.parse(response.text);
    } catch (error: any) {
        console.error("Diagnosis Engine Error:", error);
        throw new Error(error.message || "Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.");
    }
};
