
export interface SeoAuditCategory {
  category: string;
  score: number;
  passedChecks: string[];
  failedChecks: string[];
}

export interface SeoAnalysis {
  overallScore: number;
  summary: string;
  audits: SeoAuditCategory[];
  expertSuggestion: string;
}

export interface AdAnalysis {
  strategicAnalysis: string;
}

export interface Competitor {
  name: string;
  analysis: string;
}

export interface CompetitorAnalysis {
  competitors: Competitor[];
}

export interface ProposedService {
  serviceName: string;
  description: string;
}

export interface ServiceProposal {
  introduction: string;
  proposedServices: ProposedService[];
  conclusion: string;
}

export interface AnalysisResult {
  siteSummary: string;
  seoAnalysis: SeoAnalysis;
  adAnalysis: AdAnalysis;
  competitorAnalysis: CompetitorAnalysis;
  serviceProposal: ServiceProposal;
}

// New types for user-provided ad inputs
export type AdStatus = 'yes' | 'no' | '';
export type AdQuality = 'zayıf' | 'orta' | 'yüksek' | '';

export interface AdPlatformInput {
  runsAds: AdStatus;
  quality: AdQuality;
}

export interface AdInputs {
  meta: AdPlatformInput;
  google: AdPlatformInput;
  linkedin: AdPlatformInput;
  tiktok: AdPlatformInput;
}
