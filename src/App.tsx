
import React, { useState, useCallback, useEffect } from 'react';
import { AnalysisResult as AnalysisResultType, AdInputs, TrackingInputs, BusinessModel } from './types';
import { generateProposal } from './services/geminiService';
import { AnalysisInput } from './components/AnalysisInput';
import { AnalysisResult } from './components/AnalysisResult';
import { LoadingSpinner } from './components/LoadingSpinner';
import { HowItWorks } from './components/HowItWorks';
import emailjs from '@emailjs/browser';

const DAILY_LIMIT = 3;

const initialAdInputs: AdInputs = {
  meta: { runsAds: '', quality: '' },
  google: { runsAds: '', quality: '' },
  linkedin: { runsAds: '', quality: '' },
  tiktok: { runsAds: '', quality: '' },
};

const initialTrackingInputs: TrackingInputs = {
    hasPixel: false,
    hasAnalytics: false,
    hasGTM: false
};

const App: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [competitorUrls, setCompetitorUrls] = useState<string[]>(['', '']);
  const [adInputs, setAdInputs] = useState<AdInputs>(initialAdInputs);
  const [trackingInputs, setTrackingInputs] = useState<TrackingInputs>(initialTrackingInputs);
  const [isEcommerce, setIsEcommerce] = useState<boolean>(false);
  const [businessModel, setBusinessModel] = useState<BusinessModel>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sectorKeywords, setSectorKeywords] = useState('');
  const [usageCount, setUsageCount] = useState(0);

  useEffect(() => {
    emailjs.init('RLLdwGUH72IV4l-Nj');
    
    // Check daily usage limit
    const today = new Date().toDateString();
    const storedData = localStorage.getItem('diagnosis_usage');
    if (storedData) {
      const { count, date } = JSON.parse(storedData);
      if (date === today) {
        setUsageCount(count);
      } else {
        localStorage.setItem('diagnosis_usage', JSON.stringify({ count: 0, date: today }));
      }
    } else {
      localStorage.setItem('diagnosis_usage', JSON.stringify({ count: 0, date: today }));
    }
  }, []);

  const updateUsage = () => {
    const today = new Date().toDateString();
    const newCount = usageCount + 1;
    setUsageCount(newCount);
    localStorage.setItem('diagnosis_usage', JSON.stringify({ count: newCount, date: today }));
  };

  const sendNotificationEmail = useCallback((result: AnalysisResultType) => {
    const serviceID = 'service_i28ay7n';
    const templateID = 'template_tbn9x6n';

    const templateParams = {
      analyzed_url: url,
      sector_keywords: sectorKeywords || 'Girilmedi',
      business_model: businessModel,
      is_ecommerce: isEcommerce ? 'Evet' : 'Hayır',
      analysis_result: JSON.stringify(result, null, 2),
    };

    emailjs.send(serviceID, templateID, templateParams).catch(console.error);
  }, [url, sectorKeywords, businessModel, isEcommerce]);

  const handleAnalysis = useCallback(async () => {
    if (usageCount >= DAILY_LIMIT) {
      setError(`Günlük ücretsiz analiz limitine (${DAILY_LIMIT}) ulaştınız. Yarın tekrar deneyebilir veya doğrudan bizimle iletişime geçebilirsiniz.`);
      return;
    }

    if (!url || !sectorKeywords || !businessModel) {
      setError('Lütfen zorunlu alanları (URL, Sektör, İş Modeli) doldurun.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await generateProposal(url, sectorKeywords, competitorUrls, adInputs, trackingInputs, isEcommerce, businessModel);
      setAnalysisResult(result);
      sendNotificationEmail(result);
      updateUsage();
    } catch (e) {
      setError('Analiz motoru bir sorunla karşılaştı. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  }, [url, sectorKeywords, competitorUrls, adInputs, trackingInputs, isEcommerce, businessModel, usageCount, sendNotificationEmail]);

  return (
    <div className="bg-slate-900 min-h-screen text-slate-200 font-sans pb-20">
      <header className="py-8 border-b border-slate-800 bg-slate-950/50 sticky top-0 z-50 backdrop-blur-md">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
              DİJİTAL TEŞHİS MOTORU
            </h1>
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.3em] font-mono">Powered by Dijital İzler & Gemini 3 Pro</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="px-3 py-1 bg-slate-800 rounded-full border border-slate-700 text-[10px] font-bold text-slate-400">
                GÜNLÜK HAK: {DAILY_LIMIT - usageCount} / {DAILY_LIMIT}
             </div>
             <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                ÜCRETSİZ ERİŞİM
             </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          <section className="text-center space-y-4">
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">Siteniz Neden <span className="text-sky-500">Satış Yapmıyor?</span></h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Teorik raporları unutun. Yapay zeka ve uzman tecrübesiyle sitenizin ticari tıkanıklıklarını saniyeler içinde teşhis edin.
            </p>
          </section>

          <HowItWorks />
          
          <AnalysisInput
            url={url} setUrl={setUrl}
            sectorKeywords={sectorKeywords} setSectorKeywords={setSectorKeywords}
            businessModel={businessModel} setBusinessModel={setBusinessModel}
            isEcommerce={isEcommerce} setIsEcommerce={setIsEcommerce}
            competitorUrls={competitorUrls} setCompetitorUrls={setCompetitorUrls}
            adInputs={adInputs} setAdInputs={setAdInputs}
            trackingInputs={trackingInputs} setTrackingInputs={setTrackingInputs}
            onAnalyze={handleAnalysis}
            isLoading={isLoading}
          />

          {error && (
            <div className="bg-red-900/20 border-2 border-red-900/50 p-6 rounded-2xl text-red-400 text-sm font-bold flex items-center gap-4 animate-shake">
              <span className="text-2xl">⚠️</span>
              {error}
            </div>
          )}

          {isLoading && <LoadingSpinner />}

          {analysisResult && !isLoading && (
            <AnalysisResult result={analysisResult} url={url} />
          )}
        </div>
      </main>

      <footer className="container mx-auto px-4 py-12 border-t border-slate-800 text-center">
         <p className="text-slate-600 text-xs font-mono">
           &copy; {new Date().getFullYear()} Dijital İzler - Profesyonel Dijital Teşhis ve Büyüme Protokolü.
         </p>
      </footer>
    </div>
  );
};

export default App;
