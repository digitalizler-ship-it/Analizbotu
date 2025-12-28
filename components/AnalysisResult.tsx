
import React, { useState } from 'react';
import { AnalysisResult as AnalysisResultType } from '../types';
import { ResultCard } from './ResultCard';
import { CheckCircleIcon, XCircleIcon, UsersIcon, DocumentTextIcon, LightBulbIcon, SparklesIcon, HtmlIcon, WhatsappIcon, InstagramIcon, LinkedInIcon } from './icons';

interface AnalysisResultProps {
  result: AnalysisResultType;
  url: string;
}

const BulletList: React.FC<{ items: string[]; icon: React.ReactNode }> = ({ items, icon }) => (
  <ul className="space-y-2">
    {items.map((item, index) => (
      <li key={index} className="flex items-start">
        <span className="flex-shrink-0 mt-1 mr-2">{icon}</span>
        <span>{item}</span>
      </li>
    ))}
  </ul>
);

const CallToActionSection = () => (
    <div className="mt-8 text-center not-prose space-y-4">
        <a
          href="https://api.whatsapp.com/send/?phone=905464147434&text=Kriz%20Dan%C4%B1%C5%9Fmanl%C4%B1%C4%9F%C4%B1%20i%C3%A7in%20ileti%C5%9Fime%20ge%C3%A7iyorum"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-500/40"
        >
          <WhatsappIcon className="w-6 h-6" />
          <span>Profesyonel Destek Al</span>
        </a>
        <div className="flex justify-center items-center gap-4">
            <a href="https://www.linkedin.com/in/ertunckoruc/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors duration-300">
                <LinkedInIcon className="w-7 h-7" />
            </a>
            <a href="https://www.instagram.com/dijitaliizler/" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors duration-300">
                <InstagramIcon className="w-7 h-7" />
            </a>
        </div>
    </div>
);


