# 🔐 Clerk Authentication Setup Guide

## Quick Setup (5 minutes)

### Step 1: Get Clerk API Keys

1. Go to [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Sign up or log in
3. Create a new application
4. Choose "Next.js" as your framework
5. Copy your API keys from the dashboard

### Step 2: Add Keys to .env

Open your `.env` file and add:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here
```

**Important:**

- Get these from your Clerk dashboard
- The `NEXT_PUBLIC_` prefix is required for the publishable key
- Never commit the `.env` file to git

### Step 3: Configure Modal Settings (Already Done!)

The modal authentication is already configured in the code:

```tsx
<SignInButton mode="modal">
  <button>Sign In</button>
</SignInButton>

<SignUpButton mode="modal">
  <button>Sign Up</button>
</SignUpButton>
```

This ensures the auth forms open as modals, not on a separate page.

### Step 4: Run the App

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Step 5: Test Authentication

1. Click "Sign Up" button in the top right
2. Modal should appear (not a new page!)
3. Create an account
4. After signing in, you'll see your profile picture and name
5. Click the profile to access account settings

## Features Implemented

✅ **Modal Authentication** - Sign in/up opens in a popup, not a new page  
✅ **User Profile** - Shows user name and avatar when signed in  
✅ **Protected Routes** - Middleware controls access (optional)  
✅ **Automatic Session Management** - Clerk handles everything

## Customization

### Change Modal Appearance

In `app/layout.tsx`, customize the `appearance` prop:

```tsx
<ClerkProvider
  appearance={{
    variables: {
      colorPrimary: "#3b82f6",  // Blue
      colorBackground: "#ffffff",
      colorText: "#000000"
    },
  }}
>
```

### Protect Specific Pages

In `middleware.ts`, add routes to protect:

```typescript
const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/", // Home is public
]);
```

Remove "/" to require authentication for the entire app.

## Troubleshooting

### Issue: "Clerk: Missing publishable key"

**Solution:** Check that `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is in your `.env` file

### Issue: Modal opens in new page

**Solution:** Ensure `mode="modal"` is set on `<SignInButton>` and `<SignUpButton>`

### Issue: User info not showing

**Solution:** Make sure you're using the `useUser()` hook in a client component

## Next Steps

- [ ] Customize Clerk appearance to match your brand
- [ ] Add user metadata (store quiz history per user)
- [ ] Implement role-based access (admin, student, teacher)
- [ ] Add social login (Google, GitHub, etc.) in Clerk dashboard

---

**Clerk is now configured with modal authentication! 🎉**
