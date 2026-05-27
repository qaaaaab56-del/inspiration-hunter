import { Router } from 'express';
import {
  createInspiration,
  listInspirations,
  getInspirationById,
  deleteInspiration,
  updateInspiration,
  parseInspiration,
} from '../services/inspirationService.js';

export const inspirationsRouter = Router();

// POST /api/inspirations — 创建灵感
inspirationsRouter.post('/', (req, res) => {
  const { content, source } = req.body;

  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    res.status(400).json({ error: 'Content is required' });
    return;
  }

  const inspiration = createInspiration({ content: content.trim(), source });
  res.status(201).json(parseInspiration(inspiration));
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

  if (!inspiration) {
    res.status(404).json({ error: 'Inspiration not found' });
    return;
  }

  res.json(parseInspiration(inspiration));
});

// DELETE /api/inspirations/:id — 删除灵感
inspirationsRouter.delete('/:id', (req, res) => {
  const deleted = deleteInspiration(req.params.id);

  if (!deleted) {
    res.status(404).json({ error: 'Inspiration not found' });
    return;
  }

  res.json({ success: true });
});

// POST /api/inspirations/:id/process — 触发 AI 处理
inspirationsRouter.post('/:id/process', (req, res) => {
  const inspiration = getInspirationById(req.params.id);

  if (!inspiration) {
    res.status(404).json({ error: 'Inspiration not found' });
    return;
  }

  // Mark as processing
  updateInspiration(req.params.id, { ai_status: 'processing' });

  // In MVP, AI processing is handled by external service
  // This endpoint just marks the record and returns
  res.json(parseInspiration(getInspirationById(req.params.id)!));
});
