
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
                  <span>Marka adından (Örn: Engince, Belusso) sektör tahmini yapılması kesinlikle yasaktır.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500">✕</span>
                  <span>URL kelimelerinden (URL-Parsing) anlam üretilemez.</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-red-500">✕</span>
                  <span>AI kendi hafızasındaki eski verileri, kullanıcı girdisinin önüne koyamaz.</span>
                </li>
              </ul>
            </section>
          </div>

          <section className="space-y-4">
            <h4 className="text-yellow-400 font-bold uppercase tracking-widest text-xs border-b border-yellow-900/50 pb-2">
              03. Teşhis Matrisi (Pazarlama Patolojileri)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="bg-red-900/20 border border-red-700/50 p-4 rounded-lg">
                <h5 className="text-red-400 font-bold mb-2">KÖR UÇUŞ</h5>
                <p>Reklam: <span className="text-green-400">VAR</span></p>
                <p>Takip: <span className="text-red-500">YOK</span></p>
                <p className="mt-2 opacity-70">"Paranızı çöpe atıyorsunuz" temalı email kurgusu tetiklenir.</p>
              </div>
              <div className="bg-yellow-900/20 border border-yellow-700/50 p-4 rounded-lg">
                <h5 className="text-yellow-400 font-bold mb-2">KOVADA DELİK</h5>
                <p>Reklam: <span className="text-green-400">VAR</span></p>
                <p>Site Skoru: <span className="text-red-500">DÜŞÜK</span></p>
                <p className="mt-2 opacity-70">"Müşteriyi kapıdan çeviriyorsunuz" temalı email kurgusu tetiklenir.</p>
              </div>
              <div className="bg-sky-900/20 border border-sky-700/50 p-4 rounded-lg">
                <h5 className="text-sky-400 font-bold mb-2">GÖRÜNÜRLÜK KRİZİ</h5>
                <p>Reklam: <span className="text-red-500">YOK</span></p>
                <p>Site Skoru: <span className="text-red-500">DÜŞÜK</span></p>
                <p className="mt-2 opacity-70">"Pazar payı kaybı" temalı email kurgusu tetiklenir.</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h4 className="text-emerald-400 font-bold uppercase tracking-widest text-xs border-b border-emerald-900/50 pb-2">
              04. Ağırlıklı Skorlama Protokolü
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-800/50">
                    <th className="p-3 font-bold text-slate-200">Kategori</th>
                    <th className="p-3 font-bold text-slate-200">Ağırlık</th>
                    <th className="p-3 font-bold text-slate-200">Kritik Kontroller</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  <tr>
                    <td className="p-3 font-semibold">Teknik Altyapı</td>
                    <td className="p-3 text-sky-400 font-bold italic">x3</td>
                    <td className="p-3 opacity-70 italic">TTFB, Cache, JS Defer, CDN, Compression</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">SEO Mimarisi</td>
                    <td className="p-3 text-sky-400 font-bold italic">x3</td>
                    <td className="p-3 opacity-70 italic">Silo Structure, Canonical, Hreflang, Schema.org</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">İçerik Otoritesi</td>
                    <td className="p-3 text-sky-400 font-bold italic">x2</td>
                    <td className="p-3 opacity-70 italic">EEAT, Kelime Sayısı, Author Otoritesi, TDK</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Mobil UX</td>
                    <td className="p-3 text-sky-400 font-bold italic">x2</td>
                    <td className="p-3 opacity-70 italic">WCAG Contrast, Sticky Ratio, Accessibility</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">CRO & Güven</td>
                    <td className="p-3 text-sky-400 font-bold italic">x3</td>
                    <td className="p-3 opacity-70 italic">CTA Quality, Form Optimization, Social Proof</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-slate-950 p-4 rounded-lg border border-slate-800">
            <h4 className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-2">Dev Persona Definition</h4>
            <p className="text-xs font-mono text-slate-400 leading-relaxed">
              System acts as <span className="text-slate-100">"Ertunç Koruç"</span>, Founder of <span className="text-slate-100">"Dijital İzler"</span>. 
              Strategy focus: Pain Points Detection -> GAIN Presentation. Avoids generic marketing buzzwords. 
              Strict enforcement of sector context over URL semantics.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};
