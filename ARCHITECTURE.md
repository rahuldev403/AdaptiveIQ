# AdaptiQ Live - Architecture Overview

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │           Next.js 15 Frontend (React 19)                 │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────────┐    │   │
│  │  │  page.tsx  │  │ QuizCard   │  │ LiveSourceBadge│    │   │
│  │  │  (Client)  │  │ Component  │  │ ReadSourceBtn  │    │   │
│  │  └────────────┘  └────────────┘  └────────────────┘    │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────────┘
                       │ Server Actions
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Next.js 15 Backend (App Router)                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │          actions/ai-generation.ts                        │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │  generateLiveQuiz()                              │   │   │
│  │  │    ↓                                             │   │   │
│  │  │  fetchQuestionsFromYouAPI()                      │   │   │
│  │  │    ↓                                             │   │   │
│  │  │  Parse JSON + Extract Citations                  │   │   │
│  │  │    ↓                                             │   │   │
│  │  │  Save to MongoDB                                 │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
└──────────┬────────────────────────────┬─────────────────────────┘
           │                            │
           ▼                            ▼
┌──────────────────────┐    ┌──────────────────────────┐
│   You.com API        │    │   MongoDB Database       │
│  (Smart Mode)        │    │  ┌────────────────────┐  │
│  ┌────────────────┐  │    │  │ training_grounds   │  │
│  │ Research       │  │    │  │ Collection         │  │
│  │ + Generation   │  │    │  │ ┌────────────────┐ │  │
│  │ + Citations    │  │    │  │ │ topic          │ │  │
│  └────────────────┘  │    │  │ │ generated_at   │ │  │
└──────────────────────┘    │  │ │ raw_ai_response│ │  │
                             │  │ │ source_links   │ │  │
                             │  │ └────────────────┘ │  │
                             │  └────────────────────┘  │
                             └──────────────────────────┘
```

## 🔄 Data Flow

### 1. Quiz Generation Flow

```
User enters topic → Click "Generate Quiz"
        ↓
Client calls generateLiveQuiz() server action
        ↓
Server constructs research prompt
        ↓
POST request to You.com Smart Chat API
        ↓
You.com researches latest best practices (2025)
        ↓
Returns JSON with questions + citations
        ↓
Server parses response & extracts URLs
        ↓
Save to MongoDB training_grounds collection
        ↓
Return TrainingGround object to client
        ↓
Client renders QuizCard components with LiveSourceBadge
```

### 2. Answer Submission Flow

```
User selects answer → QuizCard.handleOptionClick()
        ↓
Update local state (selectedAnswer, hasAnswered)
        ↓
Check if correct: selectedAnswer === question.correct_answer
        ↓
Show explanation (always)
        ↓
If wrong: Show ReadSourceButton with citations
        ↓
User clicks "Read Source"
        ↓
Open citation URL in new tab
```

## 📦 Component Hierarchy

```
app/page.tsx (Client Component)
├── <input> Topic Input
├── <button> Generate Quiz Button
├── Score Card (conditional)
└── Quiz Section
    ├── <QuizCard> (for each question)
    │   ├── <LiveSourceBadge>
    │   ├── Question Text
    │   ├── Options (A, B, C, D)
    │   ├── Explanation (when answered)
    │   └── <ReadSourceButton> (when wrong)
    │       └── Citations List
    └── Sources Section
        └── List of all source links
```

## 🗄️ Database Schema

```typescript
training_grounds {
  _id: ObjectId,
  topic: string,
  generated_at: Date,
  raw_ai_response: {
    questions: [
      {
        id: string,
        question: string,
        options: string[],
        correct_answer: number,
        explanation: string,
        difficulty: "easy" | "medium" | "hard"
      }
    ],
    citations: [
      {
        title: string,
        url: string,
        snippet: string
      }
    ]
  },
  source_links: string[] // The USP!
}
```

## 🔐 Security Considerations

### Server-Side Only

- You.com API key is NEVER exposed to client
- All API calls happen in server actions (`"use server"`)
- MongoDB connection string is server-side only

### Environment Variables

```
YOU_COM_API_KEY=xxx     # Server only
MONGODB_URI=xxx          # Server only
```

### Data Validation

- Input validation on topic (non-empty string)
- JSON schema validation before parsing
- URL validation before displaying citations

## 🚀 Performance Optimizations

### 1. Server Actions

- Eliminates need for separate API routes
- Automatic code splitting
- Optimized data serialization

### 2. Client-Side State

- Local state for quiz interaction
- No unnecessary re-renders
- Conditional rendering for performance

### 3. Database Queries

- Indexed on `topic` and `generated_at`
- Efficient sorting with `.sort()`
- Projection to limit returned fields

### 4. API Efficiency

- Single API call per quiz generation
- Batch processing of citations
- Deduplication of source URLs

## 🧩 Module Dependencies

```
actions/ai-generation.ts
  ├── lib/db (MongoDB connection)
  │   └── lib/db/schema (TypeScript types)
  └── process.env.YOU_COM_API_KEY

components/QuizCard.tsx
  ├── components/LiveSourceBadge.tsx
  ├── components/ReadSourceButton.tsx
  └── lib/db/schema (types only)

app/page.tsx
  ├── actions/ai-generation (server actions)
  ├── components/QuizCard.tsx
  └── lib/db/schema (types only)
```

## 📊 Scaling Considerations

### Horizontal Scaling

- Next.js can be deployed to multiple instances
- MongoDB can be replicated
- You.com API supports concurrent requests

### Caching Strategy

```typescript
// Future enhancement: Redis cache
const cacheKey = `quiz:${topic}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

// ... generate quiz ...

await redis.set(cacheKey, JSON.stringify(result), "EX", 3600);
```

### Database Optimization

```typescript
// Index creation for faster queries
db.training_grounds.createIndex({ topic: 1, generated_at: -1 });
db.training_grounds.createIndex({ generated_at: -1 });
```

## 🔄 Future Architecture Enhancements

### 1. User Authentication

```
Add: NextAuth.js
Schema: users collection
Relation: training_grounds.user_id → users._id
```

### 2. Real-Time Updates

```
Add: WebSockets or Server-Sent Events
Use: For live quiz sessions with multiple users
```

### 3. Analytics Pipeline

```
Add: training_grounds_analytics collection
Track: User performance, popular topics, success rates
```

### 4. Multi-Model AI

```
Add: OpenAI, Anthropic as fallbacks
Strategy: Round-robin or performance-based selection
```

## 🎯 Key Architectural Decisions

### Why Next.js 15 App Router?

- **Server Actions:** Seamless client-server communication
- **Automatic Code Splitting:** Better performance
- **Built-in TypeScript:** Type safety throughout
- **Vercel Optimization:** Easy deployment

### Why MongoDB + Drizzle?

- **Flexible Schema:** Perfect for dynamic AI responses
- **Fast Queries:** NoSQL performance for read-heavy workload
- **Type Safety:** Drizzle provides TypeScript integration
- **Scalability:** Easy horizontal scaling

### Why You.com API?

- **Research Mode:** Perfect for finding latest documentation
- **Citations Included:** The USP of our platform
- **Fresh Data:** Always pulls from 2025 sources
- **Quality:** Prioritizes official documentation

### Why Server Actions over API Routes?

- **Less Boilerplate:** No need for separate API layer
- **Type Safety:** Automatic type inference
- **Performance:** Optimized by Next.js
- **Developer Experience:** Simpler code structure

---

**Architecture Version:** 1.0.0  
**Last Updated:** January 21, 2026  
**Built for:** Microsoft GenAI Demo Day 2026
