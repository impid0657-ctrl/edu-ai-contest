"use client";

import { useState } from "react";
import Link from "next/link";
import { formatKST } from "@/lib/dateUtils";

/**
 * License Application Status Lookup — /license-apply/status
 * Public page. Email-only lookup. No auth required.
 */

const STATUS_LABELS = {
  pending: "대기 중",
  approved: "승인됨",
  rejected: "반려됨",
};

const STATUS_BADGE = {
  pending: "bg-warning",
  approved: "bg-success",
  rejected: "bg-danger",
};

const CATEGORY_LABELS = {
  elementary: "초등부",
  secondary: "중·고등부",
  general: "일반부",
};

export default function LicenseStatusPage() {
  const [email, setEmail] = useState("");
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setSearching(true);
    setSearched(false);

    try {
      const res = await fetch(`/api/license/status?email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "조회에 실패했습니다.");
        return;
      }

      setResult(data.application);
      setSearched(true);
    } catch (err) {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <>
      {/* ── Hero Section ── */}
      <div className="slider-area position-relative primary-bg">
        <div id="scene" className="position-absolute w-100 h-100">
          <img data-depth="0.20" className="shape page-shape-1 d-none d-lg-inline-block s-shape" src="/original-template/images/slider/page-shape/page-shape1.png" alt="#" />
          <img data-depth="0.20" className="shape page-shape-2 d-none d-lg-inline-block s-shape" src="/original-template/images/slider/page-shape/page-shape2.png" alt="#" />
          <img data-depth="0.20" className="shape page-shape-3 d-none d-lg-inline-block" src="/original-template/images/slider/page-shape/page-shape3.png" alt="#" />
          <img data-depth="0.20" className="shape page-shape-4 d-none d-lg-inline-block" src="/original-template/images/slider/page-shape/page-shape4.png" alt="#" />
          <img data-depth="0.20" className="shape page-shape-5 d-none d-lg-inline-block bounce-animate2" src="/original-template/images/slider/page-shape/page-shape5.png" alt="#" />
          <img data-depth="0.20" className="shape page-shape-6 d-none d-lg-inline-block bounce-animate" src="/original-template/images/slider/page-shape/page-shape6.png" alt="#" />
          <img data-depth="0.20" className="shape page-shape-7 d-none d-lg-inline-block s-shape" src="/original-template/images/slider/page-shape/page-shape1.png" alt="#" />
        </div>
        <div className="single-page page-height d-flex align-items-center">
          <div className="container">
            <div className="row">
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 d-flex align-items-center justify-content-center">
                <div className="page-title mt-110 text-center">
                  <span className="theme-color f-700">제8회 교육 공공데이터 AI활용 경진대회</span>
                  <h1 className="text-capitalize f-700 mt-10 mb-20">AI이용권 신청현황 조회</h1>
                  <nav aria-label="breadcrumb">
                    <ol className="breadcrumb justify-content-center bg-transparent">
                      <li className="breadcrumb-item"><a className="secondary-color3" href="/">홈</a></li>
                      <li className="breadcrumb-item"><a className="secondary-color3" href="/license-apply">AI이용권 신청</a></li>
                      <li className="breadcrumb-item active text-capitalize secondary-color3" aria-current="page">신청현황 조회</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <section className="contact-area pt-100 pb-100">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm rounded-4">
                <div className="card-body p-4">
                  {error && (
                    <div className="alert alert-danger" role="alert">{error}</div>
                  )}

                  <form onSubmit={handleSearch}>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label fw-semibold">
                        이메일 <span className="text-danger">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="form-control"
                        style={{ height: "55px", paddingLeft: "20px", fontSize: "16px" }}
                        placeholder="신청 시 사용한 이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-lg w-100 theme-bg text-white f-700"
                      disabled={searching}
                    >
                      {searching ? "조회 중..." : "조회하기"}
                    </button>
                  </form>

                  {/* Result */}
                  {searched && (
                    <div className="mt-4">
                      {result ? (
                        <div className="card bg-light border-0 rounded-3">
                          <div className="card-body p-3">
                            <h5 className="fw-bold mb-3">신청 현황</h5>
                            <div className="table-responsive">
                              <table className="table table-sm mb-0">
                                <tbody>
                                  <tr>
                                    <th className="text-muted">상태</th>
                                    <td>
                                      <span className={`badge ${STATUS_BADGE[result.status] || "bg-secondary"}`}>
                                        {STATUS_LABELS[result.status] || result.status}
                                      </span>
                                    </td>
                                  </tr>
                                  <tr>
                                    <th className="text-muted">부문</th>
                                    <td>{CATEGORY_LABELS[result.category] || result.category}</td>
                                  </tr>
                                  {result.team_name && (
                                    <tr>
                                      <th className="text-muted">팀명</th>
                                      <td>{result.team_name}</td>
                                    </tr>
                                  )}
                                  <tr>
                                    <th className="text-muted">신청일</th>
                                    <td>{result.created_at ? formatKST(result.created_at, "yyyy-MM-dd") : "-"}</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="alert alert-info" role="alert">
                          해당 이메일로 신청된 내역이 없습니다.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-center mt-4">
                <Link href="/license-apply" className="text-muted">
                  ← AI 이용권 신청 페이지로 돌아가기
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Banner CTA ── */}
      <div className="banner-area banner-margin-bottom position-relative">
        <div className="container">
          <div className="banner-wrapper banner-border white-bg pl-70 pr-70 pt-55 pb-75 transition3">
            <div className="row align-items-center justify-content-between">
              <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
                <div className="banner-content">
                  <h4 className="f-700 mb-18">관련 문의사항이 있으신가요?</h4>
                  <p className="mb-0">이용권 관련 문의사항은 QnA 게시판을 이용해 주세요.</p>
                </div>
              </div>{/* /col */}
              <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
                <div className="banner-btn float-left float-lg-right">
                  <div className="my-btn">
                    <a href="/board" className="btn theme-bg text-capitalize f-18 f-700">QnA 바로가기</a>
                  </div>{/* /my-btn */}
                </div>
              </div>{/* /col */}
            </div>{/* /row */}
          </div>{/* /banner-wrapper */}
        </div>{/* /container */}
      </div>
    </>
  );
}
