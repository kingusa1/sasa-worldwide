import { NextRequest, NextResponse } from 'next/server';

// This endpoint allows the AI knowledge to be refreshed automatically
// It can be called by a cron job or manually to update the AI's knowledge
// The knowledge is stored in sasa-knowledge.ts and is loaded at build time
// This endpoint verifies the AI system is working and returns current knowledge status

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(request: NextRequest) {
  // Optional: verify cron secret for automated calls
  const authHeader = request.headers.get('authorization');
  const searchSecret = request.nextUrl.searchParams.get('secret');
  const providedSecret = authHeader?.replace('Bearer ', '') || searchSecret;

  if (CRON_SECRET && providedSecret && providedSecret !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Import the knowledge module to verify it loads correctly
    const { SASA_KNOWLEDGE, getKnowledgeSummary } = await import('@/lib/sasa-knowledge');

    // Verify all sections are present
    const sections = [
      'company', 'contact', 'stats', 'services', 'training',
      'careers', 'recruitment', 'leadership', 'technology',
      'values', 'timeline', 'social', 'website', 'csr', 'partnerships',
    ];

    const missingSections = sections.filter(
      (s) => !(s in SASA_KNOWLEDGE)
    );

    const knowledgeSummary = getKnowledgeSummary();

    // Check AI provider status
    const { getOpenRouterApiKey } = await import('@/lib/ai-credentials');
    const hasOpenRouter = !!getOpenRouterApiKey();
    const hasOpenAI = !!(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your-openai-api-key-here');

    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      knowledge: {
        sectionsLoaded: sections.length - missingSections.length,
        totalSections: sections.length,
        missingSections: missingSections.length > 0 ? missingSections : 'none',
        knowledgeSummaryLength: knowledgeSummary.length,
        trainingPackages: SASA_KNOWLEDGE.training.packages.length,
        openPositions: SASA_KNOWLEDGE.recruitment.openPositions.length,
        leadershipMembers:
          SASA_KNOWLEDGE.leadership.coFounders.length +
          SASA_KNOWLEDGE.leadership.cSuite.length +
          SASA_KNOWLEDGE.leadership.salesDirectors.length,
        services: Object.keys(SASA_KNOWLEDGE.services).length,
        csrInitiatives: SASA_KNOWLEDGE.csr.initiatives.length,
        websitePages: Object.keys(SASA_KNOWLEDGE.website.pages).length,
      },
      aiProviders: {
        openRouter: hasOpenRouter ? 'connected (GPT-4o)' : 'not connected',
        openAI: hasOpenAI ? 'configured (GPT-4o)' : 'not configured',
        pollinations: 'available (openai-large fallback)',
      },
      message: 'AI knowledge base is loaded and ready. To update content, edit lib/sasa-knowledge.ts and redeploy.',
    });
  } catch (error) {
    console.error('Knowledge refresh error:', error);
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to verify knowledge base. Check lib/sasa-knowledge.ts for errors.',
      },
      { status: 500 }
    );
  }
}

// POST endpoint to test the AI response with a sample question
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const testQuestion = body.question || 'What services does SASA offer?';

    const { generateChatResponse } = await import('@/lib/chat-ai');
    const response = await generateChatResponse(testQuestion);

    return NextResponse.json({
      status: 'ok',
      question: testQuestion,
      response,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('AI test error:', error);
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
