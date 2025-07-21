export interface KnowledgeData {
  question: string;
  answer: string;
  category?: string;
}

export interface KnowledgeSearchQuery {
  query: string;
  category?: string;
  limit?: number;
}

export interface KnowledgeContextOptions {
  limit?: number;
  category?: string;
  searchQuery?: string;
}

export interface KnowledgeUploadResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export interface BulkUploadData {
  textContent: string;
  category?: string;
}
