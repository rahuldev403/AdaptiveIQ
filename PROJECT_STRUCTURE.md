# 📁 AdaptiQ Live - Complete Project Structure

```
d:\d_backup\projects\y.code\
│
├── 📄 Configuration Files
│   ├── package.json                    # Dependencies and scripts
│   ├── tsconfig.json                   # TypeScript configuration
│   ├── next.config.ts                  # Next.js configuration
│   ├── tailwind.config.ts              # Tailwind CSS configuration
│   ├── postcss.config.mjs              # PostCSS configuration
│   ├── drizzle.config.ts               # Drizzle ORM configuration
│   ├── .eslintrc.json                  # ESLint configuration
│   ├── .gitignore                      # Git ignore rules
│   ├── .env.example                    # Environment variables template
│   └── .env                            # Your actual environment variables (not in git)
│
├── 📱 Application Code
│   ├── app/                            # Next.js 15 App Router
│   │   ├── layout.tsx                  # Root layout with metadata
│   │   ├── page.tsx                    # Main quiz interface (client component)
│   │   └── globals.css                 # Global styles with Tailwind
│   │
│   ├── actions/                        # Server Actions
│   │   ├── ai-generation.ts            # Main You.com API integration ⭐
│   │   └── ai-generation-alternatives.ts # Alternative implementations
│   │
│   ├── components/                     # React Components
│   │   ├── QuizCard.tsx                # Main quiz card component
│   │   ├── LiveSourceBadge.tsx         # "Generated from [domain]" badge ⭐
│   │   └── ReadSourceButton.tsx        # "Read Source" button with citations ⭐
│   │
│   └── lib/                            # Utility Libraries
│       ├── db/
│       │   ├── index.ts                # MongoDB connection
│       │   └── schema.ts               # Drizzle schema & TypeScript types
│       ├── you-api.ts                  # You.com API types and utilities
│       └── hooks.ts                    # Custom React hooks
│
└── 📚 Documentation
    ├── README.md                       # Main project documentation
    ├── QUICKSTART.md                   # 5-minute setup guide
    ├── SETUP.md                        # Detailed setup instructions
    ├── ARCHITECTURE.md                 # System architecture overview
    ├── API_DOCS.md                     # API integration documentation
    ├── DEMO_SCRIPT.md                  # Microsoft Demo Day presentation script
    └── test-api.ts                     # API testing script
```

## 🎯 Key Files Explained

### Core Implementation (The Heart of AdaptiQ Live)

#### [actions/ai-generation.ts](actions/ai-generation.ts) ⭐⭐⭐

**Purpose:** Main You.com API integration - This is where the magic happens!

**Key Functions:**

- `fetchQuestionsFromYouAPI(topic)` - Calls You.com Smart Mode API
- `generateLiveQuiz(weakTopic)` - Main action that saves to MongoDB
- `getTrainingGroundsByTopic(topic)` - Retrieves past quizzes
- `getLatestTrainingGround()` - Gets most recent quiz

**Features:**

- Constructs research prompt with strict JSON formatting
- Extracts questions AND citations from You.com
- Handles JSON parsing with error recovery
- Saves to MongoDB with proper schema

---

#### [components/LiveSourceBadge.tsx](components/LiveSourceBadge.tsx) ⭐

**Purpose:** The USP visual indicator

**What it does:**

- Shows "Generated from [domain]" badge
- Animated pulse for "live" feel
- Extracts domain from full URLs
- Gradient styling with Tailwind

**Example:**

```tsx
<LiveSourceBadge sourceUrl="https://nextjs.org/docs/..." />
// Renders: "Generated from nextjs.org"
```

---

#### [components/ReadSourceButton.tsx](components/ReadSourceButton.tsx) ⭐

**Purpose:** Learning from mistakes - click to see the official source

**What it does:**

- Only appears when answer is wrong
- Shows primary citation with title
- Expandable list for additional sources
- Opens URLs in new tab

**Example:**

```tsx
<ReadSourceButton
  citations={[{ title: "Server Actions", url: "https://nextjs.org/docs/..." }]}
  onOpenSource={(url) => window.open(url, "_blank")}
/>
```

---

#### [components/QuizCard.tsx](components/QuizCard.tsx)

**Purpose:** Complete quiz experience in one component

**Features:**

