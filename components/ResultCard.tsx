
import React from 'react';

interface ResultCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isProposal?: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({ title, icon, children, isProposal = false }) => {
  const baseClasses = "bg-slate-800/50 border rounded-xl shadow-lg overflow-hidden";
  const borderClasses = isProposal ? "border-sky-500/50" : "border-slate-700";
  
  return (
    <div className={`${baseClasses} ${borderClasses}`}>
      <div className={`flex items-center p-4 border-b ${isProposal ? "border-sky-500/30 bg-sky-900/20" : "border-slate-700"}`}>
        <div className={`mr-3 ${isProposal ? 'text-sky-400' : 'text-slate-400'}`}>{icon}</div>
        <h3 className="text-xl font-bold text-slate-100">{title}</h3>
      </div>
      <div className="p-6 text-slate-300">
        {children}
      </div>
    </div>
  );
};
