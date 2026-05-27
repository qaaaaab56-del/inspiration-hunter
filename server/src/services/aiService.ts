import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });
import type { ExtendedThought } from '../types/index.js';

const API_KEY = process.env.DEEPSEEK_API_KEY || '';
const BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1';
const MODEL = 'deepseek-chat';

async function chat(prompt: string): Promise<string> {
  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: '你是一个帮助用户整理和延展灵感的助手。回复简洁、有洞察力。' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`DeepSeek API error ${res.status}: ${err}`);
  }

  const data = await res.json() as any;
  return data.choices[0].message.content.trim();
}

export async function summarize(content: string): Promise<string> {
  const prompt = `请用1-2句话总结以下想法，直接返回总结内容，不要加"总结："之类的前缀：

"${content}"`;

  return await chat(prompt);
}

export async function extendThought(content: string): Promise<ExtendedThought[]> {
  const prompt = `请基于以下想法，给出3个可以继续思考的方向。严格返回JSON数组格式，不要加任何其他文字：
[{"direction": "方向名称", "content": "该方向的具体延展内容"}]

想法："${content}"`;

  const text = await chat(prompt);
  // DeepSeek might wrap the JSON in markdown code blocks, strip them
  const json = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
  return JSON.parse(json);
}

export async function generateEmbeddingKeywords(content: string): Promise<string> {
  const prompt = `请提取以下想法的5-10个关键概念，用逗号分隔返回，不要加其他文字：

"${content}"`;

  return await chat(prompt);
}
