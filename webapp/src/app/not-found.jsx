import Link from "next/link";

/**
 * Global 404 Not Found Page
 */
export default function NotFound() {
  return (
    <html lang="ko">
      <body style={{ fontFamily: "'Poppins', sans-serif", margin: 0, display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", background: "#f8f9ff" }}>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <h1 style={{ fontSize: "96px", fontWeight: 700, color: "#2161a6", marginBottom: "16px" }}>404</h1>
          <h3 style={{ fontSize: "24px", fontWeight: 700, color: "#222", marginBottom: "12px" }}>페이지를 찾을 수 없습니다</h3>
          <p style={{ fontSize: "18px", color: "#666", marginBottom: "32px" }}>요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
          <Link href="/" style={{
            display: "inline-block", padding: "11px 57px", background: "#2161a6", color: "#fff",
            borderRadius: "28px", textDecoration: "none", fontWeight: 600,
            boxShadow: "0px 5px 15px 0px rgba(8, 0, 140, 0.19)"
          }}>
            홈으로 돌아가기
          </Link>
        </div>
      </body>
    </html>
  );
}
