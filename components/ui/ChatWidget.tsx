'use client';

import { useState, useCallback } from 'react';
import { ChatMessage, ChatRequest, ChatResponse } from '@/types/chat';
import ChatButton from './ChatButton';
import ChatWindow from './ChatWindow';

// Generate unique ID for messages
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Initial welcome message
const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: "Hello! I'm SASA AI, your virtual assistant. I can help you learn about our sales operations services, career opportunities, or answer questions about SASA Worldwide. What would you like to know?",
  timestamp: new Date(),
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Prepare conversation history (exclude welcome message for cleaner context)
      const conversationHistory = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      // Call chat API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          conversationHistory,
        } as ChatRequest),
      });

      const data: ChatResponse = await response.json();

      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: data.success
          ? data.message || "I'm here to help. What would you like to know about SASA Worldwide?"
          : data.error || "I'm having trouble right now. Please try again or contact us at info@sasa-worldwide.com.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);

      // Add error message
      const errorMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: "I'm having trouble connecting right now. Please try again or contact us directly at info@sasa-worldwide.com or +971 4 584 3777.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  return (
    <>
      {/* Chat Window */}
      <div
        className={`fixed z-50 transition-all duration-300 ease-out ${
          isOpen
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none'
        }`}
        style={{
          bottom: '100px',
          right: '24px',
          width: 'min(380px, calc(100vw - 48px))',
          height: 'min(500px, calc(100vh - 140px))',
        }}
      >
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          onSendMessage={handleSendMessage}
          onClose={handleClose}
        />
      </div>

      {/* Chat Button - positioned above WhatsApp button */}
      <div className="fixed bottom-24 right-6 z-50">
        {!isOpen && (
          <ChatButton onClick={handleToggle} />
        )}
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={handleClose}
        />
      )}
    </>
  );
}
