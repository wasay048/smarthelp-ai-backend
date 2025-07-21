import Chat from "../models/Chat.model";
import KnowledgeModel from "../models/Knowledge.model";
import { OpenAIService } from "./openai.service";
import { Document } from "mongoose";

interface IChatDocument extends Document {
  userId: string;
  message: string;
  timestamp: Date;
}

export class ChatService {
  private openAIService: OpenAIService;

  constructor() {
    this.openAIService = new OpenAIService();
  }

  async saveMessage(userId: string, message: string): Promise<IChatDocument> {
    const chatMessage = new Chat({
      userId,
      message,
      timestamp: new Date(),
    });
    return await chatMessage.save();
  }

  async getChatHistory(userId: string): Promise<IChatDocument[]> {
    return await Chat.find({ userId }).sort({ timestamp: -1 });
  }

  async generateResponse(
    userMessage: string,
    context?: string
  ): Promise<string> {
    const knowledgeContext = context || (await this.getKnowledgeContext());
    console.log("🚀 ~ ChatService ~ knowledgeContext:", knowledgeContext)
    const response = await this.openAIService.getResponse(
      userMessage,
      knowledgeContext
    );
    return response;
  }

  private async getKnowledgeContext(): Promise<string> {
    try {
      const knowledgeItems = await KnowledgeModel.find().limit(10);
      return knowledgeItems
        .map((item) => `Q: ${item.question} A: ${item.answer}`)
        .join("\n");
    } catch (error) {
      console.error("Error fetching knowledge context:", error);
      return "";
    }
  }
}
