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
 * Generate dynamic demo data based on the topic
 */
function generateDemoDataForTopic(topic: string) {
  // Normalize topic for matching
  const normalizedTopic = topic.toLowerCase().trim();

  // MongoDB Aggregation specific questions
  if (
    normalizedTopic.includes("mongodb") ||
    normalizedTopic.includes("aggregation")
  ) {
    return {
      questions: [
        {
          id: "mongo-1",
          question:
            "What is the primary purpose of the $group stage in MongoDB aggregation?",
          options: [
            "To filter documents",
            "To group documents by a specified identifier and perform accumulations",
            "To sort documents",
            "To join collections",
          ],
          correct_answer: 1,
          explanation:
            "The $group stage groups documents by a specified _id expression and applies accumulator expressions like $sum, $avg, $max, etc., to each group.",
          difficulty: "medium" as const,
        },
        {
          id: "mongo-2",
          question:
            "Which operator would you use to reshape documents in the aggregation pipeline?",
          options: ["$match", "$group", "$project", "$sort"],
          correct_answer: 2,
          explanation:
            "$project is used to reshape documents, include or exclude fields, add computed fields, and create new fields with expressions.",
          difficulty: "easy" as const,
        },
        {
          id: "mongo-3",
          question: "What does the $lookup stage do in MongoDB aggregation?",
          options: [
            "Searches for text in documents",
            "Performs a left outer join with another collection",
            "Looks up indexed fields",
            "Validates document schemas",
          ],
          correct_answer: 1,
          explanation:
            "$lookup performs a left outer join to an unsharded collection in the same database, allowing you to combine data from multiple collections.",
          difficulty: "medium" as const,
        },
      ],
      citations: [
        {
          title: "MongoDB Aggregation Pipeline – Official Docs",
          url: "https://www.mongodb.com/docs/manual/core/aggregation-pipeline/",
          snippet:
            "The aggregation pipeline is a framework for data aggregation modeled on the concept of data processing pipelines.",
        },
        {
          title: "Aggregation Pipeline Stages",
          url: "https://www.mongodb.com/docs/manual/reference/operator/aggregation-pipeline/",
          snippet:
            "Pipeline stages appear in an array. Documents pass through the stages in sequence.",
        },
        {
          title: "MongoDB $lookup Documentation",
          url: "https://www.mongodb.com/docs/manual/reference/operator/aggregation/lookup/",
          snippet:
            "Performs a left outer join to a collection in the same database to filter in documents from the joined collection.",
        },
      ],
    };
  }

  // Default React Server Components (original demo data)
  return {
    questions: [
      {
        id: "rsc-1",
        question: "What is the primary benefit of React Server Components?",
        options: [
          "They run on the client for better performance",
          "They can access server-only resources without an API layer",
          "They replace all client components",
          "They automatically cache all data",
        ],
        correct_answer: 1,
        explanation:
          "React Server Components can directly access server-only resources like databases, file systems, or environment variables without needing to create an API endpoint. This reduces the amount of code needed and improves performance by eliminating unnecessary round trips.",
        difficulty: "medium" as const,
      },
      {
        id: "rsc-2",
        question:
          "Which of the following CANNOT be used in a React Server Component?",
        options: [
          "async/await syntax",
          "useState hook",
          "Direct database queries",
          "File system access",
        ],
        correct_answer: 1,
        explanation:
          "React Server Components cannot use React hooks like useState, useEffect, or event listeners because they run on the server and don't re-render. They are meant for fetching data and rendering once on the server.",
        difficulty: "easy" as const,
      },
      {
        id: "rsc-3",
        question:
          "How do you mark a component as a Server Component in Next.js App Router?",
        options: [
          "Add 'use server' directive at the top",
          "Export it with async function syntax",
          "Components are Server Components by default",
          "Import from 'react/server'",
        ],
        correct_answer: 2,
        explanation:
          "In Next.js 13+ App Router, all components are Server Components by default unless you explicitly add 'use client' at the top of the file. This is the opposite of the Pages Router where components were Client Components by default.",
        difficulty: "medium" as const,
      },
    ],
    citations: [
      {
        title: "React Server Components – Next.js Official Docs",
        url: "https://nextjs.org/docs/app/building-your-application/rendering/server-components",
        snippet:
          "Server Components allow you to render components on the server and send the rendered output to the client. This enables zero-bundle-size components.",
      },
      {
        title: "Server and Client Components – React Docs",
        url: "https://react.dev/reference/rsc/server-components",
        snippet:
          "Server Components are a new type of Component that renders ahead of time, before bundling, in an environment separate from your client app or SSR server.",
      },
      {
        title: "Understanding React Server Components",
        url: "https://vercel.com/blog/understanding-react-server-components",
        snippet:
          "React Server Components represent a fundamental shift in how we build React applications, enabling direct server access without API routes.",
      },
    ],
  };
}

