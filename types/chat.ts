export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ChatRequest {
  message: string;
  conversationHistory?: Pick<ChatMessage, 'role' | 'content'>[];
}

export interface ChatResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
  sanitizedMessage?: string;
}

export interface SafetyCheckResult {
  safe: boolean;
  reason?: string;
  deflectionResponse?: string;
}
