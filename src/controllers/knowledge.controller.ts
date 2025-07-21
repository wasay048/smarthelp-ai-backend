import { Request, Response } from "express";
import { KnowledgeService } from "../services/knowledge.service";
import multer from "multer";
import { KnowledgeData } from "../types/knowledge.types";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

class KnowledgeController {
  private knowledgeService: KnowledgeService;

  constructor() {
    this.knowledgeService = new KnowledgeService();
  }

  // Single FAQ upload
  async uploadFAQ(req: Request, res: Response) {
    try {
      const { question, answer, category } = req.body;

      // Validate required fields
      if (!question || !answer) {
        return res.status(400).json({
          success: false,
          message: "Question and answer are required",
        });
      }

      const faqData: KnowledgeData = {
        question: question.trim(),
        answer: answer.trim(),
        category: category?.trim() || "General",
      };

      const newKnowledge = await this.knowledgeService.uploadFAQ(faqData);

      res.status(201).json({
        success: true,
        message: "FAQ uploaded successfully",
        data: newKnowledge,
      });
    } catch (error) {
      console.error("Error uploading FAQ:", error);
      res.status(500).json({
        success: false,
        message: "Error uploading FAQ",
        error: (error as Error).message,
      });
    }
  }

  // Bulk FAQ upload from text content
  async uploadBulkFAQ(req: Request, res: Response) {
    try {
      const { textContent, category } = req.body;

      if (!textContent) {
        return res.status(400).json({
          success: false,
          message: "Text content is required",
        });
      }

      const faqs = this.parseTextToFAQs(textContent, category);

      if (faqs.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No valid FAQ pairs found in the text content",
        });
      }

      const uploadedFAQs = await this.knowledgeService.bulkUploadFAQs(faqs);