- Multiple choice interface (A, B, C, D)
- Real-time answer validation
- Color-coded feedback (green = correct, red = wrong)
- Integrated explanation display
- Conditional rendering of ReadSourceButton

---

#### [app/page.tsx](app/page.tsx)

**Purpose:** Main UI that ties everything together

**Features:**

- Topic input with quick topics
- Real-time quiz generation with loading state
- Score tracking
- Error handling with user-friendly messages
- Sources section at bottom

---

### Database Layer

#### [lib/db/schema.ts](lib/db/schema.ts)

**Purpose:** MongoDB schema and TypeScript types

**Collections:**

```typescript
training_grounds {
  _id: ObjectId
  topic: string
  generated_at: Date
  raw_ai_response: {
    questions: Question[]
    citations: Citation[]
  }
  source_links: string[]  // The USP!
}
```

---

#### [lib/db/index.ts](lib/db/index.ts)

**Purpose:** MongoDB connection management

**Features:**

- Singleton connection pattern
- Connection pooling
- Error handling
- Drizzle ORM integration

---

### Configuration

#### [drizzle.config.ts](drizzle.config.ts)

Drizzle ORM configuration for MongoDB

#### [tailwind.config.ts](tailwind.config.ts)

Tailwind CSS configuration with custom colors

#### [next.config.ts](next.config.ts)

Next.js configuration with Server Actions body size limit

---

## 🔑 Critical Files for Demo Day

### Must Review Before Demo:

1. ✅ [actions/ai-generation.ts](actions/ai-generation.ts) - Main logic
2. ✅ [app/page.tsx](app/page.tsx) - UI experience
3. ✅ [.env](.env) - API keys configured
4. ✅ [DEMO_SCRIPT.md](DEMO_SCRIPT.md) - Presentation flow

### Must Test:

1. ✅ Quiz generation works
2. ✅ Citations are extracted
3. ✅ Live Source badge displays correctly
4. ✅ Read Source button opens URLs
5. ✅ MongoDB saves data

---

## 🚀 Quick Commands Reference

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Database commands
npm run db:generate  # Generate migrations
npm run db:push      # Push schema to database
npm run db:studio    # Open Drizzle Studio
```

---

## 📦 Dependencies Breakdown

### Production Dependencies:

- `next` (^15.1.0) - React framework with App Router
- `react` (^19.0.0) - UI library
- `react-dom` (^19.0.0) - React DOM renderer
- `drizzle-orm` (^0.36.4) - TypeScript ORM for MongoDB
- `mongodb` (^6.12.0) - MongoDB driver
- `zod` (^3.24.1) - Schema validation

### Development Dependencies:

- `typescript` (^5) - Type safety
- `tailwindcss` (^3.4.1) - Utility-first CSS
- `eslint` (^8) - Code linting
- `drizzle-kit` (^0.28.1) - Drizzle CLI tools

---

## 🎨 Styling Approach

### Tailwind Classes Used:

- **Gradients:** `bg-gradient-to-r from-blue-600 to-purple-600`
- **Animations:** `animate-ping` for live indicator
- **Dark mode:** `dark:bg-gray-800` throughout
- **Responsive:** Mobile-first approach

---

## 🔐 Environment Variables

Required in `.env`:

```env
YOU_COM_API_KEY=xxx           # Get from you.com
MONGODB_URI=xxx               # MongoDB connection string
NEXT_PUBLIC_APP_URL=xxx       # App URL (optional)
```

---

## 📊 File Size Summary

```
Total Files: 25
Total Lines: ~2,500
TypeScript: 85%
Documentation: 15%

Largest files:
1. app/page.tsx (~350 lines)
2. actions/ai-generation.ts (~250 lines)
3. components/QuizCard.tsx (~200 lines)
4. README.md (~300 lines)
```

---

## ✅ Implementation Checklist

- [x] Next.js 15 with App Router
- [x] TypeScript throughout
- [x] You.com API integration (Smart Mode)
- [x] MongoDB + Drizzle ORM
- [x] Server Actions for API calls
- [x] Live Source Badge component
- [x] Read Source Button component
- [x] Complete QuizCard component
- [x] Error handling
- [x] Loading states
- [x] Dark mode support
- [x] Mobile responsive
- [x] Comprehensive documentation

---

**Project Status:** ✅ Ready for Microsoft GenAI Demo Day 2026
