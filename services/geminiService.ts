
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, AdInputs, AdPlatformInput } from '../types';

// ===================================================================================
// ÖNEMLİ UYARI:
// Eğer "PERMISSION_DENIED" (İzin Reddedildi) hatası alıyorsanız,
// bu API anahtarı geçersiz, süresi dolmuş veya yanlış olabilir.
// Lütfen Google AI Studio'dan yeni bir API anahtarı alın ve aşağıdaki
// 'API_KEY' değişkeninin değerini bu yeni anahtarla değiştirin.
// ===================================================================================
const API_KEY = "AIzaSyA3uQgxl9ZO50m4Gz2qrla-qxzp2ZIBFGA";

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    siteSummary: {
      type: Type.STRING,
      description: "Analiz edilen sitenin neyle ilgili olduğunu, ana amacını ve hedef kitlesini özetleyen 1-2 cümlelik kısa bir giriş metni.",
    },
    seoAnalysis: {
      type: Type.OBJECT,
      properties: {
        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
        weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
        suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
    },
    adAnalysis: {
      type: Type.OBJECT,
      properties: {
        strategicAnalysis: { 
            type: Type.STRING,
            description: "Kullanıcının girdiği reklam verilerine ve sitenin genel potansiyeline dayanarak Google, Meta, LinkedIn ve TikTok reklamları için stratejik bir analiz ve potansiyel değerlendirmesi."
        },
      },
    },
    competitorAnalysis: {
      type: Type.OBJECT,
      properties: {
        competitors: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              analysis: { type: Type.STRING },
            },
          },
        },
      },
    },
    serviceProposal: {
      type: Type.OBJECT,
      properties: {
        introduction: { type: Type.STRING },
        proposedServices: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              serviceName: { type: Type.STRING },
              description: { type: Type.STRING },
            },
          },
        },
        conclusion: { type: Type.STRING },
      },
    },
  },
};

const formatAdInputsForPrompt = (adInputs: AdInputs): string => {
    const platformNames: { [key: string]: string } = {
        meta: 'Meta (Facebook/Instagram)',
        google: 'Google Ads',
        linkedin: 'LinkedIn Ads',
        tiktok: 'TikTok Ads'
    };

    let adInfo = '';
    for (const key in adInputs) {
        const platform = adInputs[key as keyof AdInputs] as AdPlatformInput;
        if (platform.runsAds === 'yes') {
            adInfo += `\n- **${platformNames[key]}**: Reklam çıkıyor. Kullanıcı tarafından belirtilen reklam kalitesi: **${platform.quality || 'Belirtilmemiş'}**.`;
        } else if (platform.runsAds === 'no') {
            adInfo += `\n- **${platformNames[key]}**: Reklam çıkmıyor.`;
        }
    }
    return adInfo || 'Kullanıcı tarafından reklam bilgisi girilmedi.';
};

const generateCompetitorPrompt = (competitorUrls: string[]): string => {
    const validUrls = competitorUrls.filter(url => url && url.trim() !== '');
    if (validUrls.length === 0) {
        return 'Kullanıcı tarafından rakip bilgisi girilmedi. Bu bölümü atla ve `competitors` dizisini boş bırak.';
    }
    const urlList = validUrls.map(url => `"${url}"`).join(', ');
    return `Kullanıcı tarafından sağlanan şu rakip siteleri analiz et: ${urlList}. Her birinin dijital pazarlama stratejilerini (SEO, reklam, sosyal medya vb.) kısaca analiz et. Rakip ismi olarak web sitesi adresini kullan.`;
};


export const generateProposal = async (url: string, competitorUrls: string[], adInputs: AdInputs, isEcommerce: boolean): Promise<AnalysisResult> => {
  const competitorPrompt = generateCompetitorPrompt(competitorUrls);
  const adInputSummary = formatAdInputsForPrompt(adInputs);
  const ecommerceInfoPrompt = isEcommerce 
    ? "Kullanıcı bu sitenin bir e-ticaret sitesi olduğunu belirtti. Bu bilgiyi dikkate alarak 'E-ticaret Strateji Danışmanlığı' hizmetini teklife dahil et ve açıklamasını e-ticarete özgü (dönüşüm optimizasyonu, ürün SEO'su vb.) detaylarla zenginleştir."
    : "Kullanıcı bu sitenin bir e-ticaret sitesi olmadığını belirtti. 'E-ticaret Strateji Danışmanlığı' hizmetini teklife dahil ETME.";

  const prompt = `
Bir dijital pazarlama ve SEO uzmanı olarak hareket et. Sağlanan "${url}" web sitesini ve kullanıcı tarafından girilen ek bilgileri analiz et. Aşağıdaki JSON yapısına tam olarak uyarak bir rapor ve hizmet teklifi oluştur. Tüm metinler profesyonel bir dille Türkçe olmalıdır.

İlk olarak, siteyi anladığını göstermek için sitenin neyle ilgili olduğunu, ana amacını ve hedef kitlesini özetleyen 1-2 cümlelik bir 'siteSummary' metni oluştur.

Analiz Kriterleri:
1.  **Site Türü Bilgisi**: ${ecommerceInfoPrompt}
2.  **SEO Analizi**: Sitenin en az 3 güçlü ve 3 zayıf yönünü belirt. Bu analize dayanarak en az 3 somut iyileştirme önerisi sun. (Örn: Başlık etiketleri, mobil uyumluluk, site hızı, içerik kalitesi, backlink profili gibi konulara değin.)
3.  **Reklam Analizi**: Aşağıda, kullanıcı tarafından girilen, sitenin mevcut reklam durumu hakkında bilgiler yer almaktadır:
    ${adInputSummary}
    Bu bilgilere dayanarak stratejik bir analiz yap. Eğer reklam çıkılıyorsa ve kalite 'zayıf' veya 'orta' ise, iyileştirme fırsatlarını ve potansiyel yatırım getirisini (ROI) vurgula. Eğer reklam çıkılmıyorsa, bu platformlarda reklam vermenin getireceği fırsatları ve potansiyel hedef kitleye nasıl ulaşılabileceğini anlat. Bu analizi, hizmet teklifi bölümündeki "Google & Meta Reklam Yönetimi" önerisiyle ilişkilendir.
4.  **Rakip Analizi**: ${competitorPrompt}
5.  **Hizmet Teklifi**: Yaptığın tüm analiz sonuçlarına (Site Türü, SEO, Reklam, Rakip) dayanarak, "${url}" sitesinin ihtiyaçlarına en uygun hizmetleri içeren profesyonel bir hizmet teklifi hazırla. Teklif, bir giriş, önerilen hizmetlerin (en az 2, en fazla 4) açıklamaları ve bir sonuç bölümünden oluşmalıdır. Önerilebilecek hizmetler: "Kapsamlı SEO Danışmanlığı", "Google & Meta Reklam Yönetimi", "E-ticaret Strateji Danışmanlığı", "İçerik Pazarlaması ve Stratejisi", "Sosyal Medya Yönetimi". Reklam yönetimi teklifini, kullanıcının girdiği bilgilere göre özelleştir.

Lütfen yanıtını SADECE istenen JSON formatında, başka hiçbir metin, açıklama veya markdown formatı (\`\`\`json) olmadan doğrudan ver.
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.5,
      },
    });

    const jsonText = response.text.trim();
    const result: AnalysisResult = JSON.parse(jsonText);
    return result;

  } catch (error) {
    console.error("Gemini API call failed:", error);
    throw new Error("Failed to get a valid response from the AI model.");
  }
};
