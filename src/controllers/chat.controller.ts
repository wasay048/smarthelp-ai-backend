import { Request, Response } from "express";
import { ChatService } from "../services/chat.service";

export class ChatController {
  private chatService: ChatService;

  constructor() {
    this.chatService = new ChatService();
  }

  public async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const { userId, message } = req.body;

      // Save the chat message
      const chatLog = await this.chatService.saveMessage(userId, message);

      // Get response from chat service (which uses OpenAI with knowledge context)
      const response = await this.chatService.generateResponse(message);

      // Send response back to the client
      res.status(200).json({
        success: true,
        chatLog,
        response,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error processing your request",
        error: (error as Error).message,
      });
    }
  }

  public async getChatHistory(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;

      // Retrieve chat history for the user
      const history = await this.chatService.getChatHistory(userId);

      res.status(200).json({
        success: true,
        history,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving chat history",
        error: (error as Error).message,
      });
    }
  }
}
