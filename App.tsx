
import React, { useState, useCallback, useEffect } from 'react';
import { AnalysisResult as AnalysisResultType, AdInputs, TrackingInputs, BusinessModel } from './types';
import { generateProposal } from './services/geminiService';
import { AnalysisInput } from './components/AnalysisInput';
import { AnalysisResult } from './components/AnalysisResult';
import { LoadingSpinner } from './components/LoadingSpinner';
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

  const handleAnalysis = useCallback(async () => {
    if (usageCount >= DAILY_LIMIT) {
      setError(`Günlük ücretsiz analiz limitinize ulaştınız. Yarın tekrar bekleriz!`);
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
      // Teknik hataları gizle, kullanıcıya anlamlı bir mesaj ver
      setError(e.message || 'Analiz motoruna şu an ulaşılamıyor. Lütfen kısa süre sonra tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  }, [url, sectorKeywords, competitorUrls, adInputs, trackingInputs, isEcommerce, businessModel, usageCount]);

  return (
    <div className="bg-slate-900 min-h-screen text-slate-200 font-sans pb-20">
      <header className="py-6 border-b border-slate-800 bg-slate-950/50 sticky top-0 z-50 backdrop-blur-md">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400 uppercase tracking-tighter">
              DİJİTAL TEŞHİS MOTORU
            </h1>
          </div>
          <div className="flex items-center gap-3">
             <div className="px-3 py-1 bg-slate-800/50 rounded-full border border-slate-700 text-[10px] font-bold text-slate-400 uppercase">
                GÜNLÜK KALAN HAK: {DAILY_LIMIT - usageCount}
             </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
              SİTENİZ NEDEN <span className="text-sky-500">BÜYÜMÜYOR?</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto font-medium">
              SEO, reklam ve dönüşüm tıkanıklıklarını saniyeler içinde tespit eden yapay zeka motoru.
            </p>
          </div>

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
            <div className="bg-red-950/30 border-2 border-red-500/20 p-6 rounded-3xl text-red-400 text-sm font-bold flex flex-col items-center gap-4 animate-shake shadow-2xl">
              <div className="flex items-center gap-4 text-center">
                <span className="text-2xl">🚨</span>
                <span className="leading-relaxed">{error}</span>
              </div>
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