      res.status(201).json({
        success: true,
        message: `Successfully uploaded ${uploadedFAQs.length} FAQs`,
        data: {
          count: uploadedFAQs.length,
          faqs: uploadedFAQs,
        },
      });
    } catch (error) {
      console.error("Error bulk uploading FAQs:", error);
      res.status(500).json({
        success: false,
        message: "Error bulk uploading FAQs",
        error: (error as Error).message,
      });
    }
  }

  // File upload handler
  async uploadFile(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      const fileContent = req.file.buffer.toString("utf-8");
      const category = req.body.category || "General";

      const faqs = this.parseTextToFAQs(fileContent, category);

      if (faqs.length === 0) {
        return res.status(400).json({
          success: false,
          message: "No valid FAQ pairs found in the uploaded file",
        });
      }

      const uploadedFAQs = await this.knowledgeService.bulkUploadFAQs(faqs);

      res.status(201).json({
        success: true,
        message: `Successfully uploaded ${uploadedFAQs.length} FAQs from file`,
        data: {
          filename: req.file.originalname,
          count: uploadedFAQs.length,
          faqs: uploadedFAQs,
        },
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({
        success: false,
        message: "Error processing uploaded file",
        error: (error as Error).message,
      });
    }
  }

  // Parse text content to FAQs
  private parseTextToFAQs(
    textContent: string,
    defaultCategory: string = "General"
  ): KnowledgeData[] {
    const faqs: KnowledgeData[] = [];
    const lines = textContent.split("\n");

    let currentQuestion = "";
    let currentAnswer = "";
    let category = defaultCategory;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) continue;

      // Check for numbered FAQ format (e.g., "1. Q: What is MongoDB?")
      const numberedQMatch = line.match(/^\d+\.\s*Q:\s*(.+)$/);
      if (numberedQMatch) {
        // Save previous FAQ if exists
        if (currentQuestion && currentAnswer) {
          faqs.push({
            question: currentQuestion.trim(),
            answer: currentAnswer.trim(),
            category: category,
          });
        }

        currentQuestion = numberedQMatch[1];
        currentAnswer = "";
        continue;
      }

      // Check for answer format (e.g., "   A: MongoDB is a NoSQL...")
      const answerMatch = line.match(/^\s*A:\s*(.+)$/);
      if (answerMatch) {
        currentAnswer = answerMatch[1];
        continue;
      }

      // Check for simple Q: format
      const questionMatch = line.match(/^Q:\s*(.+)$/);
      if (questionMatch) {
        // Save previous FAQ if exists
        if (currentQuestion && currentAnswer) {
          faqs.push({
            question: currentQuestion.trim(),
            answer: currentAnswer.trim(),
            category: category,
          });
        }

        currentQuestion = questionMatch[1];
        currentAnswer = "";
        continue;
      }

      // Check for simple A: format
      const simpleAnswerMatch = line.match(/^A:\s*(.+)$/);
      if (simpleAnswerMatch) {
        currentAnswer = simpleAnswerMatch[1];
        continue;
      }

      // If we have a question but no answer pattern matched, treat line as continuation of answer
      if (
        currentQuestion &&
        line &&
        !line.startsWith("Q:") &&
        !line.match(/^\d+\./)
      ) {
        if (currentAnswer) {
          currentAnswer += " " + line;
        } else {
          currentAnswer = line;
        }
      }
    }

    // Add the last FAQ
    if (currentQuestion && currentAnswer) {
      faqs.push({
        question: currentQuestion.trim(),
        answer: currentAnswer.trim(),
        category: category,
      });
    }

    return faqs;
  }

  async getFAQs(req: Request, res: Response) {
    try {
      const { category, search, limit } = req.query;

      let faqs;

      if (search) {
        faqs = await this.knowledgeService.searchFAQs({
          query: search as string,
          category: category as string,
          limit: parseInt(limit as string) || 20,
        });
      } else if (category) {
        faqs = await this.knowledgeService.getFAQsByCategory(
          category as string
        );
      } else {
        faqs = await this.knowledgeService.getAllFAQs();
      }

      res.status(200).json({
        success: true,
        data: faqs,
        count: faqs.length,
      });
    } catch (error) {
      console.error("Error retrieving FAQs:", error);
      res.status(500).json({
        success: false,
        message: "Error retrieving FAQs",
        error: (error as Error).message,
      });
    }
  }

  async getFAQById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const faq = await this.knowledgeService.getFAQById(id);

      if (!faq) {
        return res.status(404).json({
          success: false,
          message: "FAQ not found",
        });
      }

      res.status(200).json({
        success: true,
        data: faq,
      });
    } catch (error) {
      console.error("Error retrieving FAQ:", error);
      res.status(500).json({
        success: false,
        message: "Error retrieving FAQ",
        error: (error as Error).message,
      });
    }
  }

  async updateFAQ(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { question, answer, category } = req.body;

      if (!question || !answer) {
        return res.status(400).json({
          success: false,
          message: "Question and answer are required",
        });
      }

      const updatedFAQ = await this.knowledgeService.updateFAQ(id, {
        question: question.trim(),
        answer: answer.trim(),
        category: category?.trim() || "General",
      });

      if (!updatedFAQ) {
        return res.status(404).json({
          success: false,
          message: "FAQ not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "FAQ updated successfully",
        data: updatedFAQ,
      });
    } catch (error) {
      console.error("Error updating FAQ:", error);
      res.status(500).json({
        success: false,
        message: "Error updating FAQ",
        error: (error as Error).message,
      });
    }
  }

  async deleteFAQ(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const deletedFAQ = await this.knowledgeService.deleteFAQ(id);

      if (!deletedFAQ) {
        return res.status(404).json({
          success: false,
          message: "FAQ not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "FAQ deleted successfully",
        data: deletedFAQ,
      });
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      res.status(500).json({
        success: false,
        message: "Error deleting FAQ",
        error: (error as Error).message,
      });
    }
  }

  async getKnowledgeStats(req: Request, res: Response) {
    try {
      const stats = await this.knowledgeService.getKnowledgeStats();
      res.status(200).json({
        success: true,
        data: stats,
      });
    } catch (error) {
      console.error("Error retrieving knowledge stats:", error);
      res.status(500).json({
        success: false,
        message: "Error retrieving knowledge statistics",
        error: (error as Error).message,
      });
    }
  }

  // Method to get upload middleware
  getUploadMiddleware() {
    return upload.single("file");
  }
}

export default new KnowledgeController();
