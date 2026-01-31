import { ValidationResult, SafetyCheckResult } from '@/types/chat';

// Maximum message length
const MAX_MESSAGE_LENGTH = 500;
const MIN_MESSAGE_LENGTH = 1;

// Patterns that indicate prompt injection attempts
const INJECTION_PATTERNS = [
  /ignore\s+(previous|all|your|the)\s+(instructions|prompts|rules)/i,
  /you\s+are\s+now/i,
  /act\s+as/i,
  /pretend\s+(to\s+be|you\s+are|you're)/i,
  /forget\s+(your|the)\s+(instructions|rules|prompt)/i,
  /new\s+(instructions|rules|persona)/i,
  /reveal\s+(your|the)\s+(system|prompt|instructions)/i,
  /what\s+(is|are)\s+your\s+(instructions|rules|prompt|system)/i,
  /bypass/i,
  /jailbreak/i,
  /\bDAN\b/,
  /do\s+anything\s+now/i,
  /override\s+(your|the)/i,
  /disregard\s+(your|the|all)/i,
  /roleplay\s+as/i,
  /you\s+must\s+obey/i,
  /system\s+prompt/i,
];

// Patterns that indicate requests for sensitive information
const SENSITIVE_PATTERNS = [
  /revenue|profit|income|earnings|financial\s+statements?/i,
  /salary|salaries|compensation|pay\s+scale/i,
  /client\s+(list|names?|details?|information)/i,
  /employee\s+(list|names?|details?|personal|contact)/i,
  /internal\s+(process|procedure|document|data)/i,
  /proprietary|confidential|secret/i,
  /contract\s+(terms?|details?|information)/i,
  /pricing\s+(structure|details?|breakdown)/i,
  /bank\s+(account|details?)/i,
  /password|credentials|login/i,
];

// Patterns for inappropriate content
const INAPPROPRIATE_PATTERNS = [
  /\b(fuck|shit|damn|ass|bitch)\b/i,
  /\b(kill|murder|attack|bomb|terrorist)\b/i,
  /\b(nude|porn|xxx|sex)\b/i,
  /\b(drug|cocaine|heroin|meth)\b/i,
];

// Deflection responses for different scenarios
export const DEFLECTION_RESPONSES = {
  injection: "I'm SASA AI Assistant, here to help you learn about SASA Worldwide. How can I assist you with our services, careers, or company information?",

  financial: "For financial or business partnership inquiries, please contact our team directly at info@sasa-worldwide.com or call +971 4 584 3777. I'd be happy to tell you about our services instead!",

  clients: "We work with 600+ clients across various industries in the UAE. For specific partnership opportunities or client-related inquiries, please reach out to our team at info@sasa-worldwide.com.",

  employees: "I can share information about our leadership team and career opportunities. For specific employee inquiries, please contact our HR department at +971 4 584 3777.",

  internal: "I can share our public company information, services, and career opportunities. For detailed internal matters, please contact our team directly at info@sasa-worldwide.com.",

  inappropriate: "I'm here to help with SASA Worldwide information. Is there something about our services, careers, or company I can help you with?",

  tooLong: "Your message is a bit long. Could you please shorten it to 500 characters or less?",

  empty: "It looks like your message is empty. How can I help you learn about SASA Worldwide?",
};

/**
 * Validates user input for basic requirements
 */
export function validateInput(message: string): ValidationResult {
  // Check for empty message
  if (!message || message.trim().length < MIN_MESSAGE_LENGTH) {
    return {
      valid: false,
      error: DEFLECTION_RESPONSES.empty,
    };
  }

  // Check for message too long
  if (message.length > MAX_MESSAGE_LENGTH) {
    return {
      valid: false,
      error: DEFLECTION_RESPONSES.tooLong,
    };
  }

  // Sanitize HTML and script tags
  const sanitized = message
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim();

  return {
    valid: true,
    sanitizedMessage: sanitized,
  };
}

/**
 * Checks for prompt injection attempts
 */
export function checkForInjection(message: string): SafetyCheckResult {
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(message)) {
      return {
        safe: false,
        reason: 'prompt_injection',
        deflectionResponse: DEFLECTION_RESPONSES.injection,
      };
    }
  }

  return { safe: true };
}

