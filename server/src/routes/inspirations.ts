import { Router } from 'express';
import {
  createInspiration,
  listInspirations,
  getInspirationById,
  deleteInspiration,
  searchInspirations,
  getSimilarInspirations,
  parseInspiration,
  updateInspiration,
} from '../services/inspirationService.js';
import { summarize, extendThought, generateEmbeddingKeywords } from '../services/aiService.js';

export const inspirationsRouter = Router();

// POST /api/inspirations — 创建灵感 + 自动触发 AI 处理
inspirationsRouter.post('/', async (req, res) => {
  const { content, source } = req.body;

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    res.status(400).json({ error: 'Content is required' });
    return;
  }

  const inspiration = createInspiration({ content: content.trim(), source });
  updateInspiration(inspiration.id, { ai_status: 'processing' });

  try {
    const [s, e, kw] = await Promise.all([
      summarize(inspiration.content),
      extendThought(inspiration.content),
      generateEmbeddingKeywords(inspiration.content),
    ]);
    const updated = updateInspiration(inspiration.id, {
      summary: s,
      extended_thoughts: JSON.stringify(e),
      embedding_keywords: kw,
      ai_status: 'done',
    });
    res.status(201).json(parseInspiration(updated!));
  } catch {
    updateInspiration(inspiration.id, { ai_status: 'error' });
    // Still return the inspiration so the client can show error state
    const failed = getInspirationById(inspiration.id)!;
    res.status(201).json(parseInspiration(failed));
  }
});

// GET /api/inspirations/search?q=xxx — 语义搜索（必须在 /:id 之前）
inspirationsRouter.get('/search', (req, res) => {
  const q = (req.query.q as string) || '';
  const results = searchInspirations(q);
  res.json({ data: results, query: q });
});

// GET /api/inspirations — 灵感列表
inspirationsRouter.get('/', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const offset = parseInt(req.query.offset as string) || 0;
  const result = listInspirations({ limit, offset });
  res.json(result);
});

// GET /api/inspirations/:id — 单条详情
inspirationsRouter.get('/:id', (req, res) => {
  const inspiration = getInspirationById(req.params.id);
  if (!inspiration) { res.status(404).json({ error: 'Inspiration not found' }); return; }
  res.json(parseInspiration(inspiration));
});

// GET /api/inspirations/:id/similar — 相似灵感
inspirationsRouter.get('/:id/similar', (req, res) => {
  const inspiration = getInspirationById(req.params.id);
  if (!inspiration) { res.status(404).json({ error: 'Inspiration not found' }); return; }
  const similar = getSimilarInspirations(req.params.id);
  res.json({ data: similar });
});

// DELETE /api/inspirations/:id — 删除灵感
inspirationsRouter.delete('/:id', (req, res) => {
  const deleted = deleteInspiration(req.params.id);
  if (!deleted) { res.status(404).json({ error: 'Inspiration not found' }); return; }
  res.json({ success: true });
});
