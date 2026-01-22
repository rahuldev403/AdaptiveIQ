# AdaptiQ Live - Setup Checklist

## ✅ Setup Steps

### 1. Environment Variables

- [ ] Copy `.env.example` to `.env`
- [ ] Add your You.com API key
- [ ] Configure MongoDB connection string

### 2. Dependencies

```bash
npm install
```

### 3. Database Setup

- [ ] Ensure MongoDB is running
- [ ] Connection will be established automatically on first run

### 4. Development Server

```bash
npm run dev
```

### 5. Test the Application

- [ ] Open http://localhost:3000
- [ ] Enter a topic (e.g., "React Server Actions")
- [ ] Click "Generate Quiz"
- [ ] Verify citations appear
- [ ] Test "Read Source" button

## 🔧 Troubleshooting

### Issue: You.com API Error

- **Solution:** Check your API key in `.env`
- **Solution:** Verify your API key is active at https://you.com

### Issue: MongoDB Connection Failed

- **Solution:** Ensure MongoDB is running (`mongod` or `net start MongoDB`)
- **Solution:** Check the `MONGODB_URI` in `.env`

### Issue: JSON Parsing Error

- **Solution:** This means You.com returned non-JSON content
- **Solution:** Check the API response format in the console
- **Solution:** The prompt might need adjustment for better JSON output

### Issue: No Citations Returned

- **Solution:** Ensure `include_citations: true` is set in API call
- **Solution:** Some topics might have fewer sources than others

## 🎯 Quick Test Script

Create a simple test to verify You.com API:

```typescript
// test-you-api.ts
import { fetchQuestionsFromYouAPI } from "@/actions/ai-generation";

async function testAPI() {
  try {
    const result = await fetchQuestionsFromYouAPI("React Hooks");
    console.log("✅ Success!");
    console.log("Questions:", result.questions.length);
    console.log("Citations:", result.citations.length);
    console.log("Sources:", result.sourceLinks);
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testAPI();
```

## 📊 MongoDB Schema Verification

After first quiz generation, verify in MongoDB:

```bash
# Connect to MongoDB
mongosh

# Use the database
use adaptiq_live

# Check the collection
db.training_grounds.find().pretty()
```

Expected output:

```json
{
  "_id": ObjectId("..."),
  "topic": "React Server Actions",
  "generated_at": ISODate("2026-01-21T..."),
  "raw_ai_response": {
    "questions": [...],
    "citations": [...]
  },
  "source_links": [
    "https://nextjs.org/docs/...",
    "https://react.dev/..."
  ]
}
```

## 🚀 Production Deployment

### Vercel Deployment

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard:
   - `YOU_COM_API_KEY`
   - `MONGODB_URI`
4. Deploy!

### Environment Variables for Production

```env
YOU_COM_API_KEY=your_production_key
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/adaptiq_live
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

## 📞 Support

If you encounter issues:

1. Check the console logs (both browser and server)
2. Verify all environment variables are set
3. Test You.com API separately
4. Check MongoDB connection
5. Review the error messages in the UI

---

**Status:** ✅ All components implemented and ready for testing!
