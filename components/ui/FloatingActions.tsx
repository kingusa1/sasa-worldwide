'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { ChatMessage, ChatRequest, ChatResponse } from '@/types/chat';
import ChatWindow from './ChatWindow';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content: "Hello! I'm SASA AI, your virtual assistant. I can help you learn about our sales operations services, career opportunities, or answer questions about SASA Worldwide. What would you like to know?",
  timestamp: new Date(),
};

type ViewState = 'closed' | 'menu' | 'chat';

export default function FloatingActions() {
  const [viewState, setViewState] = useState<ViewState>('closed');
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);

  const handleButtonClick = useCallback(() => {
    setViewState((prev) => (prev === 'closed' ? 'menu' : 'closed'));
  }, []);

  const handleOpenChat = useCallback(() => {
    setViewState('chat');
  }, []);

  const handleClose = useCallback(() => {
    setViewState('closed');
  }, []);

  const handleSendMessage = useCallback(async (content: string) => {
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const conversationHistory = messages
        .filter((m) => m.id !== 'welcome')
        .map((m) => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          conversationHistory,
        } as ChatRequest),
      });

      const data: ChatResponse = await response.json();

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: data.success
          ? data.message || "I'm here to help. What would you like to know about SASA Worldwide?"
          : data.error || "I'm having trouble right now. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: "I'm having trouble connecting. Please try again or contact us at info@sasa-worldwide.com.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, [messages]);

  return (
    <>
      {/* Choice Menu - appears when button is clicked */}
      <div
        className={`fixed z-50 transition-all duration-300 ease-out ${
          viewState === 'menu'
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none'
        } bottom-20 sm:bottom-24 right-4 sm:right-6 left-4 sm:left-auto`}
      >
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden w-full sm:w-72 sm:ml-auto">
          {/* Header */}
          <div className="bg-gradient-to-r from-navy to-navy/90 px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white p-1 shadow-md flex-shrink-0">
                <Image
                  src="/images/logo/sasa-logo-color.png"
                  alt="SASA"
                  width={36}
                  height={36}
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">SASA Worldwide</h3>
                <p className="text-xs text-white/70">How can we help?</p>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="p-3 space-y-2">
            <button
              onClick={handleOpenChat}
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-navy/5 active:bg-navy/10 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-navy/10 flex items-center justify-center group-hover:bg-navy/20 transition-colors flex-shrink-0">
                <svg className="w-5 h-5 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                </svg>
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm">AI Assistant</p>
                <p className="text-xs text-gray-500">Chat with SASA AI</p>
              </div>
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <a
              href="https://wa.me/971545304000"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-[#25D366]/10 active:bg-[#25D366]/20 transition-colors group"
            >
              <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center group-hover:bg-[#25D366]/20 transition-colors flex-shrink-0">
                <svg className="w-5 h-5 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm">WhatsApp</p>
                <p className="text-xs text-gray-500">Message us directly</p>
              </div>
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Chat Window - opens when AI Assistant is selected */}
      {/* Mobile: full screen with safe area | Desktop: fixed size panel */}
      <div
        className={`fixed z-50 transition-all duration-500 ease-out ${
          viewState === 'chat'
            ? 'opacity-100 scale-100 pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none'
        } inset-0 sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[380px] sm:h-[520px]`}
      >
        <div className="h-full bg-white sm:rounded-3xl shadow-2xl overflow-hidden border-0 sm:border sm:border-gray-100 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-navy to-navy/90 px-4 sm:px-5 py-3 sm:py-4 safe-area-top">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white p-1 shadow-md flex-shrink-0">
                  <Image
                    src="/images/logo/sasa-logo-color.png"
                    alt="SASA"
                    width={40}
                    height={40}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm">SASA AI Assistant</h3>
                  <p className="text-xs text-white/70">How can we help you?</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="w-9 h-9 sm:w-8 sm:h-8 flex items-center justify-center rounded-full hover:bg-white/10 active:bg-white/20 transition-colors text-white/80 hover:text-white"
                aria-label="Close"
              >
                <svg className="w-6 h-6 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Chat Content */}
          <div className="flex-1 overflow-hidden">
            <ChatWindow
              messages={messages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
              onClose={handleClose}
              embedded={true}
            />
          </div>
        </div>
      </div>

      {/* Single Floating Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <button
          onClick={handleButtonClick}
          className="group relative transition-all duration-300"
          aria-label={viewState === 'closed' ? 'Open help menu' : 'Close menu'}
        >
          {/* Outer glow ring - only when closed */}
          {viewState === 'closed' && (
            <span className="absolute inset-0 rounded-full bg-navy/30 animate-ping"></span>
          )}

          {/* Button container */}
          <div className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group-hover:scale-105 active:scale-95 ${
            viewState === 'closed'
              ? 'bg-gradient-to-br from-navy to-navy/80'
              : 'bg-gray-100'
          }`}>
            {/* Inner border */}
            <div className={`absolute inset-1 rounded-full border ${
              viewState === 'closed' ? 'border-white/20' : 'border-gray-200'
            }`}></div>

            {viewState === 'closed' ? (
              <>
                {/* Logo */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white p-1 sm:p-1.5 shadow-inner">
                  <Image
                    src="/images/logo/sasa-logo-color.png"
                    alt="SASA"
                    width={32}
                    height={32}
                    className="w-full h-full object-contain"
                  />
                </div>
                {/* Online indicator */}
                <span className="absolute bottom-0.5 right-0.5 sm:bottom-1 sm:right-1 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-green-500 rounded-full border-2 border-white"></span>
              </>
            ) : (
              /* Close icon */
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>

          {/* Tooltip - only when closed and on desktop */}
          {viewState === 'closed' && (
            <div className="hidden sm:block absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-navy text-white text-sm px-4 py-2 rounded-xl shadow-lg whitespace-nowrap">
                Chat with us
                <div className="absolute top-full right-6 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-navy"></div>
              </div>
            </div>
          )}
        </button>
      </div>

      {/* Backdrop - always show on mobile when open */}
      {viewState !== 'closed' && (
        <div
          className={`fixed inset-0 z-40 transition-all ${
            viewState === 'chat'
              ? 'bg-black/50 sm:bg-black/20 sm:backdrop-blur-none'
              : 'bg-black/30 backdrop-blur-sm sm:bg-transparent sm:backdrop-blur-none'
          }`}
          onClick={handleClose}
        />
      )}
    </>
  );
}
