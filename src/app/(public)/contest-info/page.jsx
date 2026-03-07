/**
 * Contest Info — placeholder page for Sprint 1.
 * Full content will be implemented in a future sprint.
 */
export const metadata = {
  title: "공모요강 | 제8회 교육 공공데이터 AI활용대회",
  description: "제8회 교육 공공데이터 AI활용대회 공모요강 안내",
};

export default function ContestInfoPage() {
  return (
    <section className="py-5">
      <div className="container">
        <div className="text-center py-5">
          <h1 className="fw-bold mb-4">공모요강</h1>
          <p className="text-muted fs-5">
            공모요강 상세 페이지는 준비 중입니다.
          </p>
          <div
            className="mx-auto rounded-3 bg-light d-flex align-items-center justify-content-center"
            style={{ maxWidth: "600px", height: "300px" }}
          >
            <span className="text-muted fs-4">Coming Soon</span>
          </div>
        </div>
      </div>
    </section>
  );
}
