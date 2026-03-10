#!/usr/bin/env node

/**
 * One-time script to generate embeddings for contest_documents.
 *
 * Usage:
 *   OPENAI_API_KEY=sk-xxx node src/scripts/generate-embeddings.js
 *
 * Requires .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY,
 * or pass them as environment variables.
 */

import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load .env.local
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../../.env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const openaiKey = process.env.OPENAI_API_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

if (!openaiKey) {
  console.error("Missing OPENAI_API_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const openai = new OpenAI({ apiKey: openaiKey });

async function main() {
  console.log("Fetching documents without embeddings...");

  const { data: docs, error } = await supabase
    .from("contest_documents")
    .select("id, title, content")
    .is("embedding", null);

  if (error) {
    console.error("Error fetching documents:", error.message);
    process.exit(1);
  }

  if (!docs || docs.length === 0) {
    console.log("All documents already have embeddings. Nothing to do.");
    return;
  }

  console.log(`Found ${docs.length} documents without embeddings.`);

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];
    console.log(`[${i + 1}/${docs.length}] Generating embedding for: ${doc.title}`);

    try {
      const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: doc.content,
      });

      const embedding = response.data[0].embedding;

      const { error: updateError } = await supabase
        .from("contest_documents")
        .update({ embedding })
        .eq("id", doc.id);

      if (updateError) {
        console.error(`  Error updating embedding for ${doc.title}:`, updateError.message);
      } else {
        console.log(`  ✅ Done (${embedding.length} dimensions)`);
      }
    } catch (err) {
      console.error(`  Error generating embedding for ${doc.title}:`, err.message);
    }
  }

  console.log("Embedding generation complete.");
}

main().catch(console.error);
