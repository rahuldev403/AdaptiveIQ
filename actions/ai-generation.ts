"use server";

import { connectDB } from "@/lib/db";
import { TrainingGround, Question, Citation } from "@/lib/db/schema";

/**
 * You.com API Response Types
 */
interface YouComSearchResult {
  hits?: Array<{
    url: string;
    title: string;
    snippet?: string;
  }>;
  answer?: string;
  citations?: Array<{
    url: string;
    title: string;
  }>;
}

interface YouComChatResponse {
  answer: string;
  citations?: Array<{
    url: string;
    title: string;
  }>;
}

/**
 * Fetches fresh questions from You.com API based on a weak topic
 *
 * @param topic - The weak topic to research (e.g., "React Server Actions")
 * @returns Generated questions with citations from You.com
 */
export async function fetchQuestionsFromYouAPI(topic: string): Promise<{
  questions: Question[];
  citations: Citation[];
  sourceLinks: string[];
}> {
  const apiKey = process.env.YOU_COM_API_KEY;

  if (!apiKey) {
    throw new Error(
      "YOU_COM_API_KEY is not configured in environment variables",
    );
  }

  // Construct the research prompt with strict JSON formatting
  const researchPrompt = `Research the latest best practices for "${topic}" as of 2025. Based on this research, generate 3 strictly formatted multiple-choice questions for a coding learning platform.

CRITICAL REQUIREMENTS:
- Prioritize official documentation and recent engineering blogs
- Questions MUST be technical, practical, and based on 2025 best practices
- Return ONLY valid JSON (no markdown, no code blocks, no extra text)

Return in this EXACT JSON format:
{
  "questions": [
    {
      "id": "q1",
      "question": "What is the recommended way to...?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer": 0,
      "explanation": "Detailed explanation with reference to the source",
      "difficulty": "medium"
    }
  ],
  "citations": [
    {
      "title": "Official Documentation Title",
      "url": "https://example.com/doc",
      "snippet": "Relevant excerpt from the source"
    }
  ]
}`;

  try {
    // Call You.com Chat API (Smart Mode)
    const response = await fetch("https://api.you.com/smart/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({
        query: researchPrompt,
        chat_mode: "smart", // Use Smart mode for research + generation
        include_citations: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`You.com API error: ${response.status} - ${errorText}`);
    }

    const data: YouComChatResponse = await response.json();

    // Extract the JSON from the response
    // You.com might wrap it in markdown code blocks, so we need to clean it
    let jsonContent = data.answer;

    // Remove markdown code blocks if present
    jsonContent = jsonContent
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();

    // Parse the JSON response
    const parsedResponse = JSON.parse(jsonContent);

    // Validate the response structure
    if (!parsedResponse.questions || !Array.isArray(parsedResponse.questions)) {
      throw new Error("Invalid response structure: missing questions array");
    }

    // Extract citations from You.com's response
    const citations: Citation[] = [];
    const sourceLinks: string[] = [];

    // Add citations from the parsed response
    if (parsedResponse.citations && Array.isArray(parsedResponse.citations)) {
      parsedResponse.citations.forEach((citation: any) => {
        citations.push({
          title: citation.title || "Unknown Source",
          url: citation.url,
          snippet: citation.snippet || "",
        });
        sourceLinks.push(citation.url);
      });
    }

    // Add citations from You.com API metadata
    if (data.citations && Array.isArray(data.citations)) {
      data.citations.forEach((citation) => {
        // Avoid duplicates
        if (!sourceLinks.includes(citation.url)) {
          citations.push({
            title: citation.title,
            url: citation.url,
            snippet: "",
          });
          sourceLinks.push(citation.url);
        }
      });
    }

    // Ensure each question has a unique ID
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
  } catch (error) {
    console.error("Error fetching questions from You.com:", error);

    // Provide more specific error messages
    if (error instanceof SyntaxError) {
      throw new Error(
        `Failed to parse You.com response as JSON: ${error.message}`,
      );
    }

    throw error;
  }
}

/**
 * Main action: Generate a live quiz based on a weak topic
 * Saves the result to the training_grounds collection
 *
 * @param weakTopic - The topic the user needs to practice
 * @returns The generated training ground with questions and sources
 */
export async function generateLiveQuiz(
  weakTopic: string,
): Promise<TrainingGround> {
  if (!weakTopic || weakTopic.trim().length === 0) {
    throw new Error("Topic cannot be empty");
  }

  try {
    // Fetch questions from You.com API
    const { questions, citations, sourceLinks } =
      await fetchQuestionsFromYouAPI(weakTopic);

    // Create the training ground document
    const trainingGround: TrainingGround = {
      topic: weakTopic,
      generated_at: new Date(),
      raw_ai_response: {
        questions,
        citations,
      },
      source_links: sourceLinks,
    };

    // Save to MongoDB
    const client = await connectDB();
    const db = client.db();
    const collection = db.collection<TrainingGround>("training_grounds");

    const result = await collection.insertOne(trainingGround);

    // Add the MongoDB _id to the returned object
    trainingGround._id = result.insertedId;

    console.log(`✅ Generated live quiz for topic: ${weakTopic}`);
    console.log(`📚 Sources used: ${sourceLinks.length} URLs`);

    return trainingGround;
  } catch (error) {
    console.error("Error generating live quiz:", error);
    throw new Error(
      `Failed to generate quiz: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Get all training grounds for a specific topic
 */
export async function getTrainingGroundsByTopic(
  topic: string,
): Promise<TrainingGround[]> {
  const client = await connectDB();
  const db = client.db();
  const collection = db.collection<TrainingGround>("training_grounds");

  const results = await collection
    .find({ topic })
    .sort({ generated_at: -1 })
    .toArray();

  return results;
}

/**
 * Get the most recent training ground across all topics
 */
export async function getLatestTrainingGround(): Promise<TrainingGround | null> {
  const client = await connectDB();
  const db = client.db();
  const collection = db.collection<TrainingGround>("training_grounds");

  const result = await collection.findOne({}, { sort: { generated_at: -1 } });

  return result;
}
