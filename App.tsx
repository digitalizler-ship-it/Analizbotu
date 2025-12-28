
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
    
    const today = new Date().toDateString();
    const storedData = localStorage.getItem('diagnosis_usage');
    if (storedData) {
      const { count, date } = JSON.parse(storedData);
      if (date === today) {
        setUsageCount(count);
      } else {
        localStorage.setItem('diagnosis_usage', JSON.stringify({ count: 0, date: today }));
      }
    }
  }, []);

  const handleAnalysis = useCallback(async () => {
    if (usageCount >= DAILY_LIMIT) {
      setError(`Günlük limitinize ulaştınız. Yarın tekrar deneyebilirsiniz.`);
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
      
      // Update usage
      const newCount = usageCount + 1;
      setUsageCount(newCount);
      localStorage.setItem('diagnosis_usage', JSON.stringify({ count: newCount, date: new Date().toDateString() }));

    } catch (e: any) {
      setError(e.message || 'Analiz motoru bir sorunla karşılaştı.');
    } finally {
      setIsLoading(false);
    }
  }, [url, sectorKeywords, competitorUrls, adInputs, trackingInputs, isEcommerce, businessModel, usageCount]);

  return (
    <div className="bg-slate-900 min-h-screen text-slate-200 font-sans pb-20">
      <header className="py-8 border-b border-slate-800 bg-slate-950/50 sticky top-0 z-50 backdrop-blur-md">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-emerald-400">DİJİTAL TEŞHİS MOTORU</h1>
            <p className="text-slate-500 text-[10px] uppercase tracking-widest font-mono">v3.0.0 | SENIOR STRATEGY PROTOCOL</p>
          </div>
          <div className="hidden md:flex gap-3">
             <span className="px-3 py-1 bg-slate-800 rounded-full border border-slate-700 text-[10px] font-bold text-slate-400">KALAN HAK: {DAILY_LIMIT - usageCount}</span>
             <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-black uppercase">CANLI ERİŞİM</span>
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
            <div className="bg-red-900/20 border-2 border-red-900/50 p-6 rounded-2xl text-red-400 text-sm font-bold animate-shake">
              {error}
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
