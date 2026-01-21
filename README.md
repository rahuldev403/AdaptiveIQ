# AdaptiQ Live 🚀

> **AI-Powered Coding Learning Platform** for Microsoft GenAI Demo Day 2026

A revolutionary "Live Training Ground" that identifies weak topics, researches them in real-time using You.com API, and generates fresh questions based on the latest web data.

## 🌟 Key Features

### 1. **Real-Time Research & Generation**
- Uses You.com's Smart Mode to research the latest best practices
- Generates questions based on 2025 documentation and engineering blogs
- **USP:** Every question comes with citation URLs showing the exact sources used

### 2. **Live Source Badge**
- Each quiz card displays a "Generated from [domain]" badge
- Shows which authoritative source (e.g., react.dev) was used
- Animated live indicator for real-time feel

### 3. **"Read Source" Button**
- Appears when users get a question wrong
- Opens the specific URL You.com used to generate the answer
- Helps users learn directly from official documentation

### 4. **Adaptive Learning**
- Focus on weak topics identified by the system
- Fresh content on every generation (no stale question banks)
- Citations allow verification and deeper learning

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database:** MongoDB + Drizzle ORM
- **AI Engine:** You.com API (Smart/Research Mode)
- **Styling:** Tailwind CSS

## 📦 Project Structure

```
adaptiq-live/
├── actions/
│   └── ai-generation.ts         # You.com API integration & quiz generation
├── app/
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Main quiz interface
│   └── globals.css              # Global styles
├── components/
│   ├── LiveSourceBadge.tsx      # "Generated from [domain]" badge
│   ├── ReadSourceButton.tsx     # "Read Source" button with citations
│   └── QuizCard.tsx             # Complete quiz card component
├── lib/
│   └── db/
│       ├── index.ts             # MongoDB connection
│       └── schema.ts            # Drizzle schema & TypeScript types
├── .env.example                 # Environment variables template
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── drizzle.config.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or Atlas)
- You.com API Key ([Get one here](https://you.com))

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd adaptiq-live
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your credentials:
   ```env
   YOU_COM_API_KEY=your_you_com_api_key_here
   MONGODB_URI=mongodb://localhost:27017/adaptiq_live
   ```

4. **Start MongoDB (if using local):**
   ```bash
   # macOS/Linux
   mongod

   # Windows
   net start MongoDB
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎯 How It Works

### Backend Flow (actions/ai-generation.ts)

```typescript
generateLiveQuiz(weakTopic: string)
  ↓
fetchQuestionsFromYouAPI(topic)
  ↓
Call You.com Smart Mode API
  ↓
Parse JSON response + Extract citations
  ↓
Save to MongoDB (training_grounds collection)
  ↓
Return questions + source URLs
```

### API Call Example

The system sends this prompt to You.com:

```
Research the latest best practices for "React Server Actions" as of 2025.
Based on this research, generate 3 strictly formatted multiple-choice questions.

CRITICAL REQUIREMENTS:
- Prioritize official documentation and recent engineering blogs
- Return ONLY valid JSON (no markdown, no code blocks)
```

### Response Format

```json
{
  "questions": [
    {
      "id": "q1",
      "question": "What is the recommended way to handle mutations in Next.js 15?",
      "options": ["useState", "useFormState", "useActionState", "useMutation"],
      "correct_answer": 2,
      "explanation": "useActionState is the new React 19 hook...",
      "difficulty": "medium"
    }
  ],
  "citations": [
    {
      "title": "Server Actions - Next.js",
      "url": "https://nextjs.org/docs/app/api-reference/functions/server-actions",
      "snippet": "Server Actions are asynchronous functions..."
    }
  ]
}
```

## 📊 Database Schema

### `training_grounds` Collection

| Field | Type | Description |
|-------|------|-------------|
| `_id` | ObjectId | MongoDB document ID |
| `topic` | String | The weak topic being practiced |
| `generated_at` | Date | When the quiz was generated |
| `raw_ai_response` | Object | Questions array + citations |
| `source_links` | Array | URLs You.com used (the USP!) |

## 🎨 UI Components

### LiveSourceBadge
- Shows the domain of the primary source
- Animated pulse indicator
- Gradient background with border

### ReadSourceButton
- Appears when answer is wrong
- Links to official documentation
- Expandable list for multiple sources

### QuizCard
- Multiple choice interface
- Real-time feedback
- Color-coded correct/incorrect answers
- Integrated source badge and read button

## 🔑 Key Implementation Details

### 1. **Strict JSON Parsing**
The You.com API prompt enforces strict JSON output to avoid parsing errors:
- No markdown code blocks
- No extra text
- Validated structure before parsing

### 2. **Citation Extraction**
The system extracts citations from two sources:
- **AI-generated citations** (in the JSON response)
- **You.com metadata citations** (from API response)

### 3. **Error Handling**
Comprehensive error handling for:
- API failures
- JSON parsing errors
- Database connection issues
- Missing environment variables

## 🧪 Testing the System

1. **Enter a topic:** e.g., "React Server Actions"
2. **Click "Generate Quiz"**
3. **Observe:**
   - Live Source badge appears with the domain
   - Questions are fresh and based on 2025 practices
   - When you answer wrong, "Read Source" button appears
4. **Click "Read Source"** to verify the citations

## 📈 Future Enhancements

- [ ] User authentication and progress tracking
- [ ] Difficulty adaptation based on performance
- [ ] Spaced repetition algorithm
- [ ] Team leaderboards
- [ ] More AI providers (OpenAI, Anthropic)
- [ ] Mobile app (React Native)

## 🏆 Demo Day Pitch Points

1. **"Always Fresh" USP:** Unlike static question banks, every question is researched in real-time from 2025 sources
2. **Transparency:** Users see exactly which sources were used (citations)
3. **Learning Focused:** "Read Source" button turns mistakes into learning opportunities
4. **Scalable:** Works for any programming topic or framework
5. **Enterprise Ready:** Built with Next.js 15, TypeScript, and production-grade architecture

## 🤝 Contributing

This project was built for the Microsoft GenAI Demo Day. Contributions are welcome!

## 📄 License

MIT License - feel free to use this for your own projects!

## 🙏 Acknowledgments

- **You.com** for their powerful AI search API
- **Vercel** for Next.js 15 and App Router
- **MongoDB** for flexible document storage
- **Microsoft** for hosting the GenAI Demo Day

---

**Built with ❤️ for the future of adaptive learning**
# AdaptiveIQ
