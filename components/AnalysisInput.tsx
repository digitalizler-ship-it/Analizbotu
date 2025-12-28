
import React from 'react';
import { AdInputs, AdPlatformInput, AdStatus, AdQuality } from '../types';
import { WhatsappIcon, LinkedInIcon, InstagramIcon } from './icons';

interface AnalysisInputProps {
  url: string;
  setUrl: (url: string) => void;
  sectorKeywords: string;
  setSectorKeywords: (keywords: string) => void;
  isEcommerce: boolean;
  setIsEcommerce: (isEcommerce: boolean) => void;
  competitorUrls: string[];
  setCompetitorUrls: (urls: string[]) => void;
  adInputs: AdInputs;
  setAdInputs: (adInputs: AdInputs) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const platforms: { key: keyof AdInputs; name: string }[] = [
    { key: 'meta', name: 'Meta (FB/IG)' },
    { key: 'google', name: 'Google' },
    { key: 'linkedin', name: 'LinkedIn' },
    { key: 'tiktok', name: 'TikTok' },
];

export const AnalysisInput: React.FC<AnalysisInputProps> = ({ url, setUrl, sectorKeywords, setSectorKeywords, isEcommerce, setIsEcommerce, competitorUrls, setCompetitorUrls, adInputs, setAdInputs, onAnalyze, isLoading }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && url) {
      onAnalyze();
    }
  };

  const handleCompetitorUrlChange = (index: number, value: string) => {
    const newUrls = [...competitorUrls];
    newUrls[index] = value;
    setCompetitorUrls(newUrls);
  };

  const handleAdInputChange = (platform: keyof AdInputs, field: keyof AdPlatformInput, value: string) => {
    const newAdInputs = { ...adInputs };
    const platformInput = { ...newAdInputs[platform] };

    if (field === 'runsAds') {
        platformInput.runsAds = value as AdStatus;
        if (value !== 'yes') {
            platformInput.quality = '';
        }
    } else {
        platformInput.quality = value as AdQuality;
    }

    newAdInputs[platform] = platformInput;
    setAdInputs(newAdInputs);
  };


  return (
    <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 shadow-lg space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-slate-300 mb-3">Analiz Edilecek Site Bilgileri</h3>
        <div className="space-y-4">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="https://ornekwebsitesi.com"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition duration-200 text-slate-200 placeholder-slate-500"
              disabled={isLoading}
            />
            <input
              type="text"
              value={sectorKeywords}
              onChange={(e) => setSectorKeywords(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Sektör veya Anahtar Kelime (Örn: Lüks saat satışı, avukatlık bürosu)"
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition duration-200 text-slate-200 placeholder-slate-500"
              disabled={isLoading}
            />
             <div className="flex items-center">
              <input
                id="is-ecommerce"
                type="checkbox"
                checked={isEcommerce}
                onChange={(e) => setIsEcommerce(e.target.checked)}
                disabled={isLoading}
                className="h-4 w-4 rounded border-slate-500 bg-slate-700 text-sky-600 focus:ring-sky-500"
              />
              <label htmlFor="is-ecommerce" className="ml-3 block text-sm font-medium text-slate-300">
                Bu bir E-ticaret Sitesi mi?
              </label>
            </div>
        </div>
      </div>
       <div>
        <h3 className="text-lg font-semibold text-slate-300 mb-3">Rakip Analizi (Opsiyonel)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
            type="url"
            value={competitorUrls[0]}
            onChange={(e) => handleCompetitorUrlChange(0, e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://rakip1.com"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition duration-200 text-slate-200 placeholder-slate-500"
            disabled={isLoading}
            />
            <input
            type="url"
            value={competitorUrls[1]}
            onChange={(e) => handleCompetitorUrlChange(1, e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="https://rakip2.com"
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition duration-200 text-slate-200 placeholder-slate-500"
            disabled={isLoading}
            />
        </div>
      </div>


      <div>
        <h3 className="text-lg font-semibold text-slate-300 mb-3">Reklam Analizi Girdileri (Opsiyonel)</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {platforms.map(({key, name}) => (
                <div key={key} className="space-y-2">
                    <label className="block text-sm font-medium text-slate-400">{name}</label>
                    <select
                        value={adInputs[key].runsAds}
                        onChange={(e) => handleAdInputChange(key, 'runsAds', e.target.value)}
                        disabled={isLoading}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none transition duration-200 text-slate-200"
                    >
                        <option value="">Reklam Durumu?</option>
                        <option value="yes">Evet, Çıkıyor</option>
                        <option value="no">Hayır, Çıkmıyor</option>
                    </select>

                    {adInputs[key].runsAds === 'yes' && (
                         <select
                            value={adInputs[key].quality}
                            onChange={(e) => handleAdInputChange(key, 'quality', e.target.value)}
                            disabled={isLoading}
                            className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-md focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none transition duration-200 text-slate-200 animate-fade-in"
                        >
                            <option value="">Reklam Kalitesi?</option>
                            <option value="zayıf">Zayıf</option>
                            <option value="orta">Orta</option>
                            <option value="yüksek">Yüksek</option>
                        </select>
                    )}
                </div>
            ))}
        </div>
      </div>

      <div className="space-y-4">
        <button
          onClick={onAnalyze}
          disabled={isLoading || !url}
          className="w-full px-8 py-3 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center gap-2 flex-shrink-0 text-lg"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analiz Ediliyor...
            </>
          ) : (
            'Analiz Et'
          )}
        </button>
         <div className="text-center text-xs text-slate-400 pt-2 space-y-3">
          <p>
              Bu motor tamamen yapayzeka destekli çalışmaktadır. Hata yapabilir. Lütfen bilgileri doğrulayın ya da profesyonel destek için iletişime geçin.
          </p>
          <a
            href="https://api.whatsapp.com/send/?phone=905464147434&text=Kriz%20Dan%C4%B1%C5%9Fmanl%C4%B1%C4%9F%C4%B1%20i%C3%A7in%20ileti%C5%9Fime%20ge%C3%A7iyorum"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition duration-300 text-sm shadow-md hover:shadow-green-500/30"
          >
            <WhatsappIcon className="w-4 h-4" />
            <span>Profesyonel Destek Al</span>
          </a>
          <div className="flex justify-center items-center gap-4 pt-2">
            <a href="https://www.linkedin.com/in/ertunckoruc/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-300 transition-colors duration-300">
                <LinkedInIcon className="w-6 h-6" />
            </a>
            <a href="https://www.instagram.com/dijitaliizler/" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-300 transition-colors duration-300">
                <InstagramIcon className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
