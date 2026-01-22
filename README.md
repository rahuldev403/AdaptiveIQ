# AdaptiQ Live

An AI-powered coding learning platform with dynamic quizzes and real-time training ground.

## Features

- 🎯 **Dynamic Dashboard**: Browse subjects and track your progress
- 📝 **Database-Driven Quizzes**: 15 questions per subject with instant feedback
- 🤖 **AI Training Ground**: Generate custom quizzes on any topic using You.com API
- 🔐 **Clerk Authentication**: Secure modal-based authentication
- 🎨 **Modern UI**: Built with Next.js 15, shadcn UI, and black/white theme
- 📊 **Progress Tracking**: Monitor your performance across subjects

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5
- **Database**: MongoDB (Native Driver)
- **Authentication**: Clerk
- **UI Library**: shadcn UI
- **Styling**: Tailwind CSS
- **AI**: You.com API

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB installed locally OR MongoDB Atlas account
- Clerk account (free tier works)
- You.com API key

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/adaptiq
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/adaptiq

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

# You.com API (for AI Training Ground)
YOU_API_KEY=your-you-api-key
```

#### Getting Clerk Keys

1. Go to [clerk.com](https://clerk.com) and create a free account
2. Create a new application
3. Go to **API Keys** in the dashboard
4. Copy the **Publishable Key** and **Secret Key**

#### Getting You.com API Key

1. Go to [api.you.com](https://api.you.com)
2. Sign up and generate an API key

### 3. Set Up MongoDB

#### Option A: Local MongoDB

```bash
# macOS (with Homebrew)
brew install mongodb-community
brew services start mongodb-community

# Windows: Download from mongodb.com and start service
# Linux: sudo apt-get install mongodb && sudo systemctl start mongodb
```

#### Option B: MongoDB Atlas (Cloud)

1. Create a free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user and whitelist IP
3. Get connection string and add to `.env.local`

### 4. Seed the Database

```bash
npm run seed
```

Expected output:

```
✓ Connected to MongoDB
✓ Inserted 4 subjects
✓ Created indexes
✅ Database seeded successfully!
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
├── dashboard/          # User dashboard with subjects
├── quiz/[id]/         # Quiz interface (15 questions)
├── training-ground/   # AI-powered custom quiz generation
├── layout.tsx         # Root layout with Clerk
├── page.tsx           # Landing page
└── globals.css        # Black/white theme

actions/
├── quiz-actions.ts    # Server actions for quiz data
└── ai-generation.ts   # You.com AI integration

components/ui/         # shadcn UI components
lib/db/               # MongoDB connection & schema
scripts/              # Database seeding
```

## Usage

### Dashboard

- View all subjects organized by category
- Track progress on each subject
- Start or continue quizzes

### Quizzes

- 15 multiple-choice questions per subject
- Instant feedback with explanations
- Automatic progress saving
- Real-time scoring

### Training Ground

- Enter any programming topic
- AI researches in real-time
- Generates fresh questions with citations
- Includes source documentation links

## Database Schema

### Subjects

```typescript
{
  title: string,
  description: string,
  icon: string,
  category: "Frontend" | "Backend" | "Languages",
  questions: Array<Question>,
  created_at: Date
}
```

### User Progress

```typescript
{
  user_id: string,
  subject_id: ObjectId,
  completed_questions: number[],
  score: number,
  last_attempt: Date
}
```

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

**Required Environment Variables:**

- `MONGODB_URI` (MongoDB Atlas for production)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
- `YOU_API_KEY`

## Troubleshooting

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution**: Ensure MongoDB is running or use MongoDB Atlas.

### Clerk Not Working

**Solution**: Verify Clerk keys in `.env.local` and restart dev server.

### Seed Script Fails

**Solution**: Check `MONGODB_URI` is set and MongoDB is accessible.

## License

MIT License

---

Built with Next.js, MongoDB, Clerk, and You.com AI