export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, url }) => {
  const { siteSummary, seoAnalysis, adAnalysis, competitorAnalysis, serviceProposal } = result;
  const [isGenerating, setIsGenerating] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 75) return 'text-yellow-400';
    return 'text-red-400';
  };

  const handleDownloadHtml = () => {
    const reportElement = document.getElementById('report-content');
    if (!reportElement || isGenerating) return;

    setIsGenerating(true);

    try {
      const reportHtml = reportElement.outerHTML;
      const pageTitle = `Analiz Raporu: ${url}`;

      const fullHtml = `
        <!DOCTYPE html>
        <html lang="tr">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>${pageTitle}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            body {
              background-color: #0f172a;
              font-family: sans-serif;
            }
            .report-container {
              max-width: 900px;
              margin: 0 auto;
              padding: 2rem 1rem;
            }
          </style>
        </head>
        <body>
          <main class="report-container">
            ${reportHtml}
          </main>
        </body>
        </html>
      `;

      const blob = new Blob([fullHtml], { type: 'text/html' });
      const href = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      const safeUrl = url.replace(/https?:\/\//, '').replace(/[^a-zA-Z0-9]/g, '_');
      a.href = href;
      a.download = `analiz-raporu-${safeUrl}.html`;
      document.body.appendChild(a);
      a.click();

      document.body.removeChild(a);
      URL.revokeObjectURL(href);

    } catch (error) {
      console.error("Error generating HTML:", error);
    } finally {
      setIsGenerating(false);
    }
  };


  return (
    <div className="animate-fade-in">
       <div className="flex justify-center items-center gap-4 mb-8">
        <button
          onClick={handleDownloadHtml}
          disabled={isGenerating}
          className="inline-flex items-center gap-2 px-6 py-3 bg-sky-600 text-white font-bold rounded-lg hover:bg-sky-500 disabled:bg-slate-600 disabled:cursor-not-allowed transition duration-200 shadow-lg hover:shadow-sky-500/30"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Oluşturuluyor...
            </>
          ) : (
            <>
              <HtmlIcon className="w-5 h-5" />
              <span>Raporu İndir</span>
            </>
          )}
        </button>
      </div>

      <div id="report-content" className="space-y-8">
        <h2 className="text-3xl font-bold text-center text-slate-100">Analiz Raporu: <span className="text-sky-400 break-all">{url}</span></h2>
        
        <p className="text-center text-lg text-slate-300 italic bg-slate-800/50 p-4 rounded-lg border border-slate-700">
          {siteSummary}
        </p>

        <ResultCard title="SEO Mükemmeliyet Protokolü Denetimi" icon={<LightBulbIcon />}>
            <div className="text-center mb-6">
                <p className="text-slate-400 text-lg">Genel Mükemmeliyet Puanı</p>
                <p className={`text-7xl font-bold ${getScoreColor(seoAnalysis.overallScore)}`}>{seoAnalysis.overallScore}<span className="text-4xl text-slate-500">/100</span></p>
                <p className="mt-2 text-slate-300">{seoAnalysis.summary}</p>
            </div>

            <div className="space-y-6">
                {seoAnalysis.audits.map((audit) => (
                    <div key={audit.category} className="p-4 bg-slate-800/70 rounded-lg">
                        <div className="flex justify-between items-center mb-3">
                            <h4 className="font-bold text-sky-400 text-lg">{audit.category}</h4>
                            <span className={`font-bold text-xl ${getScoreColor(audit.score * 10)}`}>{audit.score}/10</span>
                        </div>
                        {audit.failedChecks.length > 0 && (
                            <div className="mb-3">
                                <h5 className="font-semibold text-red-400 mb-2">Başarısız Denetimler</h5>
                                <BulletList items={audit.failedChecks} icon={<XCircleIcon className="w-5 h-5 text-red-400" />} />
                            </div>
                        )}
                        {audit.passedChecks.length > 0 && (
                             <div>
                                <h5 className="font-semibold text-green-400 mb-2">Başarılı Denetimler</h5>
                                <BulletList items={audit.passedChecks} icon={<CheckCircleIcon className="w-5 h-5 text-green-400" />} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
             {seoAnalysis.expertSuggestion && (
                <div className="mt-6 p-4 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
                    <h4 className="font-bold text-yellow-400 text-lg mb-2">Ek Uzman Önerisi</h4>
                    <p className="text-slate-300">{seoAnalysis.expertSuggestion}</p>
                </div>
            )}
        </ResultCard>

        
        <div className="grid md:grid-cols-1 gap-6">
          <ResultCard title="Stratejik Reklam Analizi" icon={<SparklesIcon />}>
             <p className="text-slate-300 whitespace-pre-line">{adAnalysis.strategicAnalysis}</p>
          </ResultCard>
        </div>

        {competitorAnalysis.competitors && competitorAnalysis.competitors.length > 0 && (
          <ResultCard title="Rakip Analizi" icon={<UsersIcon />}>
            <div className="space-y-4">
              {competitorAnalysis.competitors.map((competitor, index) => (
                <div key={index} className="p-4 bg-slate-800/70 rounded-lg">
                  <h4 className="font-bold text-sky-400 text-lg">{competitor.name}</h4>
                  <p className="mt-1 text-slate-300">{competitor.analysis}</p>
                </div>
              ))}
            </div>
          </ResultCard>
        )}

        <ResultCard title="Hizmet Teklifi" icon={<DocumentTextIcon />} isProposal={true}>
          <div className="prose prose-invert max-w-none prose-p:text-slate-300 prose-headings:text-slate-100">
              <p>{serviceProposal.introduction}</p>
              
              <h3 className="text-xl font-bold mt-6 mb-4 text-sky-400">Önerilen Hizmetler</h3>
              {serviceProposal.proposedServices.map((service, index) => (
                <div key={index} className="mb-4">
                  <h4 className="font-semibold text-lg">{service.serviceName}</h4>
                  <p>{service.description}</p>
                </div>
              ))}

              <p className="mt-6">{serviceProposal.conclusion}</p>
              
              <CallToActionSection />
          </div>
        </ResultCard>
      </div>
    </div>
  );
};
