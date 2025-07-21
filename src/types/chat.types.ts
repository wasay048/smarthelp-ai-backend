export interface ChatMessage {
    userId: string;
    message: string;
    timestamp: Date;
}

export interface ChatSession {
    sessionId: string;
    userId: string;
    messages: ChatMessage[];
    createdAt: Date;
    updatedAt: Date;
}

export interface ChatResponse {
    sessionId: string;
    response: string;
    timestamp: Date;
}