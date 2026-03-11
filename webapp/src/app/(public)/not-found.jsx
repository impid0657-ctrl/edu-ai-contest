import Link from "next/link";

/**
 * 404 Not Found Page — Evalo design
 * Shown when a public page route doesn't exist.
 */
export default function NotFound() {
  return (
    <section className="evalo-section text-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="mb-4">
              <span className="evalo-title__label">페이지를 찾을 수 없습니다</span>
            </div>
            <h1 className="display-1 fw-bold mb-3" style={{ color: "var(--evalo-primary, #2161a6)" }}>404</h1>
            <h3 className="fw-bold mb-3">페이지를 찾을 수 없습니다</h3>
            <p className="text-muted mb-5">
              요청하신 페이지가 존재하지 않거나 이동되었습니다.
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <Link href="/" className="evalo-btn">홈으로 돌아가기</Link>
              <Link href="/board" className="evalo-btn evalo-btn--outline">게시판 바로가기</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
