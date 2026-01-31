'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import { ChatMessage as ChatMessageType } from '@/types/chat';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

interface ChatWindowProps {
  messages: ChatMessageType[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onClose: () => void;
  embedded?: boolean;
}

export default function ChatWindow({
  messages,
  isLoading,
  onSendMessage,
  onClose,
  embedded = false,
}: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // When embedded, only show messages area and input (header is in parent)
  if (embedded) {
    return (
      <div className="flex flex-col h-full">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/30">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && (
            <div className="flex justify-start mb-3">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white border border-gray-100 p-0.5 shadow-sm flex-shrink-0">
                  <Image
                    src="/images/logo/sasa-logo-color.png"
                    alt="SASA"
                    width={28}
                    height={28}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white border border-gray-100 shadow-sm">
                  <div className="flex gap-1.5">
                    <span className="w-2 h-2 bg-navy/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-2 h-2 bg-navy/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-2 h-2 bg-navy/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-100 bg-white">
          <ChatInput
            onSend={onSendMessage}
            disabled={isLoading}
            placeholder="Type your message..."
          />
        </div>
      </div>
    );
  }

  // Full standalone version with header
  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-navy text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white p-1 shadow-md">
            <Image
              src="/images/logo/sasa-logo-color.png"
              alt="SASA"
              width={36}
              height={36}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h3 className="font-semibold text-sm">SASA AI Assistant</h3>
            <p className="text-xs text-white/70">Here to help you</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
          aria-label="Close chat"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {isLoading && (
          <div className="flex justify-start mb-3">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white border border-gray-100 p-0.5 shadow-sm flex-shrink-0">
                <Image
                  src="/images/logo/sasa-logo-color.png"
                  alt="SASA"
                  width={28}
                  height={28}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white border border-gray-100 shadow-sm">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-navy/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-navy/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-navy/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <ChatInput
        onSend={onSendMessage}
        disabled={isLoading}
        placeholder="Ask about our services, careers..."
      />

      {/* Footer */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
        <p className="text-xs text-gray-400 text-center">
          Powered by SASA AI | <a href="/contact" className="hover:text-navy transition-colors">Contact us</a> for more help
        </p>
      </div>
    </div>
  );
}