/**
 * Checks for requests for sensitive information
 */
export function checkForSensitiveRequest(message: string): SafetyCheckResult {
  const lowerMessage = message.toLowerCase();

  // Check for financial information requests
  if (/revenue|profit|income|earnings|financial/i.test(message)) {
    return {
      safe: false,
      reason: 'financial_request',
      deflectionResponse: DEFLECTION_RESPONSES.financial,
    };
  }

  // Check for salary/compensation requests
  if (/salary|salaries|compensation|pay\s+scale|how\s+much.*paid/i.test(message)) {
    return {
      safe: false,
      reason: 'salary_request',
      deflectionResponse: DEFLECTION_RESPONSES.financial,
    };
  }

  // Check for client information requests
  if (/client\s+(list|names?|details?)|who\s+are\s+your\s+clients/i.test(message)) {
    return {
      safe: false,
      reason: 'client_request',
      deflectionResponse: DEFLECTION_RESPONSES.clients,
    };
  }

  // Check for employee information requests
  if (/employee\s+(list|names?|details?|personal)|staff\s+contact/i.test(message)) {
    return {
      safe: false,
      reason: 'employee_request',
      deflectionResponse: DEFLECTION_RESPONSES.employees,
    };
  }

  // Check for internal/proprietary information
  if (/internal\s+|proprietary|confidential|secret\s+/i.test(message)) {
    return {
      safe: false,
      reason: 'internal_request',
      deflectionResponse: DEFLECTION_RESPONSES.internal,
    };
  }

  return { safe: true };
}

/**
 * Checks for inappropriate content
 */
export function checkForInappropriate(message: string): SafetyCheckResult {
  for (const pattern of INAPPROPRIATE_PATTERNS) {
    if (pattern.test(message)) {
      return {
        safe: false,
        reason: 'inappropriate_content',
        deflectionResponse: DEFLECTION_RESPONSES.inappropriate,
      };
    }
  }

  return { safe: true };
}

/**
 * Main safety check function - runs all checks
 */
export function performSafetyCheck(message: string): SafetyCheckResult {
  // Check for prompt injection first
  const injectionCheck = checkForInjection(message);
  if (!injectionCheck.safe) {
    return injectionCheck;
  }

  // Check for sensitive information requests
  const sensitiveCheck = checkForSensitiveRequest(message);
  if (!sensitiveCheck.safe) {
    return sensitiveCheck;
  }

  // Check for inappropriate content
  const inappropriateCheck = checkForInappropriate(message);
  if (!inappropriateCheck.safe) {
    return inappropriateCheck;
  }

  return { safe: true };
}

/**
 * Sanitizes AI response to remove any leaked sensitive content
 */
export function sanitizeResponse(response: string): string {
  let sanitized = response;

  // Remove any potential system prompt leakage
  sanitized = sanitized.replace(/system\s*prompt\s*[:=]/gi, '');
  sanitized = sanitized.replace(/my\s+instructions\s+(are|say)/gi, '');

  // Remove any accidentally included sensitive patterns
  sanitized = sanitized.replace(/\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g, '[PHONE]'); // Phone numbers except official
  sanitized = sanitized.replace(/[a-zA-Z0-9._%+-]+@(?!sasa-worldwide\.com)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]'); // Non-SASA emails

  // Remove Pollinations watermarks if any
  sanitized = sanitized.replace(/\*?\*?Powered by Pollinations\.ai\*?\*?/gi, '');
  sanitized = sanitized.replace(/---\s*\n?\s*\*?Generated.*Pollinations.*\*?/gi, '');

  return sanitized.trim();
}

/**
 * Rate limiting helper - tracks requests per IP
 */
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 30; // requests per minute
const RATE_WINDOW = 60000; // 1 minute in milliseconds

export function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}
