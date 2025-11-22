import { PlatformId, ToneStyle } from "./types";
import { MonitorPlay, BookOpen, Video, Tv } from "lucide-react";

export const PLATFORM_CONFIG = {
  [PlatformId.WECHAT_VIDEO]: {
    label: '视频号',
    icon: MonitorPlay,
    maxLength: 90,
    description: '5字钩子开场，短小精悍，结尾强互动。'
  },
  [PlatformId.XIAOHONGSHU]: {
    label: '小红书',
    icon: BookOpen,
    maxLength: 300,
    description: '情绪共鸣，Emoji 丰富，分点干货。'
  },
  [PlatformId.DOUYIN]: {
    label: '抖音',
    icon: Video,
    maxLength: 220,
    description: '强冲突开场，黄金 3 秒，强力 CTA。'
  },
  [PlatformId.BILIBILI]: {
    label: 'B站',
    icon: Tv,
    maxLength: 500,
    description: '悬念设定，深度结构化，引导三连。'
  }
};

export const STYLE_CONFIG = {
  [ToneStyle.PREMIUM]: '高级感',
  [ToneStyle.RELAXED]: '轻松',
  [ToneStyle.STORY]: '故事化',
  [ToneStyle.EDUCATIONAL]: '干货'
};

export const MOCK_IMAGE_PLACEHOLDER = "https://picsum.photos/800/400";