import { ScoredArticle } from './scoring';

const POLLINATIONS_BASE_URL = process.env.POLLINATIONS_BASE_URL || 'https://text.pollinations.ai/openai';
const POLLINATIONS_MODEL = process.env.POLLINATIONS_MODEL || 'openai';

// SASA brand voice system prompt (from your n8n workflow)
const SYSTEM_PROMPT = `You are a Content Writer for SASA Worldwide, a UAE-based sales operations company. You create professional, engaging blog posts that establish thought leadership.

# SASA WORLDWIDE BRAND VOICE

## Company Positioning
- UAE-first global AI and sales ecosystem
- Merging human excellence with advanced AI
- Elite commission-only sales academy and performance network
- Disciplined execution meets visionary innovation

## Content Principles
- Bold and authoritative without arrogance
- Execution-driven over empty promises
- Results-focused and performance-oriented
- Strategic insights with tactical clarity
- Vision grounded in disciplined action

## Writing Style
- Professional and authoritative
- Use clear, concise language
- Include actionable insights
- Focus on sales, AI, and business growth topics
- Maintain a forward-thinking perspective

## Content Structure
- Strong opening hook
- Clear sections with logical flow
- Practical takeaways
- Professional conclusion

IMPORTANT: Create original content that provides value. Do not simply summarize - add strategic insights and connect to business outcomes.`;

interface BlogContent {
  title: string;
  excerpt: string;
  content: string;
  category: string;
}

