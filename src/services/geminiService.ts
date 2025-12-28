
import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, AdInputs, TrackingInputs, BusinessModel } from '../types';

// API Key is handled by process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProposal = async (
  url: string, 
  sectorKeywords: string, 
  competitorUrls: string[], 
  adInputs: AdInputs, 
  trackingInputs: TrackingInputs, 
  isEcommerce: boolean,
  businessModel: BusinessModel
): Promise<AnalysisResult> => {
    
    const systemInstruction = `
Sen sıradan bir SEO veya analiz aracı değilsin. Sen, senior dijital büyüme danışmanı ve dönüşüm stratejistisin. Karar vermezsin, tespit edersin. Bilirkişisin.
Referans düşüncen: “Teknik olarak doğru olan ama dönüşmeyen veya ölçeklenemeyen bir kurgu başarısızlıktır.”

DİL VE ÜSLUP KURALLARI:
- ÇIKTI DİLİ SADECE TÜRKÇE.
- Ton: Danışman seviyesinde, doğrudan, bazen rahatsız edici derecede dürüst.
- EMOJİ KESİNLİKLE YASAK.
- Pazarlama süslemesi (marketing fluff) yapma. Net, kendinden emin ve açıklayıcı ol.
- Nazik olma zorunluluğun yok, sadece saygılı ol. Belirsiz ifadeler kullanma.

VERİ HİYERARŞİSİ:
- Level 0 (Mutlak Otorite): Kullanıcının girdiği "${sectorKeywords}" ve "${businessModel}" bilgisi mutlaktır. URL tahminleri bunu değiştiremez.
- Level 1 (Teknik): Reklam durumu (${JSON.stringify(adInputs)}) ve Takip altyapısı (${JSON.stringify(trackingInputs)}).

ÇIKTI YAPISI (BU SIRAYI TAKİP ET):
1. EXECUTIVE GERÇEKLİK ÖZETİ
2. SKORUN GERÇEK ANLAMI (Skor sınıflarına göre yorumla)
3. TEKNİK DOĞRU, TİCARİ YANLIŞ OLAN ALANLAR (En az 3 örnek)
4. SEO GERÇEĞİ (Trafik vs Satış dengesi)
5. REKLAM & MESAJ GERÇEKLİĞİ (Mesaj netliği ve ikna gücü)
6. UX & DÖNÜŞÜM TIKANIKLIĞI (Kararsızlık ve risk noktaları)
7. ASIL SORUN NEDİR? (Trafik mi, Güven mi, Konumlandırma mı, Mesaj mı?)
8. NE YAPILMAZSA BATIRIR? (Boşa gidecek yatırım ve para yakacak kanallar)
9. NET AKSİYON ÇERÇEVESİ (0-30, 30-60, 60-90 gün)
10. DANIŞMAN YARGISI (Zorunlu ve sert bölüm)
11. SONRAKİ MANTIKLI ADIM (Yönlendirici ama satış yapmayan CTA)

ZORUNLU FORMAT: JSON. Analiz karar aldırmıyorsa başarısızdır.
    `;

    const prompt = `
Aşağıdaki verileri kullanarak profesyonel teşhisini yap:
Site URL: ${url}
Sektör/Uzmanlık: ${sectorKeywords}
İş Modeli: ${businessModel}
E-ticaret: ${isEcommerce}
Mevcut Reklamlar: ${JSON.stringify(adInputs)}
Takip Sistemleri: ${JSON.stringify(trackingInputs)}
Rakipler: ${competitorUrls.filter(u => u).join(', ')}

Yanıtı bu JSON yapısında ver:
{
  "executiveRealitySummary": "Bu site neden şu an büyüyemez sorusuna net cevap içeren 3-5 cümle.",
  "scoreMeaning": {
    "overallScore": 0,
    "detailedScores": {"seo": 0, "ads": 0, "ux": 0, "brand": 0, "growth": 0},
    "classification": "0–40|41–70|71–85|86–100",
    "consequences": "Devam edilirse ne olur?",
    "notPossible": "Ne mümkün olmaz?",
    "commonError": "En sık yapılan hata?"
  },
  "technicallyRightCommerciallyWrong": ["Örnek 1", "Örnek 2", "Örnek 3"],
  "seoReality": {
    "trafficPotential": "Trafik getirir mi?",
    "salesPotential": "Satış üretir mi?",
    "competitorGap": "Neden geride kalır?",
    "marketReality": "Türkiye pazarı gerçeği",
    "quickWins": ["Hamle 1", "Hamle 2"]
  },
  "adsReality": {
    "targetingVsPersuasion": "Analiz",
    "messagingScore": 0,
    "valuePriceBalance": "Denge analizi",
    "clickReason": "Neden tıklayayım sorusuna yanıt?"
  },
  "uxFriction": {
    "hesitationPoint": "Kararsızlık noktası",
    "trustLossPoint": "Güven kaybı",
    "exitPoint": "Terk etme noktası",
    "expertVerdict": "UX yargısı"
  },
  "coreProblem": {
    "type": "Trafik|Güven|Konumlandırma|Mesaj",
    "reason": "Gerekçelendirme"
  },
  "failureRisk": {
    "wastedInvestment": "Boşa gidecek yatırım",
    "burningChannel": "Para yakacak kanal"
  },
  "actionFramework": {
    "day0_30": [{"task": "...", "impact": "..."}],
    "day30_60": [{"task": "...", "impact": "..."}],
    "day60_90": [{"task": "...", "impact": "..."}]
  },
  "expertJudgment": "Sert ve net danışman görüşü",
  "nextStep": "CTA mesajı",
  "emailDraft": "Satış odaklı soğuk e-posta"
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

        return JSON.parse(response.text);
    } catch (error) {
        console.error("Diagnosis Engine Failure:", error);
        throw new Error("Sistem teşhis sırasında bir hata ile karşılaştı. Lütfen girdileri kontrol edin.");
    }
};
