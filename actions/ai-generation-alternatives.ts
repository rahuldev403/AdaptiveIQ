/**
 * Alternative implementation using You.com Search endpoint
 * This can be used as a fallback or for comparison
 *
 * The Smart Chat endpoint is recommended for this use case,
 * but the Search endpoint provides more control over search results
 */

"use server";

import { Question, Citation } from "@/lib/db/schema";

interface YouComSearchResponse {
  answer?: string;
  hits?: Array<{
    url: string;
    title: string;
    snippet: string;
    description?: string;
  }>;
}

/**
 * Alternative: Fetch questions using You.com Search endpoint
 * This gives us more control over the search results
 * Use this if the Chat endpoint doesn't provide enough context
 */
export async function fetchQuestionsUsingSearch(topic: string): Promise<{
  questions: Question[];
  citations: Citation[];
  sourceLinks: string[];
}> {
  const apiKey = process.env.YOU_COM_API_KEY;

  if (!apiKey) {
    throw new Error("YOU_COM_API_KEY is not configured");
  }

  // Step 1: Search for latest information about the topic
  const searchQuery = `${topic} best practices 2025 official documentation tutorial`;

  const searchResponse = await fetch(
    `https://api.you.com/search?query=${encodeURIComponent(searchQuery)}&num_web_results=5`,
    {
      method: "GET",
      headers: {
        "X-API-Key": apiKey,
      },
    },
  );

  if (!searchResponse.ok) {
    throw new Error(`You.com Search API error: ${searchResponse.status}`);
  }

  const searchData: YouComSearchResponse = await searchResponse.json();

  // Extract sources from search results
  const citations: Citation[] = [];
  const sourceLinks: string[] = [];

  if (searchData.hits) {
    searchData.hits.forEach((hit) => {
      citations.push({
        title: hit.title,
        url: hit.url,
        snippet: hit.snippet || hit.description || "",
      });
      sourceLinks.push(hit.url);
    });
  }

  // Step 2: Use the search results to generate questions
  const contextSnippets = citations.map((c) => c.snippet).join("\n\n");

  const generationPrompt = `Based on the following recent information about ${topic}:

${contextSnippets}

Generate 3 technical multiple-choice questions that test understanding of modern best practices.

Return ONLY valid JSON (no markdown, no code blocks):
{
  "questions": [
    {
      "id": "q1",
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": 0,
      "explanation": "Detailed explanation",
      "difficulty": "medium"
    }
  ]
}`;

  // Call the Chat API for generation (using the search context)
  const chatResponse = await fetch("https://api.you.com/smart/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      query: generationPrompt,
      chat_mode: "smart",
    }),
  });

  if (!chatResponse.ok) {
    throw new Error(`You.com Chat API error: ${chatResponse.status}`);
  }

  const chatData = await chatResponse.json();

  // Parse the response
  let jsonContent = chatData.answer
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  const parsedResponse = JSON.parse(jsonContent);

  const questions: Question[] = parsedResponse.questions.map(
    (q: any, index: number) => ({
      id: q.id || `q${index + 1}`,
      question: q.question,
      options: q.options,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      difficulty: q.difficulty || "medium",
    }),
  );

  return {
    questions,
    citations,
    sourceLinks,
  };
}

/**
 * Alternative: Two-step approach with explicit research
 * Step 1: Research the topic
 * Step 2: Generate questions based on research
 */
export async function fetchQuestionsWithExplicitResearch(
  topic: string,
): Promise<{
  questions: Question[];
  citations: Citation[];
  sourceLinks: string[];
  researchSummary: string;
}> {
  const apiKey = process.env.YOU_COM_API_KEY;

  if (!apiKey) {
    throw new Error("YOU_COM_API_KEY is not configured");
  }

  // Step 1: Research phase
  const researchPrompt = `Research the latest best practices and official recommendations for "${topic}" as of 2025. 
Focus on:
- Official documentation
- Recent engineering blogs
- Breaking changes
- Current recommended patterns

Provide a comprehensive summary with sources.`;

  const researchResponse = await fetch("https://api.you.com/smart/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      query: researchPrompt,
      chat_mode: "research", // Use research mode for better sourcing
      include_citations: true,
    }),
  });

  if (!researchResponse.ok) {
    throw new Error(`Research phase failed: ${researchResponse.status}`);
  }

  const researchData = await researchResponse.json();
  const researchSummary = researchData.answer;

  // Extract citations from research
  const citations: Citation[] = [];
  const sourceLinks: string[] = [];

  if (researchData.citations) {
    researchData.citations.forEach((citation: any) => {
      citations.push({
        title: citation.title,
        url: citation.url,
        snippet: "",
      });
      sourceLinks.push(citation.url);
    });
  }

  // Step 2: Generation phase using research
  const generationPrompt = `Based on this research about ${topic}:

${researchSummary}

Generate 3 strictly formatted technical multiple-choice questions.

Return ONLY valid JSON:
{
  "questions": [
    {
      "id": "q1",
      "question": "Question text?",
      "options": ["A", "B", "C", "D"],
      "correct_answer": 0,
      "explanation": "Explanation with source reference",
      "difficulty": "medium"
    }
  ]
}`;

  const generationResponse = await fetch("https://api.you.com/smart/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": apiKey,
    },
    body: JSON.stringify({
      query: generationPrompt,
      chat_mode: "smart",
    }),
  });

  if (!generationResponse.ok) {
    throw new Error(`Generation phase failed: ${generationResponse.status}`);
  }

  const generationData = await generationResponse.json();

  // Parse questions
  let jsonContent = generationData.answer
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();

  const parsedResponse = JSON.parse(jsonContent);

  const questions: Question[] = parsedResponse.questions.map(
    (q: any, index: number) => ({
      id: q.id || `q${index + 1}`,
      question: q.question,
      options: q.options,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      difficulty: q.difficulty || "medium",
    }),
  );

  return {
    questions,
    citations,
    sourceLinks,
    researchSummary,
  };
}
