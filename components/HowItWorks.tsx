
import React, { useState } from 'react';

export const HowItWorks: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-8 overflow-hidden rounded-xl border border-slate-700 bg-slate-900/40 transition-all duration-300 shadow-inner">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-5 text-left hover:bg-slate-800/50 transition-colors border-l-4 border-sky-500"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-lg uppercase tracking-tight">Teknik Analiz Protokolü (Dev Mode)</h3>
            <p className="text-xs text-slate-500 font-mono italic">v2.5.0-native-grounding_enabled</p>
          </div>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={`h-6 w-6 text-slate-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      <div className={`transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="border-t border-slate-700/50 p-8 space-y-8 font-sans text-slate-300">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="space-y-3">
              <h4 className="flex items-center gap-2 text-sky-400 font-bold uppercase tracking-widest text-xs border-b border-sky-900/50 pb-2">
                <span className="h-2 w-2 bg-sky-500 rounded-full animate-pulse"></span>
                01. Otorite ve Veri Hiyerarşisi
              </h4>
              <div className="space-y-2 text-sm">
                <p className="bg-slate-800/50 p-3 rounded-md border-l-2 border-sky-600">
                  <strong className="text-white">Level 0 - Mutlak Otorite:</strong> Kullanıcının <code className="text-sky-300">sectorDeclaredByUser</code> girdisi mutlaktır. AI'nın iç bilgisi veya URL tahminleri bu veriyi değiştiremez.
                </p>
                <p className="p-2 border-l-2 border-slate-700">
                  <strong className="text-slate-200">Level 1 - Teknik Girdiler:</strong> Reklam (Ads) ve Takip (Pixel/GA4) verileri teşhisin temelini oluşturur.
                </p>
                <p className="p-2 border-l-2 border-slate-700">
                  <strong className="text-slate-200">Level 2 - Grounding:</strong> Google Search snippet'leri sadece doğrulama için kullanılır.
                </p>
              </div>
            </section>

            <section className="space-y-3">
              <h4 className="flex items-center gap-2 text-red-400 font-bold uppercase tracking-widest text-xs border-b border-red-900/50 pb-2">
                <span className="h-2 w-2 bg-red-500 rounded-full"></span>
                02. Negatif Kısıtlamalar
              </h4>
              <ul className="space-y-2 text-sm list-none">
                <li className="flex gap-2">
                  <span className="text-red-500">✕</span>
                  <span>Marka adından sektör tahmini yapılması yasaktır.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500">✕</span>
                  <span>URL kelimelerinden anlam üretilemez.</span>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
