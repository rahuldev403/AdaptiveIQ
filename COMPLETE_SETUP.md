# 🔧 Complete Setup Instructions - AdaptiQ Live with Clerk Auth

## ✅ Changes Made

### 1. Fixed MongoDB Connection Error

- **Problem:** `drizzle-orm/mongodb` import was failing
- **Solution:** Removed Drizzle ORM, using native MongoDB driver instead
- **Files Changed:**
  - `lib/db/index.ts` - Simplified to pure MongoDB
  - `lib/db/schema.ts` - Kept only TypeScript types
  - Removed `drizzle.config.ts`

### 2. Added Clerk Authentication

- **Feature:** Modal-based authentication (not redirect!)
- **Files Added:**
  - `middleware.ts` - Route protection
  - `CLERK_SETUP.md` - Setup guide
- **Files Modified:**
  - `app/layout.tsx` - Added ClerkProvider
  - `app/page.tsx` - Added SignIn/SignUp buttons and UserButton
  - `.env.example` - Added Clerk environment variables

## 🚀 Quick Start

### Step 1: Get Clerk API Keys

1. Visit [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Create a new application
3. Choose "Next.js" as framework
4. Copy your keys from the API Keys page

### Step 2: Configure Environment

Create/update your `.env` file:

```env
# You.com API
YOU_COM_API_KEY=your_you_com_api_key_here

# MongoDB
MONGODB_URI=mongodb://localhost:27017/adaptiq_live

# Clerk Authentication (Get from dashboard.clerk.com)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Start MongoDB

```bash
# Windows
net start MongoDB

# macOS/Linux
mongod
```

### Step 5: Run the App

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

## 🎯 Testing Authentication

1. **Click "Sign Up"** in the top right corner
2. **Modal opens** (not a new page - this is the key feature!)
3. **Create an account** with email
4. **After signing in**, you'll see:
   - Your name/email in the top right
   - Your profile avatar
   - UserButton for account management

## 🔐 Authentication Features

### Modal Mode (Not Redirect!)

```tsx
<SignInButton mode="modal">
  {" "}
  {/* ← This ensures modal! */}
  <button>Sign In</button>
</SignInButton>
```

### Auto User Detection

```tsx
const { isSignedIn, user } = useUser();

{
  isSignedIn ? (
    <UserButton /> // Shows profile
  ) : (
    <SignInButton /> // Shows sign in
  );
}
```

### Route Protection

Middleware automatically protects routes. Home page is public by default.

## 📁 Key Changes Summary

### Before (With Drizzle Error):

```typescript
// ❌ This was failing
import { drizzle } from "drizzle-orm/mongodb";
export const db = drizzle(client);
```

### After (Native MongoDB):

```typescript
// ✅ This works
import { MongoClient } from "mongodb";
export async function connectDB() {
  await client.connect();
  return client;
}
```

## 🎨 UI Changes

### Top Right Corner:

- **Not signed in:** Shows "Sign In" and "Sign Up" buttons
- **Signed in:** Shows user name + profile avatar

### Modal Authentication:

- Click "Sign In" → Modal opens
- Click "Sign Up" → Modal opens
- No page redirects!

## 🛠️ Customization

### Change Clerk Theme

In `app/layout.tsx`:

```tsx
<ClerkProvider
  appearance={{
    variables: {
      colorPrimary: "#3b82f6",  // Change this!
    },
  }}
>
```

### Protect More Routes

In `middleware.ts`:

```typescript
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  // "/" // Remove to require auth for home page
]);
```

## 📊 Database Collections

### training_grounds

```typescript
{
  _id: ObjectId
  topic: string
  generated_at: Date
  raw_ai_response: {
    questions: Question[]
    citations: Citation[]
  }
  source_links: string[]
}
```

No Drizzle schema needed - pure MongoDB!

## ✅ Checklist

- [ ] Clerk account created
- [ ] API keys added to `.env`
- [ ] MongoDB running
- [ ] `npm install` completed
- [ ] `npm run dev` works
- [ ] Can click "Sign Up" and see modal
- [ ] Modal authentication works (not redirect!)
- [ ] Can generate quiz after signing in

## 🐛 Troubleshooting

### Error: "Clerk: Missing publishable key"

**Fix:** Add `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` to `.env`

### Error: "MongoDB connection failed"

**Fix:** Start MongoDB with `net start MongoDB` (Windows) or `mongod` (Mac/Linux)

### Issue: Sign in opens new page instead of modal

**Fix:** Ensure `mode="modal"` is set:

```tsx
<SignInButton mode="modal">
```

### Error: Module not found (drizzle)

**Fix:** Already fixed! We removed Drizzle. Run `npm install` to clean up.

## 📚 Documentation

- [CLERK_SETUP.md](CLERK_SETUP.md) - Detailed Clerk setup
- [README.md](README.md) - Project overview
- [QUICKSTART.md](QUICKSTART.md) - 5-minute setup guide

## 🎉 You're Ready!

Everything is configured for:
✅ Modal authentication (no redirects!)  
✅ Clean MongoDB integration (no Drizzle errors!)  
✅ User profile management  
✅ Protected routes (optional)

**Run `npm run dev` and start building! 🚀**
