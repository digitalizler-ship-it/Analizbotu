
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="py-6 border-b border-slate-700/50">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
          Yapay Zeka Destekli Site Analiz Motoru
        </h1>
        <p className="text-slate-400 mt-2">Dijital Performansınızı Bir Üst Seviyeye Taşıyın</p>
      </div>
    </header>
  );
};