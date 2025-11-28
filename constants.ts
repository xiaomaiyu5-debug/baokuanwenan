import { PlatformId, ToneStyle } from "./types";
import { MonitorPlay, BookOpen, Video, Tv } from "lucide-react";

export const PLATFORM_CONFIG = {
  [PlatformId.WECHAT_VIDEO]: {
    label: '视频号',
    icon: MonitorPlay,
    maxLength: 90,
    description: '5字钩子开场，短小精悍，结尾强互动。',
    persona: '你是一位视频号创作者，面对的是更广泛的熟人社交圈。你的文案简洁、真诚，善于用一个有力的钩子开头，并以引发情感共鸣或普遍讨论的话题结尾。'
  },
  [PlatformId.XIAOHONGSHU]: {
    label: '小红书',
    icon: BookOpen,
    maxLength: 300,
    description: '情绪共鸣，Emoji 丰富，分点干货。',
    persona: '你是一位资深的小红书博主，擅长以姐妹聊天般的亲切口吻，分享真实、详细的体验和测评。你的内容充满生活气息，善用 Emoji 和热门话题标签来增加吸引力。'
  },
  [PlatformId.DOUYIN]: {
    label: '抖音',
    icon: Video,
    maxLength: 220,
    description: '强冲突开场，黄金 3 秒，强力 CTA。',
    persona: '你是一位抖音爆款视频编剧，深谙“黄金三秒”法则。你的语言风格直接、有冲击力，善于制造悬念和冲突，并在结尾处设计强有力的互动或转化指令。'
  },
  [PlatformId.BILIBILI]: {
    label: 'B站',
    icon: Tv,
    maxLength: 500,
    description: '悬念设定，深度结构化，引导三连。',
    persona: '你是一位 B 站知识区或生活区的 UP 主，说话风趣又不失深度。你习惯用结构化的方式讲解复杂事物，喜欢玩梗，并能自然地引导观众“一键三连”。'
  }
};

export const STYLE_CONFIG = {
  [ToneStyle.PREMIUM]: '高级感',
  [ToneStyle.RELAXED]: '轻松',
  [ToneStyle.STORY]: '故事化',
  [ToneStyle.EDUCATIONAL]: '干货'
};

export const MOCK_IMAGE_PLACEHOLDER = "https://picsum.photos/800/400";