import { NextRequest, NextResponse } from 'next/server';
import { ChatRequest, ChatResponse } from '@/types/chat';
import {
  validateInput,
  performSafetyCheck,
  checkRateLimit,
} from '@/lib/chat-safety';
import { generateChatResponse } from '@/lib/chat-ai';

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor?.split(',')[0] || 'unknown';

    // Check rate limit
    if (!checkRateLimit(ip)) {
      return NextResponse.json<ChatResponse>(
        {
          success: false,
          error: "You're sending messages too quickly. Please wait a moment and try again.",
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body: ChatRequest = await request.json();
    const { message, conversationHistory } = body;

    // Validate input
    const validation = validateInput(message);
    if (!validation.valid) {
      return NextResponse.json<ChatResponse>(
        {
          success: false,
          error: validation.error,
        },
        { status: 400 }
      );
    }

    const sanitizedMessage = validation.sanitizedMessage || message;

    // Perform safety checks
    const safetyCheck = performSafetyCheck(sanitizedMessage);
    if (!safetyCheck.safe) {
      // Return the deflection response as a successful chat message
      // This makes it seamless for the user - they get a helpful redirect
      return NextResponse.json<ChatResponse>({
        success: true,
        message: safetyCheck.deflectionResponse,
      });
    }

    // Generate AI response
    const aiResponse = await generateChatResponse(
      sanitizedMessage,
      conversationHistory
    );

    return NextResponse.json<ChatResponse>({
      success: true,
      message: aiResponse,
    });
  } catch (error) {
    console.error('Chat API error:', error);

    return NextResponse.json<ChatResponse>(
      {
        success: false,
        error: "I'm having trouble processing your request. Please try again or contact us at info@sasa-worldwide.com.",
      },
      { status: 500 }
    );
  }
}

// Handle GET requests (for testing)
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'SASA AI Chat API is running',
    endpoint: 'POST /api/chat',
    body: {
      message: 'string (required)',
      conversationHistory: 'array of {role, content} (optional)',
    },
  });
}
