
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

export interface AnalysisResult {
  executiveRealitySummary: string; // 1
  scoreMeaning: { // 2
    overallScore: number;
    detailedScores: DetailedScores;
    classification: '0–40' | '41–70' | '71–85' | '86–100';
    consequences: string;
    notPossible: string;
    commonError: string;
  };
  technicallyRightCommerciallyWrong: string[]; // 3
  seoReality: { // 4
    trafficPotential: string;
    salesPotential: string;
    competitorGap: string;
    marketReality: string;
    quickWins: string[];
  };
  adsReality: { // 5
    targetingVsPersuasion: string;
    messagingScore: number;
    valuePriceBalance: string;
    clickReason: string;
  };
  uxFriction: { // 6
    hesitationPoint: string;
    trustLossPoint: string;
    exitPoint: string;
    expertVerdict: string;
  };
  coreProblem: { // 7
    type: 'Trafik' | 'Güven' | 'Konumlandırma' | 'Mesaj';
    reason: string;
  };
  failureRisk: { // 8
    wastedInvestment: string;
    burningChannel: string;
  };
  actionFramework: ActionFramework; // 9
  expertJudgment: string; // 10
  nextStep: string; // 11
  emailDraft: string; // Additional utility
}

export type AdStatus = 'yes' | 'no' | '';
export type AdQuality = 'zayıf' | 'orta' | 'yüksek' | '';
export type BusinessModel = 'B2B' | 'B2C' | 'SaaS' | 'Lead Gen' | 'E-commerce' | '';

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

export interface TrackingInputs {
    hasPixel: boolean;
    hasAnalytics: boolean;
    hasGTM: boolean;
}
