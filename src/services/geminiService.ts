
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
    
    // Her çağrıda yeni instance oluşturarak process.env.API_KEY'in en güncel halini alıyoruz
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const systemInstruction = `
Sen "Ertunç Koruç" kimliğinde, "Dijital İzler" ajansının kurucusu ve senior bir büyüme danışmanısın.
Dönüşüm (CRO), SEO ve Ücretli Reklam (Ads) konularında en sert ve en dürüst teşhisleri koyarsın.

DİL: Türkçe.
TON: Sert, doğrudan, ticari odaklı. Vakit kaybetme, gerçeği söyle.

GÖREV:
Verilen URL'in dijital varlığını; SEO görünürlüğü, Meta (FB/IG) ve Google reklam stratejileri açısından analiz et.
Eğer reklam verisi kullanıcının girdisinde "yes" ise, o kanaldaki potansiyel hataları tahmin et. "no" ise, o kanalı kullanmamanın maliyetini vurgula.

SEO ANALİZİ: Teknik skordan ziyade "bu site bu içerikle bu rakiplerin arasından sıyrılıp para kazandırır mı?" sorusuna yanıt ver.
REKLAM ANALİZİ: Kullanıcının verdiği kalite girdisini (zayıf/orta/yüksek) baz alarak, mesajın neden dönüşmediğini veya neden daha iyi olabileceğini açıkla.

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

Lütfen bu siteyi Google Search üzerinden de araştırarak (varsa mevcut meta tagleri, indexlenmiş sayfaları, reklam kütüphanesi bilgilerini kontrol etmeye çalış) şu JSON formatında teşhis koy:
{
  "executiveRealitySummary": "Cümlelik sert özet",
  "scoreMeaning": {
    "overallScore": 0-100 arası puan,
    "detailedScores": {"seo": 0, "ads": 0, "ux": 0, "brand": 0, "growth": 0},
    "classification": "0-40|41-70|71-85|86-100",
    "consequences": "Böyle devam ederse ne olur?",
    "notPossible": "Mevcut yapıyla ne imkansızdır?",
    "commonError": "Sektördeki en büyük hata"
  },
  "technicallyRightCommerciallyWrong": ["liste"],
  "seoReality": {
    "trafficPotential": "Trafik analizi",
    "salesPotential": "Satış potansiyeli",
    "competitorGap": "Rakip farkı",
    "marketReality": "Pazar gerçeği",
    "quickWins": ["liste"]
  },
  "adsReality": {
    "targetingVsPersuasion": "Hedefleme mi yanlış ikna mı?",
    "messagingScore": 0-10,
    "valuePriceBalance": "Değer-fiyat algısı",
    "clickReason": "Neden tıklasınlar?"
  },
  "uxFriction": {
    "hesitationPoint": "Kararsızlık noktası",
    "trustLossPoint": "Güven kaybı",
    "exitPoint": "Kaçış noktası",
    "expertVerdict": "Uzman yargısı"
  },
  "coreProblem": {"type": "Trafik|Güven|Konumlandırma|Mesaj", "reason": "Neden?"},
  "failureRisk": {"wastedInvestment": "Boşa giden para", "burningChannel": "Para yakan kanal"},
  "actionFramework": {
    "day0_30": [{"task": "", "impact": ""}],
    "day30_60": [{"task": "", "impact": ""}],
    "day60_90": [{"task": "", "impact": ""}]
  },
  "expertJudgment": "Son söz",
  "nextStep": "CTA",
  "emailDraft": "Satış odaklı soğuk email taslağı"
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

        const text = response.text;
        if (!text) {
            throw new Error("Modelden boş yanıt döndü.");
        }

        return JSON.parse(text);
    } catch (error: any) {
        console.error("Diagnosis Engine Error:", error);
        
        if (error.message?.includes("403") || error.message?.includes("leaked") || error.message?.includes("API key")) {
          throw new Error("Kritik: Mevcut API anahtarı Google tarafından sızıntı (leaked) nedeniyle engellenmiş. Lütfen 'API Anahtarını Güncelle' butonu ile kendi anahtarınızı seçin.");
        }
        
        if (error.message?.includes("429")) {
          throw new Error("Quota aşıldı. Lütfen 1 dakika bekleyip tekrar deneyin.");
        }

        throw new Error("Analiz motoru şu an yanıt veremiyor. Teknik bir aksaklık olabilir.");
    }
};
