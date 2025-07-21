import axios from "axios";
import environment from "../config/environment";

export class OpenAIService {
  private apiKey: string;
  private apiUrl: string;

  constructor() {
    this.apiKey =
      environment.OPENAI_API_KEY || process.env.OPENAI_API_KEY || "";
    this.apiUrl =
      environment.OPENAI_API_URL ||
      process.env.OPENAI_API_URL ||
      "https://api.openai.com";

    // Validate API key on initialization
    if (!this.apiKey) {
      throw new Error(
        "OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment variables."
      );
    }

    console.log("OpenAI Service initialized with API URL:", this.apiUrl);
    console.log("API Key length:", this.apiKey.length); // Don't log the actual key for security
  }

  public async getResponse(
    prompt: string,
    knowledgeContext?: string
  ): Promise<string> {
    try {
      if (!this.apiKey) {
        throw new Error("OpenAI API key is not configured");
      }

      const systemPrompt = knowledgeContext
        ? `You are a helpful assistant that answers questions based only on the provided knowledge base. If the answer is not in the knowledge base, say "I don't have information about that in my knowledge base." Knowledge base: ${knowledgeContext}`
        : "You are a helpful assistant.";

      console.log(
        "Making request to OpenAI with API key length:",
        this.apiKey.length
      );

      const response = await axios.post(
        `${this.apiUrl}/v1/chat/completions`,
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
          max_tokens: 150,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.choices[0].message.content.trim();
    } catch (error: any) {
      console.error("Error communicating with OpenAI API:", error);

      if (error.response?.status === 401) {
        throw new Error(
          "Invalid OpenAI API key. Please check your OPENAI_API_KEY environment variable."
        );
      } else if (error.response?.status === 429) {
        throw new Error(
          "OpenAI API rate limit exceeded. Please try again later."
        );
      } else if (error.response?.status === 403) {
        throw new Error(
          "OpenAI API access forbidden. Please check your API key permissions."
        );
      } else {
        throw new Error(`Failed to get response from OpenAI: ${error.message}`);
      }
    }
  }
}
