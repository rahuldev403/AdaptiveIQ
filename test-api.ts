/**
 * Example Test Script
 * Run this to verify the You.com API integration works correctly
 *
 * Usage: node --loader ts-node/esm test-api.ts
 */

import { fetchQuestionsFromYouAPI } from "./actions/ai-generation";

async function testYouComAPI() {
  console.log("🧪 Testing You.com API Integration...\n");

  try {
    const topic = "React Server Actions";
    console.log(`📚 Topic: ${topic}`);
    console.log("🔄 Fetching questions...\n");

    const result = await fetchQuestionsFromYouAPI(topic);

    console.log("✅ Success! Results:\n");
    console.log(`📝 Questions generated: ${result.questions.length}`);
    console.log(`📖 Citations found: ${result.citations.length}`);
    console.log(`🔗 Source links: ${result.sourceLinks.length}\n`);

    console.log("📋 Questions:");
    result.questions.forEach((q, i) => {
      console.log(`\n${i + 1}. ${q.question}`);
      console.log(`   Difficulty: ${q.difficulty}`);
      console.log(`   Options: ${q.options.length}`);
      console.log(`   Correct: ${String.fromCharCode(65 + q.correct_answer)}`);
    });

    console.log("\n🌐 Sources:");
    result.sourceLinks.forEach((link, i) => {
      console.log(`${i + 1}. ${link}`);
    });

    console.log("\n✅ Test completed successfully!");
  } catch (error) {
    console.error("\n❌ Test failed:");
    console.error(error);
    process.exit(1);
  }
}

// Run the test
testYouComAPI();
