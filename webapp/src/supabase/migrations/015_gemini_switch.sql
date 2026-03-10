-- Migration 015: Switch from OpenAI embeddings (1536 dim) to Gemini embeddings (768 dim)
-- Also updates the RPC function and chatbot_settings defaults

-- 1. Clear existing embeddings (they're OpenAI format, incompatible with Gemini)
UPDATE public.contest_documents SET embedding = NULL;

-- 2. Drop old index (references old vector size)
DROP INDEX IF EXISTS contest_documents_embedding_idx;

-- 3. Change vector column dimension: 1536 → 768
ALTER TABLE public.contest_documents
ALTER COLUMN embedding TYPE VECTOR(768);

-- 4. Recreate index for new dimension
CREATE INDEX ON public.contest_documents
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 10);

-- 5. Update RPC function for new vector dimension
CREATE OR REPLACE FUNCTION match_contest_documents(
  query_embedding VECTOR(768),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (id UUID, title TEXT, content TEXT, similarity FLOAT)
LANGUAGE sql STABLE
AS $$
  SELECT
    cd.id,
    cd.title,
    cd.content,
    1 - (cd.embedding <=> query_embedding) AS similarity
  FROM public.contest_documents cd
  WHERE cd.embedding IS NOT NULL
    AND 1 - (cd.embedding <=> query_embedding) > match_threshold
  ORDER BY cd.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- 6. Update chatbot_settings defaults to Gemini
UPDATE public.chatbot_settings SET
  provider = 'google',
  model_name = 'gemini-3-flash-preview'
WHERE provider = 'openai';
