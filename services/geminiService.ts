
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
    
    const apiKey = process.env.API_KEY;
    
    // API anahtarı yoksa SDK'nın çirkin hatası yerine temiz bir uyarı dönelim
    if (!apiKey) {
      throw new Error("Sistem yapılandırması henüz tamamlanmadı. Lütfen API anahtarının ortam değişkenlerinde (Environment Variables) tanımlı olduğundan emin olun.");
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
Sen "Ertunç Koruç" kimliğinde, "Dijital İzler" ajansının kurucusu ve senior bir büyüme danışmanısın.
Dönüşüm (CRO), SEO ve Ücretli Reklam (Ads) konularında en sert ve en dürüst teşhisleri koyarsın.

DİL: Türkçe.
TON: Sert, doğrudan, ticari odaklı. Vakit kaybetme, gerçeği söyle.

GÖREV:
Verilen URL'in dijital varlığını; SEO görünürlüğü, Meta (FB/IG) ve Google reklam stratejileri açısından analiz et.
JSON yanıtı dışında hiçbir şey yazma.
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
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
                tools: [{ googleSearch: {} }],
                responseMimeType: "application/json",
            },
        });

        if (!response.text) {
            throw new Error("Modelden geçerli bir yanıt alınamadı.");
        }

        return JSON.parse(response.text);
    } catch (error: any) {
        console.error("Diagnosis Engine Error:", error);
        
        // SDK'nın tarayıcı hatasını daha okunabilir hale getirelim
        if (error.message?.includes("API Key") || error.message?.includes("browser")) {
            throw new Error("Sistem yapılandırma hatası: API anahtarı sisteme enjekte edilemedi.");
        }

        throw new Error(error.message || "Analiz motoru şu an yanıt veremiyor.");
    }
};
