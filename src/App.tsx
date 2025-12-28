
import React, { useState, useCallback, useEffect } from 'react';
import { AnalysisResult as AnalysisResultType, AdInputs, TrackingInputs, BusinessModel } from './types';
import { generateProposal } from './services/geminiService';
import { AnalysisInput } from './components/AnalysisInput';
import { AnalysisResult } from './components/AnalysisResult';
import { LoadingSpinner } from './components/LoadingSpinner';
import { HowItWorks } from './components/HowItWorks';
import emailjs from '@emailjs/browser';

const DAILY_LIMIT = 5;

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
  const [needsNewKey, setNeedsNewKey] = useState(false);

  useEffect(() => {
    emailjs.init('RLLdwGUH72IV4l-Nj');
    
    const today = new Date().toDateString();
    const storedData = localStorage.getItem('diagnosis_usage');
    if (storedData) {
      const { count, date } = JSON.parse(storedData);
      if (date === today) {
        setUsageCount(count);
      } else {
        setUsageCount(0);
        localStorage.setItem('diagnosis_usage', JSON.stringify({ count: 0, date: today }));
      }
    }
  }, []);

  const handleSelectKey = async () => {
    try {
      // @ts-ignore
      await window.aistudio.openSelectKey();
      setNeedsNewKey(false);
      setError(null);
    } catch (err) {
      console.error("Key selection failed", err);
    }
  };

  const handleAnalysis = useCallback(async () => {
    if (usageCount >= DAILY_LIMIT) {
      setError(`Günlük ücretsiz analiz limitine (${DAILY_LIMIT}) ulaştınız. Yarın tekrar bekleriz!`);
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
      
      const newCount = usageCount + 1;
      setUsageCount(newCount);
      localStorage.setItem('diagnosis_usage', JSON.stringify({ count: newCount, date: new Date().toDateString() }));
      
    } catch (e: any) {
      const msg = e.message || 'Beklenmedik bir hata oluştu.';
      setError(msg);
      if (msg.includes("403") || msg.includes("leaked") || msg.includes("API key")) {
        setNeedsNewKey(true);
      }
    } finally {
      setIsLoading(false);
    }
  }, [url, sectorKeywords, competitorUrls, adInputs, trackingInputs, isEcommerce, businessModel, usageCount]);

  return (
    <div className="bg-slate-900 min-h-screen text-slate-200 font-sans pb-20">
      <header className="py-8 border-b border-slate-800 bg-slate-950/50 sticky top-0 z-50 backdrop-blur-md">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">
              DİJİTAL TEŞHİS MOTORU
            </h1>
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.3em] font-mono">v3.2.0 | RECOVERY PROTOCOL</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="px-3 py-1 bg-slate-800 rounded-full border border-slate-700 text-[10px] font-bold text-slate-400">
                GÜNLÜK HAK: {DAILY_LIMIT - usageCount} / {DAILY_LIMIT}
             </div>
             {needsNewKey && (
               <button 
                onClick={handleSelectKey}
                className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-full text-[10px] font-black uppercase transition-colors shadow-lg shadow-red-600/20"
               >
                 API ANAHTARINI GÜNCELLE
               </button>
             )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
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
            <div className="bg-red-900/20 border-2 border-red-900/50 p-6 rounded-2xl text-red-400 text-sm font-bold flex flex-col items-center gap-4 animate-shake">
              <div className="flex items-center gap-4">
                <span className="text-2xl">⚠️</span>
                <span>{error}</span>
              </div>
              {needsNewKey && (
                <div className="mt-4 p-4 bg-red-950/40 rounded-xl border border-red-800/50 text-center">
                  <p className="mb-4 text-xs">Mevcut API anahtarınız devre dışı kalmış. Kendi API anahtarınızı seçerek devam edebilirsiniz.</p>
                  <button 
                    onClick={handleSelectKey}
                    className="bg-white text-red-600 px-6 py-2 rounded-lg font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-colors"
                  >
                    Yeni Anahtar Seç
                  </button>
                  <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="block mt-2 text-[10px] underline opacity-50">Faturalandırma dökümanı</a>
                </div>
              )}
            </div>
          )}

          {isLoading && <LoadingSpinner />}
          {analysisResult && !isLoading && <AnalysisResult result={analysisResult} url={url} />}
        </div>
      </main>
    </div>
  );
};

export default App;
