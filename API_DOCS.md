# AdaptiQ Live - API Documentation

## You.com API Integration

### Base Configuration

```typescript
const apiKey = process.env.YOU_COM_API_KEY;
const baseUrl = "https://api.you.com";
```

### Endpoint Used: Smart Chat

**URL:** `https://api.you.com/smart/chat`

**Method:** `POST`

**Headers:**

```json
{
  "Content-Type": "application/json",
  "X-API-Key": "your_api_key_here"
}
```

**Request Body:**

```json
{
  "query": "Research the latest best practices for...",
  "chat_mode": "smart",
  "include_citations": true
}
```

### Response Format

```json
{
  "answer": "JSON string containing questions...",
  "citations": [
    {
      "url": "https://react.dev/...",
      "title": "React Documentation"
    }
  ]
}
```

## Function Reference

### `fetchQuestionsFromYouAPI(topic: string)`

**Purpose:** Fetch fresh questions from You.com API based on a topic

**Parameters:**

- `topic` (string): The weak topic to research (e.g., "React Server Actions")

**Returns:**

```typescript
{
  questions: Question[];
  citations: Citation[];
  sourceLinks: string[];
}
```

**Example:**

```typescript
const result = await fetchQuestionsFromYouAPI("React Server Actions");
console.log(result.questions); // Array of 3 questions
console.log(result.sourceLinks); // URLs used by You.com
```

### `generateLiveQuiz(weakTopic: string)`

**Purpose:** Main action to generate a quiz and save it to MongoDB

**Parameters:**

- `weakTopic` (string): The topic to practice

**Returns:**

```typescript
TrainingGround {
  _id: ObjectId;
  topic: string;
  generated_at: Date;
  raw_ai_response: {
    questions: Question[];
    citations: Citation[];
  };
  source_links: string[];
}
```

**Example:**

```typescript
"use server";
import { generateLiveQuiz } from "@/actions/ai-generation";

const result = await generateLiveQuiz("Next.js 15 App Router");
console.log(result.raw_ai_response.questions);
```

### `getTrainingGroundsByTopic(topic: string)`

**Purpose:** Retrieve all training grounds for a specific topic

**Returns:** `TrainingGround[]`

### `getLatestTrainingGround()`

**Purpose:** Get the most recent training ground

**Returns:** `TrainingGround | null`

## Type Definitions

### Question

```typescript
type Question = {
  id: string;
  question: string;
  options: string[];
  correct_answer: number; // Index of correct option
  explanation: string;
  difficulty?: "easy" | "medium" | "hard";
};
```

### Citation

```typescript
type Citation = {
  title: string;
  url: string;
  snippet?: string;
};
```

### TrainingGround

```typescript
type TrainingGround = {
  _id?: ObjectId;
  topic: string;
  generated_at: Date;
  raw_ai_response: {
    questions: Question[];
    citations?: Citation[];
  };
  source_links: string[];
};
```

## Error Handling

### Common Errors

1. **Missing API Key**

   ```
   Error: YOU_COM_API_KEY is not configured in environment variables
   ```

   **Solution:** Add `YOU_COM_API_KEY` to `.env`

2. **API Error**

   ```
   Error: You.com API error: 401 - Unauthorized
   ```

   **Solution:** Check API key validity

3. **JSON Parsing Error**

   ```
   Error: Failed to parse You.com response as JSON
   ```

   **Solution:** The AI returned non-JSON content. Check the raw response.

4. **Invalid Response Structure**
   ```
   Error: Invalid response structure: missing questions array
   ```
   **Solution:** The AI didn't follow the expected format. Retry the request.

## Rate Limits

Check You.com's official documentation for current rate limits:

- Free tier: Usually limited requests per minute
- Paid tier: Higher limits based on plan

## Best Practices

1. **Prompt Engineering:**
   - Always specify "Return ONLY valid JSON"
   - Include examples of expected format
   - Prioritize official documentation in prompt

2. **Error Handling:**
   - Wrap API calls in try-catch
   - Provide user-friendly error messages
   - Log raw responses for debugging

3. **Citation Handling:**
   - Deduplicate URLs
   - Validate URLs before displaying
   - Handle missing citations gracefully

4. **Performance:**
   - Cache frequently requested topics
   - Implement rate limiting on client side
   - Use loading states for better UX

## Testing

### Manual Test

```bash
# Create a .env file first
cp .env.example .env

# Add your API key to .env
# Then run:
npm run dev

# Visit http://localhost:3000
```

### API Test Script

```bash
# Test just the API integration
npx ts-node test-api.ts
```

## Environment Variables

Required:

- `YOU_COM_API_KEY` - Your You.com API key
- `MONGODB_URI` - MongoDB connection string

Optional:

- `NEXT_PUBLIC_APP_URL` - App URL for production

---

**Last Updated:** January 21, 2026
