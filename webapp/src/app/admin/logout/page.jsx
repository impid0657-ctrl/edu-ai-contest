"use client";

import { useEffect } from "react";

/**
 * /admin/logout 페이지
 * 이 페이지에 접근하면 자동으로 로그아웃 API를 호출하고 /login으로 리다이렉트합니다.
 * 사이드바의 onClick 이벤트가 차단되는 문제를 우회하기 위한 방식입니다.
 */
export default function LogoutPage() {
  useEffect(() => {
    // Supabase 인증 쿠키 강제 삭제 (클라이언트 측)
    document.cookie.split(";").forEach(c => {
      const name = c.trim().split("=")[0];
      if (name.includes("supabase") || name.includes("sb-") || name.includes("auth-token")) {
        document.cookie = `${name}=; Max-Age=0; Path=/;`;
      }
    });
    try { localStorage.clear(); } catch {}
    try { sessionStorage.clear(); } catch {}

    // 서버 측 세션 정리 (GET으로 호출해야 쿠키 삭제 Set-Cookie 반환됨)
    fetch("/api/auth/signout?redirect=/login")
      .finally(() => {
        window.location.href = "/login";
      });
  }, []);

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
      fontFamily: "'Segoe UI', -apple-system, sans-serif",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 40, height: 40, border: "4px solid #e0e0e0",
          borderTop: "4px solid #487FFF", borderRadius: "50%",
          animation: "spin 0.8s linear infinite", margin: "0 auto 16px",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: "#888", fontSize: "14px" }}>로그아웃 중...</p>
      </div>
    </div>
  );
}
