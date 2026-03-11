export const metadata = {
  title: "접근 거부 - 제8회 교육 공공데이터 AI활용대회",
  description: "관리자 권한이 필요한 페이지입니다.",
};

const Page = () => {
  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      fontFamily: "'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif",
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "20px",
        padding: "60px 50px",
        textAlign: "center",
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        maxWidth: "450px",
        width: "90%",
      }}>
        <div style={{ fontSize: "64px", marginBottom: "20px" }}>🔒</div>
        <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#333", marginBottom: "12px" }}>
          권한이 없습니다
        </h2>
        <p style={{ fontSize: "15px", color: "#666", lineHeight: 1.6, marginBottom: "30px" }}>
          이 페이지에 접근할 수 있는 권한이 없습니다.
        </p>
        <a href="/" style={{
          display: "inline-block",
          background: "linear-gradient(135deg, #667eea, #764ba2)",
          color: "#fff",
          fontSize: "16px",
          fontWeight: 600,
          padding: "14px 40px",
          borderRadius: "30px",
          textDecoration: "none",
        }}>
          홈으로 돌아가기
        </a>
      </div>
    </div>
  );
};

export default Page;
