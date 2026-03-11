"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Admin Login Page
 * Username-based login. Internally maps "admin" → "admin@contest.admin" for Supabase.
 */
export default function LoginPage() {
  return (
    <Suspense fallback={<div style={styles.wrapper}><div style={styles.card}><p style={{ textAlign: 'center' }}>로딩 중...</p></div></div>}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/admin";
  const authError = searchParams.get("error");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Map username to internal email format
      const email = `${username.trim()}@contest.admin`;

      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError("아이디 또는 비밀번호가 올바르지 않습니다.");
        setLoading(false);
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      console.error("Login error:", err);
      setError("로그인 중 오류가 발생했습니다.");
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>관리자 로그인</h1>
        <p style={styles.subtitle}>제8회 교육 공공데이터 AI활용대회</p>

        {authError === "auth_unavailable" && (
          <div style={{ ...styles.error, background: "#fff8e0", borderColor: "#ffe69c", color: "#856404" }}>
            인증 서버에 연결할 수 없습니다. 환경변수를 확인해주세요.
          </div>
        )}
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label} htmlFor="username">아이디</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="아이디를 입력해주세요"
              required
              style={styles.input}
              autoComplete="username"
              autoFocus
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label} htmlFor="password">비밀번호</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력해주세요"
              required
              style={styles.input}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" disabled={loading} style={{
            ...styles.button,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}>
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div style={styles.footer}>
          <a href="/" style={styles.link}>← 홈으로 돌아가기</a>
        </div>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f4f6f9",
    fontFamily: "'Segoe UI', -apple-system, sans-serif",
    padding: "20px",
  },
  card: {
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
    padding: "40px",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1a1a2e",
    margin: "0 0 4px 0",
    textAlign: "center",
    whiteSpace: "nowrap",
  },
  subtitle: {
    fontSize: "14px",
    color: "#888",
    margin: "0 0 28px 0",
    textAlign: "center",
  },
  error: {
    background: "#fff0f0",
    color: "#dc3545",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "14px",
    marginBottom: "16px",
    border: "1px solid #ffd4d4",
  },
  field: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#333",
    marginBottom: "6px",
  },
  input: {
    width: "100%",
    padding: "10px 14px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "12px",
    background: "#2161a6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    marginTop: "8px",
  },
  footer: {
    marginTop: "20px",
    textAlign: "center",
  },
  link: {
    fontSize: "14px",
    color: "#2161a6",
    textDecoration: "none",
  },
};
