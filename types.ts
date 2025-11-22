
export enum PlatformId {
  WECHAT_VIDEO = 'WECHAT_VIDEO', // 视频号
  XIAOHONGSHU = 'XIAOHONGSHU',   // 小红书
  DOUYIN = 'DOUYIN',             // 抖音
  BILIBILI = 'BILIBILI',         // B站
}

export enum ToneStyle {
  PREMIUM = 'PREMIUM', // 高级
  RELAXED = 'RELAXED', // 轻松
  STORY = 'STORY',     // 故事
  EDUCATIONAL = 'EDUCATIONAL', // 干货
}

export interface GenerationSettings {
  wordCount: 'short' | 'medium' | 'long';
  useEmoji: boolean;
  tagCount: number;
  ctaStrength: 'low' | 'medium' | 'high';
}

export interface CopyData {
  id: string;
  platformId: PlatformId;
  content: string;
  tags: string[];
  analysis: {
    predictedEngagement: string; // e.g., "High", "90%"
  };
}

export type ModelProvider = 'gemini' | 'volcano';

export interface ModelConfig {
  provider: ModelProvider;
  modelId: string;
  apiKey: string;
  baseUrl: string;
  modelName: string;
}

export interface AppState {
  selectedPlatforms: PlatformId[];
  keywords: string;
  selectedStyle: ToneStyle;
  settings: GenerationSettings;
  generatedCopies: Partial<Record<PlatformId, CopyData[]>>; 
  isGenerating: boolean;
  images: string[]; // Array of Base64 strings
  variantCount: number; // 1 to 4
  modelConfig: ModelConfig;
}

export const DEFAULT_SETTINGS: GenerationSettings = {
  wordCount: 'medium',
  useEmoji: true,
  tagCount: 5,
  ctaStrength: 'medium'
};

export const DEFAULT_MODEL_CONFIG: ModelConfig = {
  provider: 'gemini',
  modelId: 'gemini-2.5-flash',
  apiKey: '',
  baseUrl: '',
  modelName: ''
};