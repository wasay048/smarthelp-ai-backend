import { Router } from "express";
import knowledgeController from "../controllers/knowledge.controller";

const router = Router();

// Upload routes
router.post("/upload", knowledgeController.uploadFAQ.bind(knowledgeController));
router.post(
  "/upload/bulk",
  knowledgeController.uploadBulkFAQ.bind(knowledgeController)
);
router.post(
  "/upload/file",
  knowledgeController.getUploadMiddleware(),
  knowledgeController.uploadFile.bind(knowledgeController)
);

// Stats route (BEFORE /:id route)
router.get(
  "/stats",
  knowledgeController.getKnowledgeStats.bind(knowledgeController)
);

// CRUD routes
router.get("/", knowledgeController.getFAQs.bind(knowledgeController));
router.get("/:id", knowledgeController.getFAQById.bind(knowledgeController));
router.put("/:id", knowledgeController.updateFAQ.bind(knowledgeController));
router.delete("/:id", knowledgeController.deleteFAQ.bind(knowledgeController));

export default router;
