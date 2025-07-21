import KnowledgeModel from "../models/Knowledge.model";
import {
  KnowledgeData,
  KnowledgeSearchQuery,
  KnowledgeContextOptions,
} from "../types/knowledge.types";
import { Document } from "mongoose";

interface IKnowledgeDocument extends Document {
  question: string;
  answer: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class KnowledgeService {
  async uploadFAQ(content: KnowledgeData): Promise<IKnowledgeDocument> {
    const knowledgeEntry = new KnowledgeModel(content);
    return await knowledgeEntry.save();
  }

  async getAllFAQs(): Promise<IKnowledgeDocument[]> {
    return await KnowledgeModel.find();
  }

  async getFAQById(id: string): Promise<IKnowledgeDocument | null> {
    return await KnowledgeModel.findById(id);
  }

  async updateFAQ(
    id: string,
    content: KnowledgeData
  ): Promise<IKnowledgeDocument | null> {
    return await KnowledgeModel.findByIdAndUpdate(id, content, { new: true });
  }

  async deleteFAQ(id: string): Promise<IKnowledgeDocument | null> {
    return await KnowledgeModel.findByIdAndDelete(id);
  }

  async searchFAQs(
    searchQuery: KnowledgeSearchQuery
  ): Promise<IKnowledgeDocument[]> {
    const { query, category, limit = 20 } = searchQuery;

    const searchConditions: any = {
      $or: [
        { question: { $regex: query, $options: "i" } },
        { answer: { $regex: query, $options: "i" } },
      ],
    };

    if (category) {
      searchConditions.category = category;
    }

    return await KnowledgeModel.find(searchConditions).limit(limit);
  }

  async getFAQsByCategory(category: string): Promise<IKnowledgeDocument[]> {
    return await KnowledgeModel.find({ category });
  }

  async getKnowledgeContext(
    options: KnowledgeContextOptions = {}
  ): Promise<string> {
    try {
      const { limit = 10, category, searchQuery } = options;

      let query: any = {};

      if (category) {
        query.category = category;
      }

      if (searchQuery) {
        query.$or = [
          { question: { $regex: searchQuery, $options: "i" } },
          { answer: { $regex: searchQuery, $options: "i" } },
        ];
      }

      const knowledgeItems = await KnowledgeModel.find(query).limit(limit);
      return knowledgeItems
        .map((item) => `Q: ${item.question} A: ${item.answer}`)
        .join("\n");
    } catch (error) {
      console.error("Error fetching knowledge context:", error);
      return "";
    }
  }

  async bulkUploadFAQs(faqs: KnowledgeData[]): Promise<IKnowledgeDocument[]> {
    try {
      const knowledgeEntries = faqs.map((faq) => new KnowledgeModel(faq));
      return await KnowledgeModel.insertMany(knowledgeEntries);
    } catch (error) {
      console.error("Error bulk uploading FAQs:", error);
      throw new Error("Failed to bulk upload FAQs");
    }
  }

  async getKnowledgeStats(): Promise<{
    totalFAQs: number;
    categoryCounts: { [category: string]: number };
  }> {
    try {
      const totalFAQs = await KnowledgeModel.countDocuments();
      const categoryCounts = await KnowledgeModel.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]);

      const categoryCountsObj: { [category: string]: number } = {};
      categoryCounts.forEach((cat) => {
        categoryCountsObj[cat._id || "Uncategorized"] = cat.count;
      });

      return { totalFAQs, categoryCounts: categoryCountsObj };
    } catch (error) {
      console.error("Error fetching knowledge stats:", error);
      throw new Error("Failed to fetch knowledge statistics");
    }
  }
}
