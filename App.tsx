
import React, { useState, useCallback, useEffect } from 'react';
import { AnalysisResult as AnalysisResultType, AdInputs } from './types';
import { generateProposal } from './services/geminiService';
import { Header } from './components/Header';
import { AnalysisInput } from './components/AnalysisInput';
import { AnalysisResult } from './components/AnalysisResult';
import { LoadingSpinner } from './components/LoadingSpinner';

// Type assertion for emailjs, which is loaded globally from index.html
declare const emailjs: any;

const initialAdInputs: AdInputs = {
  meta: { runsAds: '', quality: '' },
  google: { runsAds: '', quality: '' },
  linkedin: { runsAds: '', quality: '' },
  tiktok: { runsAds: '', quality: '' },
};

const App: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [competitorUrls, setCompetitorUrls] = useState<string[]>(['', '']);
  const [adInputs, setAdInputs] = useState<AdInputs>(initialAdInputs);
  const [isEcommerce, setIsEcommerce] = useState<boolean>(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResultType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [sectorKeywords, setSectorKeywords] = useState('');

  useEffect(() => {
    // Correctly initialize EmailJS with the PUBLIC Key
    emailjs.init('RLLdwGUH72IV4l-Nj');
  }, []);

  const sendNotificationEmail = useCallback((result: AnalysisResultType) => {
    const serviceID = 'service_i28ay7n';
    const templateID = 'template_tbn9x6n';

    const templateParams = {
      analyzed_url: url,
      sector_keywords: sectorKeywords || 'Girilmedi',
      is_ecommerce: isEcommerce ? 'Evet' : 'Hayır',
      competitor_1: competitorUrls[0] || 'Girilmedi',
      competitor_2: competitorUrls[1] || 'Girilmedi',
      ad_inputs: JSON.stringify(adInputs, null, 2),
      analysis_result: JSON.stringify(result, null, 2),
    };

    emailjs.send(serviceID, templateID, templateParams)
      .then((response: any) => {
        console.log('Notification email sent successfully!', response.status, response.text);
      })
      .catch((err: any) => {
        console.error('FAILED to send notification email. Error:', err);
      });
  }, [url, sectorKeywords, isEcommerce, competitorUrls, adInputs]);


  const handleAnalysis = useCallback(async () => {
    if (!url) {
      setError('Lütfen analiz için bir web sitesi adresi girin.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await generateProposal(url, sectorKeywords, competitorUrls, adInputs, isEcommerce);
      setAnalysisResult(result);
      
      sendNotificationEmail(result);

    } catch (e) {
      console.error(e);
      setError('Analiz sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin veya girdiğiniz URL\'yi kontrol edin.');
    } finally {
      setIsLoading(false);
    }
  }, [url, sectorKeywords, competitorUrls, adInputs, isEcommerce, sendNotificationEmail]);

  return (
    <div className="bg-slate-900 min-h-screen text-slate-200 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-lg md:text-xl text-slate-400 mb-8">
            Web sitenizin dijital pazarlama potansiyelini keşfedin. URL'yi girin, yapay zeka destekli analizi saniyeler içinde oluşturun.
          </p>
          
          <AnalysisInput
            url={url}
            setUrl={setUrl}
            sectorKeywords={sectorKeywords}
            setSectorKeywords={setSectorKeywords}
            isEcommerce={isEcommerce}
            setIsEcommerce={setIsEcommerce}
            competitorUrls={competitorUrls}
            setCompetitorUrls={setCompetitorUrls}
            adInputs={adInputs}
            setAdInputs={setAdInputs}
            onAnalyze={handleAnalysis}
            isLoading={isLoading}
          />

          {error && (
            <div className="mt-8 text-center bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">
              <strong className="font-bold">Hata!</strong>
              <span className="block sm:inline ml-2">{error}</span>
            </div>
          )}

          {isLoading && <LoadingSpinner />}

          {analysisResult && !isLoading && (
            <div className="mt-12">
              <AnalysisResult result={analysisResult} url={url} />
            </div>
          )}
        </div>
      </main>
      <footer className="text-center py-6 text-slate-500 text-sm">
        <p>Powered by Google Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;
