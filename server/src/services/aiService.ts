import type { ExtendedThought } from '../types/index.js';

/**
 * AI service stubs. All methods return mock data.
 * Replace with real AI API calls when ready.
 */

export async function generateTitle(content: string): Promise<string> {
  // TODO: Replace with real AI call
  await fakeDelay();
  const keywords = extractMockKeywords(content);
  if (keywords.length >= 2) {
    return `关于${keywords[0]}与${keywords[1]}的思考`;
  }
  return `关于${keywords[0] || '灵感'}的思考`;
}

export async function summarize(content: string): Promise<string> {
  // TODO: Replace with real AI call
  await fakeDelay();
  return `这段内容表达了关于「${content.slice(0, 15)}${content.length > 15 ? '...' : ''}」的想法，可能涉及个人思考、观察或创意发散。`;
}

export async function extractKeywords(content: string): Promise<string[]> {
  // TODO: Replace with real AI call
  await fakeDelay();
  return extractMockKeywords(content);
}

export async function extendThought(content: string): Promise<ExtendedThought[]> {
  // TODO: Replace with real AI call
  await fakeDelay();
  return [
    {
      direction: '深入挖掘',
      content: `从「${content.slice(0, 20)}${content.length > 20 ? '...' : ''}」出发，可以进一步思考这个想法的底层动机和它试图解决的根本问题是什么。`,
    },
    {
      direction: '反向思考',
      content: '如果从完全相反的角度来看这个问题，会得出什么不同的结论？这种对立视角可能揭示隐藏的假设。',
    },
    {
      direction: '实际应用',
      content: '这个想法如果落地到实际场景中，第一步应该是什么？有哪些最小的可行验证方式？',
    },
  ];
}

function extractMockKeywords(content: string): string[] {
  const keywordPool: Record<string, string[]> = {
    树: ['数据结构', '层级', '组织'],
    笔记: ['知识管理', '信息架构', '个人效率'],
    灵感: ['创意', '思维', '联想'],
    设计: ['用户体验', '美学', '交互'],
    代码: ['编程', '架构', '工程'],
    学习: ['认知', '记忆', '方法论'],
    效率: ['工具', '自动化', '工作流'],
    AI: ['人工智能', '智能', '自动化'],
    思考: ['思维', '认知', '逻辑'],
    写作: ['表达', '内容', '创作'],
  };

  const matched: string[] = [];
  for (const [key, values] of Object.entries(keywordPool)) {
    if (content.includes(key)) {
      matched.push(...values);
    }
  }

  if (matched.length === 0) {
    return ['灵感', '创意', '思考'];
  }

  return [...new Set(matched)].slice(0, 5);
}

function fakeDelay(): Promise<void> {
  const ms = 300 + Math.random() * 700;
  return new Promise((resolve) => setTimeout(resolve, ms));
}
