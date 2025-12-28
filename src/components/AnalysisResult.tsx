
import React, { useState } from 'react';
import { AnalysisResult as AnalysisResultType } from '../types';
import { WhatsappIcon, DocumentTextIcon } from './icons';

interface AnalysisResultProps {
  result: AnalysisResultType;
  url: string;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, url }) => {
  const [copySuccess, setCopySuccess] = useState('');

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-400';
    if (score >= 70) return 'text-sky-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-500';
  };

  const handleCopyEmail = async () => {
    try {
        await navigator.clipboard.writeText(result.emailDraft);
        setCopySuccess('Kopyalandı!');
        setTimeout(() => setCopySuccess(''), 2000);
    } catch (err) {
        setCopySuccess('Hata!');
    }
  };

  return (
    <div className="space-y-16 animate-fade-in pb-20 mt-12 border-t border-slate-800 pt-12">
      
      {/* 1. EXECUTIVE GERÇEKLİK ÖZETİ */}
      <section className="bg-slate-800/20 p-8 rounded-3xl border border-slate-700/50 shadow-2xl relative">
        <div className="absolute -top-4 left-8 bg-sky-600 px-4 py-1 rounded text-[10px] font-black uppercase tracking-widest text-white shadow-lg">
          01. EXECUTIVE GERÇEKLİK ÖZETİ
        </div>
        <p className="text-xl md:text-2xl font-black text-slate-100 leading-tight italic border-l-8 border-sky-500 pl-8">
          "{result.executiveRealitySummary}"
        </p>
      </section>

      {/* 2. SKORUN GERÇEK ANLAMI */}
      <section className="space-y-8">
        <h3 className="text-xs font-black text-slate-600 uppercase tracking-[0.4em] text-center">02. PERFORMANS ANALİZİ VE SKORUN ANLAMI</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(result.scoreMeaning.detailedScores).map(([key, score]) => (
                <div key={key} className="bg-slate-900/80 border border-slate-800 p-6 rounded-2xl text-center shadow-lg group hover:border-sky-500/50 transition-all">
                    <p className="text-[10px] text-slate-500 uppercase font-black mb-3 tracking-tighter">{key}</p>
                    {/* Fixed: Explicitly cast 'score' to number to resolve 'unknown' type error when passing it to getScoreColor */}
                    <p className={`text-4xl font-black ${getScoreColor(score as number)}`}>{score as number}</p>
                </div>
            ))}
        </div>
        
        <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
                <div>
                    <span className="text-[10px] text-sky-500 font-black uppercase tracking-widest">Durum Sınıflandırması</span>
                    <p className="text-3xl font-black text-white mt-1">{result.scoreMeaning.classification}</p>
                </div>
                <div>
                    <span className="text-[10px] text-red-500 font-black uppercase tracking-widest">Devam Edilirse:</span>
                    <p className="text-sm text-slate-400 mt-2 leading-relaxed">{result.scoreMeaning.consequences}</p>
                </div>
            </div>
            <div className="space-y-6">
                <div>
                    <span className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Ne Mümkün Olmaz?</span>
                    <p className="text-sm text-slate-300 font-medium mt-2">{result.scoreMeaning.notPossible}</p>
                </div>
                <div>
                    <span className="text-[10px] text-yellow-500 font-black uppercase tracking-widest">En Sık Yapılan Hata:</span>
                    <p className="text-sm text-slate-400 italic mt-2">"{result.scoreMeaning.commonError}"</p>
                </div>
            </div>
        </div>
      </section>

      {/* 3. TEKNİK DOĞRU, TİCARİ YANLIŞ */}
      <section className="space-y-6">
        <h3 className="text-xs font-black text-slate-600 uppercase tracking-[0.4em]">03. TEKNİK DOĞRU, TİCARİ YANLIŞ OLAN ALANLAR</h3>
        <div className="grid md:grid-cols-3 gap-4">
            {result.technicallyRightCommerciallyWrong.map((item, i) => (
                <div key={i} className="bg-slate-800/10 border-l-2 border-slate-700 p-6 rounded-r-xl group hover:bg-slate-800/30 transition-colors">
                    <p className="text-sm text-slate-300 font-medium leading-relaxed italic">"{item}"</p>
                </div>
            ))}
        </div>
      </section>

      {/* 4-5-6-7. GERÇEKLİK ANALİZLERİ */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* 4. SEO GERÇEĞİ */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4">
            <h4 className="text-sky-500 font-black text-xs uppercase tracking-widest">04. SEO GERÇEĞİ (Trafik ≠ Satış)</h4>
            <p className="text-sm text-slate-300 leading-relaxed">{result.seoReality.trafficPotential} / {result.seoReality.salesPotential}</p>
            <p className="text-xs text-slate-500 italic">Neden Geride? {result.seoReality.competitorGap}</p>
            <div className="pt-4 border-t border-slate-800">
                <span className="text-[10px] text-emerald-500 font-bold uppercase">Hızlı Kazanımlar:</span>
                <ul className="text-xs text-slate-400 mt-2 list-disc pl-4">
                    {result.seoReality.quickWins.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
            </div>
        </div>

        {/* 5. REKLAM & MESAJ GERÇEKLİĞİ */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4">
            <h4 className="text-emerald-500 font-black text-xs uppercase tracking-widest">05. REKLAM & MESAJ GERÇEKLİĞİ</h4>
            <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl font-black text-white">{result.adsReality.messagingScore}<span className="text-xs text-slate-600">/10</span></span>
                <span className="text-[10px] text-slate-500 uppercase font-bold">Mesaj Netlik Skoru</span>
            </div>
            <p className="text-sm text-slate-300 italic">"{result.adsReality.targetingVsPersuasion}"</p>
            <p className="text-xs text-slate-400">{result.adsReality.valuePriceBalance}</p>
            <p className="text-[10px] text-sky-400 uppercase font-black">Neden Tıklayayım? {result.adsReality.clickReason}</p>
        </div>

        {/* 6. UX & DÖNÜŞÜM TIKANIKLIĞI */}
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4">
            <h4 className="text-yellow-500 font-black text-xs uppercase tracking-widest">06. UX & DÖNÜŞÜM TIKANIKLIĞI</h4>
            <div className="space-y-3 text-xs">
                <p><strong className="text-slate-200 uppercase">Kararsızlık:</strong> {result.uxFriction.hesitationPoint}</p>
                <p><strong className="text-slate-200 uppercase">Güven Kaybı:</strong> {result.uxFriction.trustLossPoint}</p>
                <p><strong className="text-red-500 uppercase">Terk Etme:</strong> {result.uxFriction.exitPoint}</p>
            </div>
            <p className="text-sm text-white font-bold pt-4 border-t border-slate-800">Yargı: {result.uxFriction.expertVerdict}</p>
        </div>

        {/* 7. ASIL SORUN NEDİR? */}
        <div className="bg-sky-900/10 border-2 border-sky-500/30 p-8 rounded-3xl flex flex-col justify-center">
            <h4 className="text-sky-400 font-black text-xs uppercase tracking-widest mb-2">07. ASIL SORUN NEDİR?</h4>
            <p className="text-4xl font-black text-white mb-2 uppercase tracking-tighter">{result.coreProblem.type}</p>
            <p className="text-sm text-sky-200 leading-relaxed font-medium">{result.coreProblem.reason}</p>
        </div>
      </div>

      {/* 8. NE YAPILMAZSA BATIRIR? */}
      <section className="bg-red-950/20 border-2 border-red-900/50 p-10 rounded-3xl relative overflow-hidden">
        <h3 className="text-xs font-black text-red-500 uppercase tracking-[0.4em] mb-6">08. NE YAPILMAZSA BATIRIR?</h3>
        <div className="grid md:grid-cols-2 gap-12">
            <div>
                <span className="text-[10px] text-red-400 font-bold uppercase">Boşa Gidecek Yatırım</span>
                <p className="text-lg text-white font-black mt-1 leading-tight">{result.failureRisk.wastedInvestment}</p>
            </div>
            <div>
                <span className="text-[10px] text-red-400 font-bold uppercase">Para Yakacak Kanal</span>
                <p className="text-lg text-white font-black mt-1 leading-tight">{result.failureRisk.burningChannel}</p>
            </div>
        </div>
      </section>

      {/* 9. NET AKSİYON ÇERÇEVESİ */}
      <section className="space-y-6">
        <h3 className="text-xs font-black text-slate-600 uppercase tracking-[0.4em]">09. NET AKSİYON ÇERÇEVESİ</h3>
        <div className="grid md:grid-cols-3 gap-6">
            {[
                { title: '0–30 Gün: Kritik Hamleler', data: result.actionFramework.day0_30 },
                { title: '30–60 Gün: Büyüme Hamleleri', data: result.actionFramework.day30_60 },
                { title: '60–90 Gün: Ölçekleme Hamleleri', data: result.actionFramework.day60_90 }
            ].map((step, idx) => (
                <div key={idx} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
                    <p className="text-sky-500 font-black text-xs mb-4 uppercase tracking-wider">{step.title}</p>
                    <ul className="space-y-4">
                        {step.data.map((a, i) => (
                            <li key={i} className="text-xs">
                                <span className="text-slate-100 font-bold block mb-1 underline decoration-sky-800 underline-offset-4">{a.task}</span>
                                <span className="text-slate-500 text-[9px] uppercase font-mono">Etki: {a.impact}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
      </section>

      {/* 10. DANIŞMAN YARGISI */}
      <section className="bg-white p-12 rounded-[3rem] shadow-2xl relative">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-6">10. DANIŞMAN YARGISI (MANDATORY)</h3>
        <p className="text-3xl md:text-4xl font-black text-slate-900 leading-[1.1] tracking-tighter">
            "{result.expertJudgment}"
        </p>
      </section>

      {/* 11. CTA - SONRAKİ ADIM */}
      <section className="text-center space-y-8 pt-12 border-t border-slate-800">
        <div className="max-w-2xl mx-auto space-y-4">
            <h3 className="text-xs font-black text-slate-600 uppercase tracking-widest">11. SONRAKİ MANTIKLI ADIM</h3>
            <p className="text-slate-400 text-lg italic leading-relaxed">"{result.nextStep}"</p>
            <div className="pt-6">
                <a href="https://api.whatsapp.com/send/?phone=905464147434" target="_blank" className="inline-flex items-center gap-4 bg-green-600 text-white px-10 py-5 rounded-2xl font-black text-xl shadow-2xl hover:shadow-green-500/20 transition-all active:scale-95 group">
                    <WhatsappIcon className="w-8 h-8 group-hover:rotate-12 transition-transform" />
                    BİLİRKİŞİ İLE İLETİŞİME GEÇ
                </a>
            </div>
            <p className="text-[10px] text-slate-600 mt-4">Bu analiz bir karar alma aracıdır. Teorik değil, uygulama odaklıdır.</p>
        </div>
      </section>

      {/* EMAİL TASLAĞI */}
      <section className="bg-slate-950 p-8 rounded-3xl border border-slate-900">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-widest">SATIŞ ODAKLI EMAIL TASLAĞI</h2>
            <button onClick={handleCopyEmail} className="text-[9px] bg-slate-900 border border-slate-800 px-4 py-1.5 rounded-full text-slate-500 hover:text-white transition-colors">
                {copySuccess || 'KOPYALA'}
            </button>
        </div>
        <pre className="text-xs font-mono text-slate-600 whitespace-pre-wrap leading-relaxed select-all">
            {result.emailDraft}
        </pre>
      </section>

    </div>
  );
};
