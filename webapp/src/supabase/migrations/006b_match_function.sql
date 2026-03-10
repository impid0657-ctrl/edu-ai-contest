-- BUG-026 Fix: RPC function for pgvector cosine similarity search
CREATE OR REPLACE FUNCTION match_contest_documents(
  query_embedding VECTOR(1536),
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
