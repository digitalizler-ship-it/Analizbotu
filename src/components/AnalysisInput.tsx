
import React from 'react';
import { AdInputs, AdPlatformInput, AdStatus, AdQuality, TrackingInputs, BusinessModel } from '../types';
import { WhatsappIcon, LinkedInIcon, InstagramIcon } from './icons';

interface AnalysisInputProps {
  url: string;
  setUrl: (url: string) => void;
  sectorKeywords: string;
  setSectorKeywords: (keywords: string) => void;
  businessModel: BusinessModel;
  setBusinessModel: (model: BusinessModel) => void;
  isEcommerce: boolean;
  setIsEcommerce: (isEcommerce: boolean) => void;
  competitorUrls: string[];
  setCompetitorUrls: (urls: string[]) => void;
  adInputs: AdInputs;
  setAdInputs: (adInputs: AdInputs) => void;
  trackingInputs: TrackingInputs;
  setTrackingInputs: (inputs: TrackingInputs) => void;
  onAnalyze: () => void;
  isLoading: boolean;
}

const platforms: { key: keyof AdInputs; name: string }[] = [
    { key: 'meta', name: 'Meta' },
    { key: 'google', name: 'Google' },
    { key: 'linkedin', name: 'LinkedIn' },
    { key: 'tiktok', name: 'TikTok' },
];

export const AnalysisInput: React.FC<AnalysisInputProps> = ({ 
    url, setUrl, 
    sectorKeywords, setSectorKeywords, 
    businessModel, setBusinessModel,
    isEcommerce, setIsEcommerce, 
    competitorUrls, setCompetitorUrls, 
    adInputs, setAdInputs, 
    trackingInputs, setTrackingInputs,
    onAnalyze, isLoading 
}) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (event.key === 'Enter' && url && sectorKeywords && businessModel) {
      onAnalyze();
    }
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

  const handleTrackingChange = (field: keyof TrackingInputs) => {
      setTrackingInputs({
          ...trackingInputs,
          [field]: !trackingInputs[field]
      });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] shadow-2xl space-y-10">
      
      {/* SECTION 1: CORE DATA */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
            <span className="h-1.5 w-8 bg-sky-500 rounded-full"></span>
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">TEMEL VERİ GİRİŞİ</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-1">WEB SİTESİ URL</label>
                <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="https://site.com"
                    className="w-full px-5 py-3 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-sky-500/50 outline-none text-slate-100 placeholder-slate-700 transition-all font-mono text-sm"
                    disabled={isLoading}
                />
            </div>
            
            <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-1">İŞ MODELİ</label>
                <select
                    value={businessModel}
                    onChange={(e) => setBusinessModel(e.target.value as BusinessModel)}
                    onKeyDown={handleKeyDown}
                    className="w-full px-5 py-3 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-sky-500/50 outline-none text-slate-100 transition-all text-sm appearance-none"
                    disabled={isLoading}
                >
                    <option value="">İş Modeli Seçin...</option>
                    <option value="B2B">B2B (Kurumsal)</option>
                    <option value="B2C">B2C (Bireysel)</option>
                    <option value="SaaS">SaaS (Yazılım)</option>
                    <option value="Lead Gen">Lead Gen (Form)</option>
                    <option value="E-commerce">E-Ticaret</option>
                </select>
            </div>
        </div>

        <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider ml-1">SEKTÖR VE UZMANLIK (MUTLAK OTORİTE)</label>
            <input
                type="text"
                value={sectorKeywords}
                onChange={(e) => setSectorKeywords(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Örn: Butik Kahve Zinciri, İstanbul Diş Kliniği..."
                className="w-full px-5 py-3 bg-slate-950 border border-slate-800 rounded-2xl focus:ring-2 focus:ring-sky-500/50 outline-none text-slate-100 placeholder-slate-700 transition-all text-sm font-medium"
                disabled={isLoading}
            />
            <p className="text-[9px] text-slate-600 font-mono italic text-right">* Bu veri AI çıkarımlarından daha üstündür.</p>
        </div>
      </div>

      {/* SECTION 2: TRACKING & ADS */}
      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <span className="h-1.5 w-8 bg-emerald-500 rounded-full"></span>
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">ALTYAPI & TAKİP</h3>
            </div>
            <div className="grid grid-cols-1 gap-2">
                {[
                    { id: 'hasPixel', label: 'Meta Pixel' },
                    { id: 'hasAnalytics', label: 'Google Analytics 4' },
                    { id: 'hasGTM', label: 'Google Tag Manager' }
                ].map((track) => (
                    <label key={track.id} className="flex items-center justify-between p-4 bg-slate-950 border border-slate-800 rounded-2xl cursor-pointer hover:border-emerald-500/30 transition-all group">
                        <span className="text-xs font-bold text-slate-400 group-hover:text-slate-100 transition-colors">{track.label}</span>
                        <input
                            type="checkbox"
                            checked={trackingInputs[track.id as keyof TrackingInputs]}
                            onChange={() => handleTrackingChange(track.id as keyof TrackingInputs)}
                            className="h-5 w-5 rounded-lg border-slate-700 bg-slate-900 text-emerald-500 focus:ring-emerald-500/20"
                        />
                    </label>
                ))}
            </div>
        </div>

        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <span className="h-1.5 w-8 bg-yellow-500 rounded-full"></span>
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest">REKLAM KANALLARI</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {platforms.map(({key, name}) => (
                    <div key={key} className="space-y-1.5">
                        <label className="text-[9px] font-black text-slate-600 ml-1">{name}</label>
                        <select
                            value={adInputs[key].runsAds}
                            onChange={(e) => handleAdInputChange(key, 'runsAds', e.target.value)}
                            className={`w-full text-xs px-3 py-2 bg-slate-950 border rounded-xl outline-none transition-all appearance-none ${adInputs[key].runsAds === 'yes' ? 'border-sky-900 text-sky-400' : 'border-slate-800 text-slate-400'}`}
                        >
                            <option value="">Pasif</option>
                            <option value="yes">Aktif</option>
                        </select>
                        {adInputs[key].runsAds === 'yes' && (
                            <select
                                value={adInputs[key].quality}
                                onChange={(e) => handleAdInputChange(key, 'quality', e.target.value)}
                                className="w-full text-[9px] bg-sky-950/20 border-none rounded-lg p-1 text-sky-300 font-bold uppercase tracking-tighter outline-none animate-fade-in"
                            >
                                <option value="">Düzey...</option>
                                <option value="zayıf">Zayıf</option>
                                <option value="orta">Orta</option>
                                <option value="yüksek">Yüksek</option>
                            </select>
                        )}
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* FINAL ACTION */}
      <div className="pt-4">
        <button
            onClick={onAnalyze}
            disabled={isLoading || !url || !sectorKeywords || !businessModel}
            className="group relative w-full overflow-hidden py-5 bg-white text-slate-950 font-black rounded-[1.5rem] hover:bg-sky-400 transition-all duration-500 shadow-2xl disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed uppercase tracking-[0.2em] text-sm"
        >
            <span className="relative z-10 flex items-center justify-center gap-3">
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        ANALİZ MOTORU ÇALIŞIYOR
                    </>
                ) : 'DİJİTAL TEŞHİSİ BAŞLAT'}
            </span>
        </button>
      </div>
    </div>
  );
};