// Generate blog post content using Pollinations AI
export async function generateBlogPost(article: ScoredArticle, articleContent: string): Promise<BlogContent | null> {
  try {
    const userPrompt = `Create a professional blog post based on this news article:

ARTICLE TITLE: ${article.title}
ARTICLE SOURCE: ${article.source}
ARTICLE CONTENT: ${articleContent || article.description || article.contentSnippet}

INSTRUCTIONS:
1. Create an engaging, original blog post (600-800 words)
2. Add strategic insights relevant to sales leaders and business executives
3. Connect the topic to AI, sales automation, or business growth
4. Include practical takeaways
5. Write in a professional, authoritative tone

FORMAT YOUR RESPONSE EXACTLY LIKE THIS:

TITLE: [A compelling, SEO-friendly title - different from the original]

EXCERPT: [A 2-3 sentence summary that hooks the reader]

CATEGORY: [One of: AI Sales, Sales Strategy, Business Growth, Technology, Leadership]

CONTENT:
[Your full blog post with PROPER HTML TAGS. YOU MUST USE:
- <p> tags for every paragraph
- <h2> tags for main section headings
- <h3> tags for sub-headings
- <ul> and <li> tags for bullet lists
- <strong> for bold text
DO NOT output plain text - EVERY paragraph must be wrapped in <p> tags]

EXAMPLE FORMAT:
<p>Introduction paragraph here.</p>
<h2>First Main Section</h2>
<p>Content paragraph.</p>
<h3>Subsection</h3>
<p>More content.</p>
<ul>
<li>Bullet point one</li>
<li>Bullet point two</li>
</ul>`;

    const response = await fetch(`${POLLINATIONS_BASE_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: POLLINATIONS_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      console.error('Pollinations API error:', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || '';

    if (!aiResponse) {
      console.error('No content in AI response');
      return null;
    }

    // Parse the AI response
    return parseAIResponse(aiResponse, article);
  } catch (error) {
    console.error('Error generating blog post:', error);
    return null;
  }
}

// Remove Pollinations watermark and ads from content
function removeWatermark(text: string): string {
  // Remove various Pollinations watermark patterns
  const patterns = [
    /---\s*\*\*Support Pollinations\.AI:\*\*.*?(?=---|$)/gis,
    /🌸\s*\*\*Ad\*\*\s*🌸.*?(?=---|$)/gis,
    /Powered by Pollinations\.AI.*?(?=\n\n|$)/gi,
    /\[Support our mission\].*?(?=\n|$)/gi,
    /Support Pollinations\.AI.*?(?=\n|$)/gi,
    /---\s*\n\s*---/g,
    /\n{3,}/g, // Multiple newlines
  ];

  let cleaned = text;
  for (const pattern of patterns) {
    cleaned = cleaned.replace(pattern, '');
  }

  // Remove trailing dashes and whitespace
  cleaned = cleaned.replace(/\s*---\s*$/g, '').trim();

  return cleaned;
}

// Convert markdown-style text to proper HTML
function markdownToHtml(text: string): string {
  let html = text;

  // Remove any remaining watermark patterns
  html = removeWatermark(html);

  // Split into lines for processing
  const lines = html.split('\n');
  const processedLines: string[] = [];
  let inList = false;
  let listItems: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    // Skip empty lines but close any open list
    if (!line) {
      if (inList && listItems.length > 0) {
        processedLines.push(`<ul>\n${listItems.map((item) => `<li>${item}</li>`).join('\n')}\n</ul>`);
        listItems = [];
        inList = false;
      }
      continue;
    }

    // Convert markdown headings
    if (line.startsWith('### ')) {
      if (inList && listItems.length > 0) {
        processedLines.push(`<ul>\n${listItems.map((item) => `<li>${item}</li>`).join('\n')}\n</ul>`);
        listItems = [];
        inList = false;
      }
      const headingText = line.replace(/^### /, '').replace(/\*\*/g, '');
      processedLines.push(`<h3>${headingText}</h3>`);
      continue;
    }

    if (line.startsWith('## ')) {
      if (inList && listItems.length > 0) {
        processedLines.push(`<ul>\n${listItems.map((item) => `<li>${item}</li>`).join('\n')}\n</ul>`);
        listItems = [];
        inList = false;
      }
      const headingText = line.replace(/^## /, '').replace(/\*\*/g, '');
      processedLines.push(`<h2>${headingText}</h2>`);
      continue;
    }

    // Handle **Heading** style (bold text on its own line as heading)
    if (/^\*\*[^*]+\*\*$/.test(line) && line.length < 100) {
      if (inList && listItems.length > 0) {
        processedLines.push(`<ul>\n${listItems.map((item) => `<li>${item}</li>`).join('\n')}\n</ul>`);
        listItems = [];
        inList = false;
      }
      const headingText = line.replace(/^\*\*/, '').replace(/\*\*$/, '');
      processedLines.push(`<h2>${headingText}</h2>`);
      continue;
    }

    // Convert bullet points
    if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ')) {
      inList = true;
      let itemText = line.replace(/^[-*•]\s*/, '');
      // Convert inline bold
      itemText = itemText.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      listItems.push(itemText);
      continue;
    }

    // Convert numbered lists
    if (/^\d+\.\s/.test(line)) {
      inList = true;
      let itemText = line.replace(/^\d+\.\s*/, '');
      itemText = itemText.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
      listItems.push(itemText);
      continue;
    }

    // Close list if we hit a non-list item
    if (inList && listItems.length > 0) {
      processedLines.push(`<ul>\n${listItems.map((item) => `<li>${item}</li>`).join('\n')}\n</ul>`);
      listItems = [];
      inList = false;
    }

    // Skip if already has HTML tags
    if (line.startsWith('<p>') || line.startsWith('<h2>') || line.startsWith('<h3>') || line.startsWith('<ul>') || line.startsWith('<li>')) {
      processedLines.push(line);
      continue;
    }

    // Convert inline bold in regular paragraphs
    line = line.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // Wrap regular text in paragraph tags
    if (line && !line.startsWith('<')) {
      processedLines.push(`<p>${line}</p>`);
    } else {
      processedLines.push(line);
    }
  }

  // Close any remaining list
  if (inList && listItems.length > 0) {
    processedLines.push(`<ul>\n${listItems.map((item) => `<li>${item}</li>`).join('\n')}\n</ul>`);
  }

  return processedLines.join('\n');
}

// Parse the AI response into structured content
function parseAIResponse(response: string, article: ScoredArticle): BlogContent {
  // First, remove any watermarks from the response
  const cleanedResponse = removeWatermark(response);

  // Extract title
  const titleMatch = cleanedResponse.match(/TITLE:\s*(.+?)(?=\n|EXCERPT:)/is);
  const title = titleMatch ? titleMatch[1].trim() : article.title;

  // Extract excerpt
  const excerptMatch = cleanedResponse.match(/EXCERPT:\s*(.+?)(?=\n\n|CATEGORY:)/is);
  const excerpt = excerptMatch ? excerptMatch[1].trim() : article.description.substring(0, 200);

  // Extract category
  const categoryMatch = cleanedResponse.match(/CATEGORY:\s*(.+?)(?=\n|CONTENT:)/is);
  const category = categoryMatch ? categoryMatch[1].trim() : 'Technology';

  // Extract content
  const contentMatch = cleanedResponse.match(/CONTENT:\s*([\s\S]+)$/i);
  let content = contentMatch ? contentMatch[1].trim() : cleanedResponse;

  // Remove watermark from content again (in case it's embedded)
  content = removeWatermark(content);

  // Always run through markdown-to-HTML converter to ensure proper formatting
  // This handles both plain text and markdown-style content
  if (!content.includes('<p>') || content.includes('**') || content.includes('## ')) {
    content = markdownToHtml(content);
  }

  // Final cleanup of content
  content = content
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s*---\s*$/g, '')
    .replace(/<p>\s*<\/p>/g, '') // Remove empty paragraphs
    .trim();

  return {
    title: cleanText(title),
    excerpt: cleanText(excerpt),
    content,
    category: cleanText(category),
  };
}

// Clean text by removing extra whitespace and quotes
function cleanText(text: string): string {
  return text
    .replace(/^["']|["']$/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Export function to reformat existing content (for cleanup API)
export function reformatContent(content: string): string {
  if (!content) return content;

  // Remove watermarks first
  let cleaned = removeWatermark(content);

  // If content doesn't have proper HTML or has markdown, convert it
  if (!cleaned.includes('<p>') || cleaned.includes('**') || cleaned.includes('## ') || cleaned.includes('- ')) {
    cleaned = markdownToHtml(cleaned);
  }

  // Final cleanup
  cleaned = cleaned
    .replace(/\n{3,}/g, '\n\n')
    .replace(/\s*---\s*$/g, '')
    .replace(/<p>\s*<\/p>/g, '')
    .trim();

  return cleaned;
}

// Generate a fallback blog post if AI fails
export function generateFallbackPost(article: ScoredArticle): BlogContent {
  const title = `Industry Update: ${article.title}`;
  const excerpt = article.description.substring(0, 200) + '...';

  const content = `
<p>The latest developments in the industry continue to shape how businesses approach sales and technology integration. This recent news from ${article.source} highlights important trends that forward-thinking leaders need to understand.</p>

<h2>Key Highlights</h2>
<p>${article.description}</p>

<h2>What This Means for Business Leaders</h2>
<p>In today's rapidly evolving business landscape, staying ahead of industry trends is crucial for maintaining competitive advantage. This development underscores the importance of:</p>
<ul>
<li>Embracing technological innovation in sales processes</li>
<li>Adapting strategies to meet changing market demands</li>
<li>Investing in team development and training</li>
<li>Building resilient, scalable operations</li>
</ul>

<h2>Strategic Takeaways</h2>
<p>At SASA Worldwide, we believe in the power of combining human expertise with advanced technology. As the industry continues to evolve, organizations that prioritize both innovation and execution will emerge as leaders in their respective markets.</p>

<p>Stay tuned for more insights on how AI and sales excellence are transforming businesses across the UAE and beyond.</p>
`;

  return {
    title,
    excerpt,
    content,
    category: 'Technology',
  };
}
