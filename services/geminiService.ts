
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PlatformId, ToneStyle, GenerationSettings, ModelConfig } from "../types";

// Gemini Schema
const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    results: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          platformId: { type: Type.STRING, enum: Object.values(PlatformId) },
          versions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                content: { type: Type.STRING },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } },
                engagementScore: { type: Type.STRING }
              },
              required: ['content', 'tags', 'engagementScore']
            }
          }
        },
        required: ['platformId', 'versions']
      }
    }
  },
  required: ['results']
};

// Main Entry Point
export const generateCopy = async (
  platforms: PlatformId[],
  keywords: string,
  style: ToneStyle,
  settings: GenerationSettings,
  images: string[], 
  variantCount: number = 1,
  modelConfig: ModelConfig
) => {
  const apiKey = modelConfig.apiKey;
  if (!apiKey) {
    throw new Error("未检测到 API Key，请在右上角「模型配置」中填写。");
  }

  if (modelConfig.provider === 'volcano') {
    return generateVolcanoCopy(platforms, keywords, style, settings, images, variantCount, modelConfig);
  } else {
    return generateGeminiCopy(platforms, keywords, style, settings, images, variantCount, modelConfig);
  }
};

// Google Gemini Implementation
const generateGeminiCopy = async (
  platforms: PlatformId[],
  keywords: string,
  style: ToneStyle,
  settings: GenerationSettings,
  images: string[], 
  variantCount: number,
  modelConfig: ModelConfig
) => {
  const ai = new GoogleGenAI(modelConfig.apiKey);
  const model = ai.getGenerativeModel({ model: modelConfig.modelId || 'gemini-2.5-flash' });

  const systemPrompt = buildSystemPrompt(style, settings, variantCount);
  const userPrompt = buildUserPrompt(platforms, keywords, variantCount, images);

  const parts: any[] = [];
  if (images && images.length > 0) {
    images.forEach(img => {
      const matches = img.match(/^data:(.+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        parts.push({ inlineData: { mimeType: matches[1], data: matches[2] } });
      }
    });
  }
  parts.push({ text: userPrompt });

  const contents = [
    { role: 'system', parts: [{ text: systemPrompt }] },
    { role: 'user', parts: parts }
  ];

  try {
    const result = await model.generateContent({ 
      contents: contents,
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
        temperature: 0.7,
        topP: 0.85,
        maxOutputTokens: 8192,
      }
    });
    const response = result.response;
    const responseText = response.text();
    return responseText ? JSON.parse(responseText) : null;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

// Volcano Engine (OpenAI Compatible) Implementation
const generateVolcanoCopy = async (
  platforms: PlatformId[],
  keywords: string,
  style: ToneStyle,
  settings: GenerationSettings,
  images: string[], 
  variantCount: number,
  modelConfig: ModelConfig
) => {
  // Volcano defaults to a specific endpoint if not provided, usually: https://ark.cn-beijing.volces.com/api/v3
  const baseUrl = modelConfig.baseUrl || "https://ark.cn-beijing.volces.com/api/v3";
  const endpoint = `${baseUrl.replace(/\/+$/, '')}/chat/completions`;
  
  const systemPrompt = buildSystemPrompt(style, settings, variantCount) + `
    \n\nIMPORTANT: You MUST output strictly valid JSON matching this structure, do not include markdown code fences:
    {
      "results": [
        {
          "platformId": "PLATFORM_ENUM",
          "versions": [
            { "content": "text...", "tags": ["tag1"], "engagementScore": "90/100" }
          ]
        }
      ]
    }
  `;

  const userPrompt = buildUserPrompt(platforms, keywords, variantCount, images);

  const messages: any[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: [] } // Content array for multimodal
  ];

  // Add Text
  messages[1].content.push({ type: "text", text: userPrompt });

  // Add Images (OpenAI format)
  if (images && images.length > 0) {
    images.forEach(img => {
      messages[1].content.push({
        type: "image_url",
        image_url: { url: img }
      });
    });
  }

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${modelConfig.apiKey}`
      },
      body: JSON.stringify({
        model: modelConfig.modelId, // This is the Endpoint ID for Volcano
        messages: messages,
        temperature: 0.7,
        max_tokens: 4096, 
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Volcano API Error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const contentStr = data.choices?.[0]?.message?.content;

    if (!contentStr) throw new Error("No content received from Volcano API");

    // Clean markdown fences if present
    const cleanedJson = contentStr.replace(/```json\n?|```/g, '').trim();
    return JSON.parse(cleanedJson);

  } catch (error) {
    console.error("Volcano API Error:", error);
    throw error;
  }
};

// Shared Prompt Builders
const buildSystemPrompt = (style: ToneStyle, settings: GenerationSettings, variantCount: number) => `
    **核心指令：你必须只使用简体中文进行回复。**

    你是一位专业的病毒式文案写作总监 (Gemini3)。
    请严格遵守以下针对所选平台的规则，生成社交媒体文案。
    
    **风格:** ${style}
    **设置:**
    - 表情符号使用: ${settings.useEmoji ? '使用相关表情' : '最少/不使用'}
    - 行动号召强度: ${settings.ctaStrength}
    - 标签数量: 大约 ${settings.tagCount} 个

    **平台特定规则:**
    1. **微信视频号**: 最多90字。以一个5字以内的标题开头。口语化语气。3个精确标签。以一个互动性问题结尾。
    2. **小红书**: 最多300字。第一句：情感共鸣 + 表情符号。正文：3行“干货”内容。结尾：${settings.tagCount}个标签 + “收藏/保存”行动号召。
    3. **抖音**: 最多220字。前三分之一：强烈的冲突或对比。中间部分：“3秒知识点”。结尾：强烈的行动号召（点赞 + 关注）。
    4. **B站**: 最多500字。开头：15字的悬念设置。正文：使用数字列表“①②③”。结尾：引导弹幕互动 + 点赞/投币/收藏。

    **约束条件:**
    - 如果提供了图片，请深入分析它们（视觉细节、颜色、情绪）并将其内容融入文案中。
    - 禁用词：不得违反广告法（例如，“最佳”、“第一”）。
    - **关键:** 为每个选定的平台提供恰好 ${variantCount} 个不同的文案版本。
    - 为每个版本提供一个预测的互动分数（例如，“92/100”）。
`;

const buildUserPrompt = (platforms: PlatformId[], keywords: string, variantCount: number, images: string[]) => `
    **Product/Topic:** ${keywords}
    **Target Platforms:** ${platforms.join(', ')}
    **Required Variants:** ${variantCount}
    **Attached Images:** ${images.length} image(s) provided.
`;
