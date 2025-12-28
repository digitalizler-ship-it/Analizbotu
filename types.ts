
export interface ActionFramework {
  day0_30: { task: string; impact: string }[];
  day30_60: { task: string; impact: string }[];
  day60_90: { task: string; impact: string }[];
}

export interface DetailedScores {
  seo: number;
  ads: number;
  ux: number;
  brand: number;
  growth: number;
}

// Fix: Updated AnalysisResult interface to match the high-fidelity structure returned by Gemini API
export interface AnalysisResult {
  executiveRealitySummary: string;
  scoreMeaning: {
    overallScore: number;
    detailedScores: DetailedScores;
    classification: '0–40' | '41–70' | '71–85' | '86–100';
    consequences: string;
    notPossible: string;
    commonError: string;
  };
  technicallyRightCommerciallyWrong: string[];
  seoReality: {
    trafficPotential: string;
    salesPotential: string;
    competitorGap: string;
    marketReality: string;
    quickWins: string[];
  };
  adsReality: {
    targetingVsPersuasion: string;
    messagingScore: number;
    valuePriceBalance: string;
    clickReason: string;
  };
  uxFriction: {
    hesitationPoint: string;
    trustLossPoint: string;
    exitPoint: string;
    expertVerdict: string;
  };
  coreProblem: {
    type: 'Trafik' | 'Güven' | 'Konumlandırma' | 'Mesaj';
    reason: string;
  };
  failureRisk: {
    wastedInvestment: string;
    burningChannel: string;
  };
  actionFramework: ActionFramework;
  expertJudgment: string;
  nextStep: string;
  emailDraft: string;
}

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

export type BusinessModel = 'B2B' | 'B2C' | 'SaaS' | 'Lead Gen' | 'E-commerce' | '';

export interface TrackingInputs {
    hasPixel: boolean;
    hasAnalytics: boolean;
    hasGTM: boolean;
}
