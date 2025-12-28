
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
    
    // Uygulama Vercel üzerinde process.env.API_KEY üzerinden anahtarı otomatik alır.
    const apiKey = process.env.API_KEY;
    
    if (!apiKey) {
        throw new Error("Sistem şu an bakımda. Lütfen daha sonra tekrar deneyin.");
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `
Sen "Ertunç Koruç" kimliğinde, "Dijital İzler" ajansının kurucusu ve senior bir büyüme danışmanısın.
Dönüşüm (CRO), SEO ve Ücretli Reklam (Ads) konularında en sert ve en dürüst teşhisleri koyarsın.

DİL: Türkçe.
TON: Sert, doğrudan, ticari odaklı, 'gerçekleri yüzüne çarpan' bir tarz.

GÖREV:
1. Verilen URL'i ve rakipleri Google Search kullanarak analiz et.
2. Sitenin SEO görünürlüğünü, Meta (FB/IG) ve Google reklam stratejilerini (aktif reklam çıkıp çıkmadığını, mesaj kalitesini) değerlendir.
3. Teknik hatalardan ziyade, bu hataların iş sahibine mal olduğu "para kaybını" vurgula.
4. Yanıtını MUTLAK SURETLE sadece JSON formatında ver.
    `;

    const prompt = `
ANALİZ PARAMETRELERİ:
Web Sitesi: ${url}
Sektör/Odak: ${sectorKeywords}
İş Modeli: ${businessModel}
E-ticaret: ${isEcommerce ? 'Evet' : 'Hayır'}
Rakipler: ${competitorUrls.filter(u => u).join(', ')}
Manuel Reklam Bilgisi: ${JSON.stringify(adInputs)}
Teknik Takip: ${JSON.stringify(trackingInputs)}

Aşağıdaki JSON formatında teşhis koy:
{
  "executiveRealitySummary": "Sitenin şu anki durumunu özetleyen sert bir cümle.",
  "scoreMeaning": {
    "overallScore": 0,
    "detailedScores": {"seo": 0, "ads": 0, "ux": 0, "brand": 0, "growth": 0},
    "classification": "0–40",
    "consequences": "Böyle devam edilirse ne olur?",
    "notPossible": "Bu yapıyla neyi başaramazlar?",
    "commonError": "Sektördeki en büyük yanılgıları."
  },
  "technicallyRightCommerciallyWrong": ["Teknik olarak yapılmış ama para kazandırmayan 3 madde"],
  "seoReality": {
    "trafficPotential": "Trafik durumu",
    "salesPotential": "Satışa dönüşme potansiyeli",
    "competitorGap": "Rakiplerle arasındaki uçurum",
    "marketReality": "Pazarın gerçeği",
    "quickWins": ["Hızlıca düzeltilmesi gerekenler"]
  },
  "adsReality": {
    "targetingVsPersuasion": "Hedefleme mi sorunlu yoksa ikna mı?",
    "messagingScore": 0,
    "valuePriceBalance": "Fiyat/Değer algısı",
    "clickReason": "Müşteri neden tıklasın?"
  },
  "uxFriction": {
    "hesitationPoint": "Kullanıcı nerede duraksıyor?",
    "trustLossPoint": "Güven nerede kırılıyor?",
    "exitPoint": "Nereden kaçıyorlar?",
    "expertVerdict": "UX hakkında son karar"
  },
  "coreProblem": {"type": "Trafik", "reason": "Asıl tıkanıklık noktası"},
  "failureRisk": {"wastedInvestment": "Boşa giden bütçe tahmini", "burningChannel": "En verimsiz kanal"},
  "actionFramework": {
    "day0_30": [{"task": "Görev", "impact": "Etki"}],
    "day30_60": [{"task": "Görev", "impact": "Etki"}],
    "day60_90": [{"task": "Görev", "impact": "Etki"}]
  },
  "expertJudgment": "Danışmanın nihai acımasız yorumu.",
  "nextStep": "Hemen atılması gereken adım.",
  "emailDraft": "İş sahibine gönderilecek profesyonel ama sert uyarı maili."
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
        if (!text) throw new Error("Analiz motoru boş yanıt döndü.");
        
        return JSON.parse(text);
    } catch (error: any) {
        console.error("Gemini Service Error:", error);
        throw new Error("Analiz motoru şu an çok yoğun. Lütfen 30 saniye sonra tekrar deneyin.");
    }
};
