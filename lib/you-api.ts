/**
 * You.com API Types and Utilities
 * Official API documentation: https://documentation.you.com/api-reference/
 */

export interface YouComSearchParams {
  query: string;
  chat_mode?: "smart" | "research" | "default";
  include_citations?: boolean;
  num_web_results?: number;
}

export interface YouComChatParams {
  query: string;
  chat_mode?: "smart" | "research" | "default";
  include_citations?: boolean;
}

export interface YouComCitation {
  url: string;
  title: string;
  snippet?: string;
}

export interface YouComSearchResult {
  answer?: string;
  hits?: Array<{
    url: string;
    title: string;
    snippet?: string;
    description?: string;
  }>;
  citations?: YouComCitation[];
}

export interface YouComChatResponse {
  answer: string;
  citations?: YouComCitation[];
}

/**
 * You.com API Client
 * Wrapper for making API calls to You.com
 */
export class YouComAPIClient {
  private apiKey: string;
  private baseUrl: string = "https://api.you.com";

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error("You.com API key is required");
    }
    this.apiKey = apiKey;
  }

  /**
   * Call the You.com Smart Chat API
   * Best for research + generation tasks
   */
  async chat(params: YouComChatParams): Promise<YouComChatResponse> {
    const response = await fetch(`${this.baseUrl}/smart/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": this.apiKey,
      },
      body: JSON.stringify({
        query: params.query,
        chat_mode: params.chat_mode || "smart",
        include_citations: params.include_citations ?? true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`You.com API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  /**
   * Call the You.com Search API
   * Best for pure research tasks
   */
  async search(params: YouComSearchParams): Promise<YouComSearchResult> {
    const queryParams = new URLSearchParams({
      query: params.query,
      chat_mode: params.chat_mode || "smart",
      include_citations: String(params.include_citations ?? true),
    });

    if (params.num_web_results) {
      queryParams.append("num_web_results", String(params.num_web_results));
    }

    const response = await fetch(`${this.baseUrl}/search?${queryParams}`, {
      method: "GET",
      headers: {
        "X-API-Key": this.apiKey,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`You.com API error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }
}

/**
 * Utility: Extract domain from URL
 */
export function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace("www.", "");
  } catch {
    return "unknown source";
  }
}

/**
 * Utility: Clean JSON response from AI
 * Removes markdown code blocks and extra whitespace
 */
export function cleanJSONResponse(text: string): string {
  return text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();
}

/**
 * Utility: Validate question structure
 */
export function isValidQuestion(question: any): boolean {
  return (
    typeof question === "object" &&
    typeof question.question === "string" &&
    Array.isArray(question.options) &&
    question.options.length >= 2 &&
    typeof question.correct_answer === "number" &&
    question.correct_answer >= 0 &&
    question.correct_answer < question.options.length
  );
}
