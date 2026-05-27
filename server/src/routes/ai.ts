import { Router } from 'express';
import { summarize, extendThought, generateEmbeddingKeywords } from '../services/aiService.js';
import { updateInspiration, getInspirationById, parseInspiration } from '../services/inspirationService.js';

export const aiRouter = Router();

// POST /api/ai/summarize
aiRouter.post('/summarize', async (req, res) => {
  const { content } = req.body;
  if (!content) { res.status(400).json({ error: 'Content is required' }); return; }
  const summary = await summarize(content);
  res.json({ summary });
});

// POST /api/ai/extend-thought
aiRouter.post('/extend-thought', async (req, res) => {
  const { content } = req.body;
  if (!content) { res.status(400).json({ error: 'Content is required' }); return; }
  const extended_thoughts = await extendThought(content);
  res.json({ extended_thoughts });
});

// POST /api/ai/process-all — 一键 AI 处理 + 入库
aiRouter.post('/process-all', async (req, res) => {
  const { inspiration_id } = req.body;
  if (!inspiration_id) { res.status(400).json({ error: 'inspiration_id is required' }); return; }

  const inspiration = getInspirationById(inspiration_id);
  if (!inspiration) { res.status(404).json({ error: 'Inspiration not found' }); return; }

  try {
    updateInspiration(inspiration_id, { ai_status: 'processing' });

    const [summary, extended_thoughts, embedding_keywords] = await Promise.all([
      summarize(inspiration.content),
      extendThought(inspiration.content),
      generateEmbeddingKeywords(inspiration.content),
    ]);

    updateInspiration(inspiration_id, {
      summary,
      extended_thoughts: JSON.stringify(extended_thoughts),
      embedding_keywords,
      ai_status: 'done',
    });

    res.json(parseInspiration(getInspirationById(inspiration_id)!));
  } catch (err: any) {
    updateInspiration(inspiration_id, { ai_status: 'error' });
    res.status(500).json({ error: err.message || 'AI processing failed' });
  }
});
