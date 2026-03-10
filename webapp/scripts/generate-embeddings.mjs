/**
 * generate-embeddings.mjs
 *
 * Generates Gemini embeddings for all contest_documents that have null embedding.
 * Run after adding/editing RAG documents in admin panel.
 *
 * Usage:
 *   npm run generate-embeddings
 *   // or directly:
 *   node scripts/generate-embeddings.mjs
 *
 * Required env vars:
 *   GEMINI_API_KEY
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from "@supabase/supabase-js";
import { GoogleGenAI } from "@google/genai";

// ── Config ──
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GEMINI_KEY = process.env.GEMINI_API_KEY;
const EMBEDDING_MODEL = "gemini-embedding-001";
const EMBEDDING_DIMENSIONS = 768;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  process.exit(1);
}

if (!GEMINI_KEY) {
  console.error("❌ GEMINI_API_KEY is required");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const ai = new GoogleGenAI({ apiKey: GEMINI_KEY });

// ── Main ──
async function main() {
  console.log("🔍 Fetching documents with missing embeddings...");

  const { data: docs, error } = await supabase
    .from("contest_documents")
    .select("id, title, content")
    .is("embedding", null);

  if (error) {
    console.error("❌ DB fetch error:", error.message);
    process.exit(1);
  }

  if (!docs || docs.length === 0) {
    console.log("✅ All documents already have embeddings. Nothing to do.");
    return;
  }

  console.log(`📄 Found ${docs.length} documents without embeddings.`);
  console.log(`🤖 Using model: ${EMBEDDING_MODEL} (${EMBEDDING_DIMENSIONS} dimensions)`);

  let successCount = 0;
  let failCount = 0;

  // Process one by one (Gemini embedding API takes single content per request)
  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    const titlePart = doc.title ? `${doc.title}: ` : "";
    const text = `${titlePart}${doc.content}`;

    console.log(`\n⏳ [${i + 1}/${docs.length}] "${doc.title || "(untitled)"}"...`);

    try {
      const response = await ai.models.embedContent({
        model: EMBEDDING_MODEL,
        contents: text,
        config: {
          outputDimensionality: EMBEDDING_DIMENSIONS,
        },
      });

      const embedding = response.embeddings[0].values;

      const { error: updateError } = await supabase
        .from("contest_documents")
        .update({ embedding })
        .eq("id", doc.id);

      if (updateError) {
        console.error(`  ❌ DB update failed: ${updateError.message}`);
        failCount++;
      } else {
        console.log(`  ✅ Done (${embedding.length} dimensions)`);
        successCount++;
      }
    } catch (err) {
      console.error(`  ❌ Gemini API error: ${err.message}`);
      failCount++;
    }

    // Small delay to avoid rate limits
    if (i < docs.length - 1) {
      await new Promise((r) => setTimeout(r, 300));
    }
  }

  console.log(`\n${"=".repeat(50)}`);
  console.log(`🏁 Done! ${successCount} succeeded, ${failCount} failed out of ${docs.length} total.`);

  if (successCount > 0) {
    console.log("\n💡 Embeddings are now stored in the database.");
    console.log("   The chatbot will use these for RAG-powered answers.");
  }
}

main().catch((err) => {
  console.error("❌ Unexpected error:", err);
  process.exit(1);
});
