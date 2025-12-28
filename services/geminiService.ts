
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, AdInputs, AdPlatformInput } from '../types';

// IMPORTANT: If you are getting a PERMISSION_DENIED error,
// you must generate a new API key from Google AI Studio and paste it here.
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
            description: "Analiz edilen sitenin neyle ilgili olduğunu, ana amacını ve hedef kitlesini özetleyen 1-2 cümlelik kısa bir giriş metni. Bu özet KESİNLİKLE kullanıcı tarafından sağlanan 'sektör/anahtar kelime' bilgisine dayanmalıdır.",
        },
        seoAnalysis: {
            type: Type.OBJECT,
            properties: {
                overallScore: { type: Type.NUMBER, description: "Denetim puanlarının ağırlıklı ortalaması, 0-100 arası bir genel puan." },
                summary: { type: Type.STRING, description: "SEO durumunun genel bir özeti." },
                audits: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            category: { type: Type.STRING },
                            score: { type: Type.NUMBER },
                            passedChecks: { type: Type.ARRAY, items: { type: Type.STRING } },
                            failedChecks: { type: Type.ARRAY, items: { type: Type.STRING } },
                        }
                    }
                },
                expertSuggestion: { type: Type.STRING, description: "Protokol dışında kalan ancak kritik öneme sahip ek bir uzman önerisi." },
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


export const generateProposal = async (url: string, sectorKeywords: string, competitorUrls: string[], adInputs: AdInputs, isEcommerce: boolean): Promise<AnalysisResult> => {
    const competitorPrompt = generateCompetitorPrompt(competitorUrls);
    const adInputSummary = formatAdInputsForPrompt(adInputs);
    const ecommerceInfoPrompt = isEcommerce
        ? "Kullanıcı bu sitenin bir e-ticaret sitesi olduğunu belirtti. Bu bilgiyi dikkate alarak 'E-ticaret Strateji Danışmanlığı' hizmetini teklife dahil et ve açıklamasını e-ticarete özgü (dönüşüm optimizasyonu, ürün SEO'su vb.) detaylarla zenginleştir."
        : "Kullanıcı bu sitenin bir e-ticaret sitesi olmadığını belirtti. 'E-ticaret Strateji Danışmanlığı' hizmetini teklife dahil ETME.";
    
    const siteContextPrompt = sectorKeywords
        ? `Kullanıcı, sitenin bağlamını şu şekilde belirtti: "${sectorKeywords}". Tüm analizini, özellikle de site özetini bu bilgiye dayanarak yap. URL'yi ikincil bir referans olarak kullan.`
        : `Kullanıcı site hakkında ek bilgi vermedi. Analizini yalnızca "${url}" URL'sinden yola çıkarak yapmaya çalış.`;


    const prompt = `
Bir dijital pazarlama ve SEO denetçisi olarak hareket et. Sağlanan web sitesini ve kullanıcı tarafından girilen ek bilgileri analiz et. Aşağıdaki JSON yapısına ve "Web Projesi Mükemmeliyet Protokolü" kurallarına tam olarak uyarak bir rapor ve hizmet teklifi oluştur. Tüm metinler profesyonel bir dille Türkçe olmalıdır.

**Temel Analiz Bilgileri:**
*   **Site URL'si:** "${url}"
*   **Kullanıcı Tarafından Sağlanan Site Bağlamı:** ${siteContextPrompt}
*   **Site Türü Bilgisi**: ${ecommerceInfoPrompt}

**Analiz Adımları:**

1.  **Site Özeti ('siteSummary'):** Analize başlamadan önce, siteyi anladığını göstermek için, kullanıcı tarafından sağlanan bağlam bilgisine dayanarak sitenin neyle ilgili olduğunu, ana amacını ve hedef kitlesini özetleyen 1-2 cümlelik bir metin oluştur.

2.  **SEO Denetimi ('seoAnalysis'):** Aşağıdaki "Web Projesi Mükemmeliyet Protokolü"nü kullanarak site için kapsamlı bir SEO denetimi yap.
    *   Her bir ana kategori (Teknik, SEO Mimarisi, İçerik, Mobil UX, CRO) için 0-10 arasında bir puan ver.
    *   Her kategori için, hangi kuralların başarıyla geçtiğini ('passedChecks') ve hangilerinin başarısız olduğunu ('failedChecks') listele.
    *   Tüm kategori puanlarının ağırlıklı ortalamasını alarak 0-100 arasında bir 'overallScore' hesapla.
    *   SEO durumunu özetleyen kısa bir 'summary' yaz.
    *   Protokolün kapsamı dışında kalan ancak kritik gördüğün bir noktayı 'expertSuggestion' olarak ekle.

    **Web Projesi Mükemmeliyet Protokolü:**
    *   **1. Teknik Altyapı ve Performans (Ağırlık: x3):** TTFB < 200ms, Cache TTL ≥ 1 yıl, CDN kullanımı, Kritik CSS inline, JS defer, Render-blocking JS olmamalı, Minify + GZIP/Brotli, Mobil için AMP/hafif HTML.
    *   **2. SEO Mimarisi ve URL (Ağırlık: x3):** URL'ler maks. 5 kelime, küçük harf, Türkçe karakter/stop-words yok. Her sayfada canonical, çok dilli sitelerde hreflang, Breadcrumb + Schema.
    *   **3. İçerik Otoritesi & E-E-A-T (Ağırlık: x2):** Blog ≥ 800, Pillar ≥ 2000, Ürün ≥ 300 kelime. Yazar bilgisi + Author Schema. TDK uyumu, Alt text kullanımı, İçerik güncelliği + dateModified Schema.
    *   **4. Mobil UX & Erişilebilirlik (Ağırlık: x2):** WCAG 2.1 AA (Kontrast ≥ 4.5:1), Otomatik Dark Mode, Sticky elemanlar ekranın %15'ini geçemez ve kapatılabilir olmalı.
    *   **5. CRO & Güven Öğeleri (Ağırlık: x3):** CTA'da "Tıkla" yasak, Eylem odaklı fiiller kullanılmalı. Formlar maks. 4 alan. SSL zorunlu, Güven rozetleri. KVKK/GDPR barı. Sosyal Kanıt (logo, puanlama, referans) zorunlu.

3.  **Reklam Analizi ('adAnalysis'):** Aşağıda, kullanıcı tarafından girilen, sitenin mevcut reklam durumu hakkında bilgiler yer almaktadır:
    ${adInputSummary}
    Bu bilgilere dayanarak stratejik bir analiz yap. Eğer reklam çıkılıyorsa ve kalite 'zayıf' veya 'orta' ise, iyileştirme fırsatlarını vurgula. Eğer reklam çıkılmıyorsa, bu platformlarda reklam vermenin getireceği fırsatları anlat.

4.  **Rakip Analizi ('competitorAnalysis'):** ${competitorPrompt}

5.  **Hizmet Teklifi ('serviceProposal'):** Yaptığın tüm analiz sonuçlarına dayanarak, sitenin ihtiyaçlarına en uygun hizmetleri içeren profesyonel bir hizmet teklifi hazırla. Teklif, bir giriş, önerilen hizmetlerin açıklamaları ve bir sonuç bölümünden oluşmalıdır.

Lütfen yanıtını SADECE istenen JSON formatında, başka hiçbir metin, açıklama veya markdown formatı (\`\`\`json) olmadan doğrudan ver.
`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
                temperature: 0.4,
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