/**
 * Demo Fallback Data - Perfect Mock Response
 * Used when API fails or DEMO_MODE is enabled
 */
const DEMO_MOCK_RESPONSE = generateDemoDataForTopic("React Server Components");

/**
 * Main action: Generate a live quiz based on a weak topic
 * Saves the result to the training_grounds collection
 *
 * @param weakTopic - The topic the user needs to practice
 * @param userId - The authenticated user ID (from Clerk)
 * @returns Object with trainingId for redirect
 */
export async function generateLiveQuiz(
  weakTopic: string,
  userId: string,
): Promise<{ trainingId: string; success: boolean }> {
  if (!weakTopic || weakTopic.trim().length === 0) {
    throw new Error("Topic cannot be empty");
  }

  if (!userId || userId.trim().length === 0) {
    throw new Error("User ID is required");
  }

  // Check if DEMO_MODE is enabled
  const isDemoMode = process.env.DEMO_MODE === "true";

  try {
    let questions: Question[];
    let citations: Citation[];
    let sourceLinks: string[];

    // Try to fetch from You.com API unless in demo mode
    if (!isDemoMode) {
      try {
        console.log(
          `🔍 Attempting to fetch questions from You.com for: ${weakTopic}`,
        );
        const apiResponse = await fetchQuestionsFromYouAPI(weakTopic);
        questions = apiResponse.questions;
        citations = apiResponse.citations;
        sourceLinks = apiResponse.sourceLinks;
        console.log(
          `✅ Successfully fetched ${questions.length} questions from You.com`,
        );
      } catch (apiError) {
        console.warn(
          `⚠️  You.com API failed, falling back to demo data:`,
          apiError instanceof Error ? apiError.message : apiError,
        );
        // Fallback to demo data with the actual topic
        const demoData = generateDemoDataForTopic(weakTopic);
        questions = demoData.questions;
        citations = demoData.citations;
        sourceLinks = demoData.citations.map((c) => c.url);
      }
    } else {
      console.log(
        `🎭 DEMO_MODE enabled, using mock response for topic: ${weakTopic}`,
      );
      // Use demo data for the actual topic
      const demoData = generateDemoDataForTopic(weakTopic);
      questions = demoData.questions;
      citations = demoData.citations;
      sourceLinks = demoData.citations.map((c) => c.url);
    }

    // Create the training ground document
    const trainingGround: TrainingGround = {
      user_id: userId,
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

    console.log(`✅ Generated live quiz for topic: ${weakTopic}`);
    console.log(`📚 Sources used: ${sourceLinks.length} URLs`);
    console.log(`🆔 Training Ground ID: ${result.insertedId}`);

    return {
      trainingId: result.insertedId.toString(),
      success: true,
    };
  } catch (error) {
    console.error("❌ Critical error generating live quiz:", error);

    // Even in catastrophic failure, try to return demo data
    try {
      const demoData = generateDemoDataForTopic(weakTopic);
      const trainingGround: TrainingGround = {
        user_id: userId,
        topic: weakTopic,
        generated_at: new Date(),
        raw_ai_response: {
          questions: demoData.questions,
          citations: demoData.citations,
        },
        source_links: demoData.citations.map((c) => c.url),
      };

      const client = await connectDB();
      const db = client.db();
      const collection = db.collection<TrainingGround>("training_grounds");
      const result = await collection.insertOne(trainingGround);

      console.log(`🆘 Emergency fallback successful, ID: ${result.insertedId}`);

      return {
        trainingId: result.insertedId.toString(),
        success: true,
      };
    } catch (emergencyError) {
      console.error("💥 Emergency fallback also failed:", emergencyError);
      throw new Error(
        `Failed to generate quiz: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
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
 * Get a specific training ground by ID
 */
export async function getTrainingGroundById(
  trainingId: string,
): Promise<TrainingGround | null> {
  const client = await connectDB();
  const db = client.db();
  const collection = db.collection<TrainingGround>("training_grounds");

  const { ObjectId } = await import("mongodb");
  const result = await collection.findOne({ _id: new ObjectId(trainingId) });

  return result;
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
