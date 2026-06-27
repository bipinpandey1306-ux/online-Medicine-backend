import { Router, type IRouter } from "express";
import { useMockDb, HealthTipModel } from "../db";
import { mockHealthTips } from "../db/mockData";
import { ListHealthTipsResponse } from "../api-zod";

const router: IRouter = Router();

router.get("/health-tips", async (_req, res): Promise<void> => {
  if (useMockDb) {
    const formattedTips = mockHealthTips.map(t => ({
      id: t.id,
      title: t.title,
      excerpt: t.summary,
      content: t.content,
      category: t.category,
      imageUrl: t.imageUrl,
      createdAt: t.date
    }));
    res.json(ListHealthTipsResponse.parse(formattedTips));
    return;
  }

  const tips = await HealthTipModel.find().sort({ createdAt: -1 }).limit(6);
  res.json(
    ListHealthTipsResponse.parse(
      tips.map((t: any) => ({
        id: t.id,
        title: t.title,
        excerpt: t.excerpt,
        content: t.content,
        category: t.category,
        imageUrl: t.imageUrl,
        author: t.author,
        createdAt: t.createdAt.toISOString()
      }))
    )
  );
});

export default router;
