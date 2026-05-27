import { Router } from 'express';
import { generateTitle, summarize, extractKeywords, extendThought } from '../services/aiService.js';
import { updateInspiration, getInspirationById, parseInspiration } from '../services/inspirationService.js';

export const aiRouter = Router();

// POST /api/ai/summarize
aiRouter.post('/summarize', async (req, res) => {
  const { content } = req.body;
  if (!content) {
    res.status(400).json({ error: 'Content is required' });
    return;
  }
  const summary = await summarize(content);
  res.json({ summary });
});

// POST /api/ai/generate-title
aiRouter.post('/generate-title', async (req, res) => {
  const { content } = req.body;
  if (!content) {
    res.status(400).json({ error: 'Content is required' });
    return;
  }
  const title = await generateTitle(content);
  res.json({ title });
});

// POST /api/ai/extract-keywords
aiRouter.post('/extract-keywords', async (req, res) => {
  const { content } = req.body;
  if (!content) {
    res.status(400).json({ error: 'Content is required' });
    return;
  }
  const keywords = await extractKeywords(content);
  res.json({ keywords });
});

// POST /api/ai/extend-thought
aiRouter.post('/extend-thought', async (req, res) => {
  const { content } = req.body;
  if (!content) {
    res.status(400).json({ error: 'Content is required' });
    return;
  }
  const extended_thoughts = await extendThought(content);
  res.json({ extended_thoughts });
});

// POST /api/ai/process-all — 一键触发所有 AI 处理并保存到数据库
aiRouter.post('/process-all', async (req, res) => {
  const { inspiration_id } = req.body;
  if (!inspiration_id) {
    res.status(400).json({ error: 'inspiration_id is required' });
    return;
  }

  const inspiration = getInspirationById(inspiration_id);
  if (!inspiration) {
    res.status(404).json({ error: 'Inspiration not found' });
    return;
  }

  try {
    updateInspiration(inspiration_id, { ai_status: 'processing' });

    const [title, summary, keywords, extended_thoughts] = await Promise.all([
      generateTitle(inspiration.content),
      summarize(inspiration.content),
      extractKeywords(inspiration.content),
      extendThought(inspiration.content),
    ]);

    updateInspiration(inspiration_id, {
      title,
      summary,
      keywords: JSON.stringify(keywords),
      extended_thoughts: JSON.stringify(extended_thoughts),
      ai_status: 'done',
    });

    const updated = getInspirationById(inspiration_id)!;
    res.json(parseInspiration(updated));
  } catch (err) {
    updateInspiration(inspiration_id, { ai_status: 'error' });
    res.status(500).json({ error: 'AI processing failed' });
  }
});
