# 🚀 Quick Start Guide

Get AdaptiQ Live running in 5 minutes!

## Prerequisites Check

```bash
# Check Node.js version (need 18+)
node --version

# Check npm version
npm --version

# Check if MongoDB is installed
mongod --version
```

If any are missing, install them first.

---

## Step 1: Install Dependencies (1 minute)

```bash
cd d:\d_backup\projects\y.code
npm install
```

Expected output:

```
added 342 packages, and audited 343 packages in 45s
```

---

## Step 2: Configure Environment (1 minute)

```bash
# Copy the example file
copy .env.example .env

# Open .env and add your credentials
notepad .env
```

Add:

```env
YOU_COM_API_KEY=your_actual_api_key_here
MONGODB_URI=mongodb://localhost:27017/adaptiq_live
```

**Where to get You.com API key:**

1. Go to https://you.com
2. Sign up / Log in
3. Navigate to API settings
4. Generate new API key
5. Copy and paste into `.env`

---

## Step 3: Start MongoDB (30 seconds)

### Windows:

```bash
net start MongoDB
```

### macOS/Linux:

```bash
mongod
```

Or use MongoDB Atlas (cloud):

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/adaptiq_live
```

---

## Step 4: Run Development Server (30 seconds)

```bash
npm run dev
```

Expected output:

```
  ▲ Next.js 15.1.0
  - Local:        http://localhost:3000
  - Ready in 2.3s
```

---

## Step 5: Test the App (2 minutes)

1. **Open browser:** http://localhost:3000

2. **Enter a topic:**

   ```
   Topic: React Server Actions
   ```

3. **Click "Generate Quiz"**
   - Should see loading spinner
   - Wait 10-15 seconds

4. **Verify the results:**
   - [ ] 3 questions appear
   - [ ] Live Source badge shows "Generated from [domain]"
   - [ ] Questions have 4 options each

5. **Test the learning flow:**
   - Answer one question wrong (intentionally)
   - [ ] Explanation appears
   - [ ] "Read Source" button appears
   - Click "Read Source"
   - [ ] Opens documentation in new tab

---

## ✅ Success Checklist

If you see all these, you're ready for demo day:

- [ ] ✅ Server running on http://localhost:3000
- [ ] ✅ Can enter a topic
- [ ] ✅ Quiz generates successfully
- [ ] ✅ Live Source badge appears
- [ ] ✅ Questions are relevant to 2025 best practices
- [ ] ✅ "Read Source" button works
- [ ] ✅ Citations are valid URLs
- [ ] ✅ MongoDB stores the data

---

## 🐛 Troubleshooting

### Issue: "YOU_COM_API_KEY is not configured"

**Solution:**

```bash
# Check if .env exists
dir .env

# If not, create it:
copy .env.example .env

# Add your API key
notepad .env
```

### Issue: "MongoDB connection failed"

**Solution:**

```bash
# Check if MongoDB is running
tasklist | findstr mongod

# If not, start it:
net start MongoDB
```

### Issue: "JSON parsing error"

**Solution:**

- This means You.com returned non-JSON content
- Check the console logs
- Try a different topic
- Verify API key is correct

### Issue: "Module not found"

**Solution:**

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

## 🎯 Quick Test Commands

### Test MongoDB Connection:

```bash
mongosh
use adaptiq_live
db.training_grounds.find().pretty()
```

### Test You.com API:

```bash
# Create a quick test file
echo "console.log(process.env.YOU_COM_API_KEY)" > test-env.js
node test-env.js
```

### Check if ports are available:

```bash
# Port 3000 (Next.js)
netstat -ano | findstr :3000

# Port 27017 (MongoDB)
netstat -ano | findstr :27017
```

---

## 📖 Next Steps

Once everything works:

1. **Customize the prompts** in [actions/ai-generation.ts](actions/ai-generation.ts#L42)
2. **Adjust the UI** in [app/page.tsx](app/page.tsx)
3. **Add more topics** to the quick topics list
4. **Deploy to Vercel** (see [README.md](README.md) for instructions)

---

## 🎓 Learning Resources

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [You.com API Reference](https://documentation.you.com/api-reference/)
- [MongoDB Node.js Driver](https://www.mongodb.com/docs/drivers/node/current/)
- [Drizzle ORM](https://orm.drizzle.team/docs/overview)

---

## 💬 Need Help?

1. Check [SETUP.md](SETUP.md) for detailed troubleshooting
2. Review [API_DOCS.md](API_DOCS.md) for API integration details
3. Read [ARCHITECTURE.md](ARCHITECTURE.md) for system overview

---

**Total setup time: ~5 minutes**  
**You're ready to demo! 🎉**
