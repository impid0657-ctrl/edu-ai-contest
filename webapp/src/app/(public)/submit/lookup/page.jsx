"use client";

import { useState } from "react";
import Link from "next/link";
import { formatKST } from "@/lib/dateUtils";

/**
 * Submission Lookup Page — /submit/lookup
 * Phase 2: Evalo design system applied.
 * Single path: submission_no + email + password → guest/login API → JWT → details.
 */

const CATEGORY_LABELS = {
  elementary: "초등부",
  secondary: "중·고등부",
  general: "일반부",
};

const STATUS_LABELS = {
  submitted: "접수됨",
  under_review: "심사 중",
  accepted: "수상작",
  rejected: "탈락",
};

export default function SubmissionLookupPage() {
  const [searching, setSearching] = useState(false);
  const [submission, setSubmission] = useState(null);
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ submission_no: "", email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(""); setSubmission(null); setSearching(true);
    try {
      const loginRes = await fetch("/api/guest/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) { setError(loginData.error || "접수번호 또는 정보가 일치하지 않습니다."); return; }

      const jwt = loginData.token;
      setToken(jwt);
      sessionStorage.setItem("submission_token", jwt);
      sessionStorage.setItem("submission_id", loginData.submission.id);

      const detailRes = await fetch(`/api/submission/${loginData.submission.id}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      if (detailRes.ok) { setSubmission((await detailRes.json()).submission); }
    } catch { setError("네트워크 오류가 발생했습니다."); }
    finally { setSearching(false); }
  };

  return (
    <>
      {/* ======slider-area-start=========================================== */}
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
                              <h1 className="text-capitalize f-700 mt-10 mb-20">접수조회</h1>
                              <nav aria-label="breadcrumb">
                                  <ol className="breadcrumb justify-content-center bg-transparent">
                                  <li className="breadcrumb-item"><a className="secondary-color3" href="/">홈</a></li>
                                  <li className="breadcrumb-item active text-capitalize secondary-color3" aria-current="page">접수조회</li>
                                  </ol>
                              </nav>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      {/* slider-area-end */}

      {/* ====== lookup-content-area-start ================================= */}
      <div className="contact-area pt-135 pb-120 over-hidden">
          <div className="container">
              <div className="row justify-content-center">
                  <div className="col-xl-8 col-lg-8 col-md-10 col-sm-12 col-12">

                      {/* Search Form */}
                      {!submission && (
                          <>
                              <div className="title text-center mb-60">
                                  <span className="theme-color f-700">접수 내역 확인</span>
                                  <h3 className="f-700 mb-20">작품 접수 조회</h3>
                                  <p>접수번호, 이메일, 비밀번호를 입력하여 접수 내역을 확인하세요.</p>
                              </div>

                              <div className="contact-form-wrapper secondary-border01 pt-60 pb-60 pl-60 pr-60">
                                  {error && (
                                      <div className="alert alert-danger mb-30" role="alert">
                                          <i className="fas fa-exclamation-circle me-2"></i>{error}
                                      </div>
                                  )}

                                  <form onSubmit={handleSearch}>
                                      <div className="row">
                                          <div className="col-xl-12 col-lg-12 mb-25">
                                              <label className="f-700 mb-10 d-block">접수번호 <span className="theme-color">*</span></label>
                                              <input type="text" name="submission_no" className="form-control secondary-border01"
                                                  placeholder="EDU-20260315-XXXXX" value={formData.submission_no} onChange={handleChange} required
                                                  style={{ height: "55px", paddingLeft: "20px", fontSize: "16px" }} />
                                          </div>
                                          <div className="col-xl-12 col-lg-12 mb-25">
                                              <label className="f-700 mb-10 d-block">이메일 <span className="theme-color">*</span></label>
                                              <input type="email" name="email" className="form-control secondary-border01"
                                                  placeholder="접수 시 입력한 이메일" value={formData.email} onChange={handleChange} required
                                                  style={{ height: "55px", paddingLeft: "20px", fontSize: "16px" }} />
                                          </div>
                                          <div className="col-xl-12 col-lg-12 mb-35">
                                              <label className="f-700 mb-10 d-block">비밀번호 <span className="theme-color">*</span></label>
                                              <input type="password" name="password" className="form-control secondary-border01"
                                                  placeholder="접수 시 설정한 비밀번호" value={formData.password} onChange={handleChange} required
                                                  style={{ height: "55px", paddingLeft: "20px", fontSize: "16px" }} />
                                          </div>
                                          <div className="col-xl-12 col-lg-12">
                                              <div className="my-btn">
                                                  <button type="submit" className="btn theme-bg text-capitalize f-18 f-700 w-100" disabled={searching}
                                                      style={{ height: "55px" }}>
                                                      {searching ? (
                                                          <><span className="spinner-border spinner-border-sm me-2" role="status"></span>조회 중...</>
                                                      ) : "조회하기"}
                                                  </button>
                                              </div>
                                          </div>
                                      </div>
                                  </form>
                              </div>
                          </>
                      )}

                      {/* Results */}
                      {submission && (
                          <>
                              <div className="title text-center mb-60">
                                  <span className="theme-color f-700">조회 결과</span>
                                  <h3 className="f-700 mb-20">{submission.submission_no}</h3>
                                  <p>접수하신 작품 상세 정보입니다.</p>
                              </div>

                              <div className="secondary-border01 pt-50 pb-50 pl-60 pr-60">
                                  <div className="table-responsive">
                                      <table className="table table-borderless mb-0" style={{ fontSize: "16px" }}>
                                          <tbody>
                                              <tr className="border-bottom">
                                                  <th className="text-muted py-3" width="30%">작품 제목</th>
                                                  <td className="f-700 py-3">{submission.title}</td>
                                              </tr>
                                              <tr className="border-bottom">
                                                  <th className="text-muted py-3">부문</th>
                                                  <td className="py-3">
                                                      <span className="d-inline-block theme-bg text-white f-700 pt-5 pb-5 pl-15 pr-15" style={{ borderRadius: "4px", fontSize: "14px" }}>
                                                          {CATEGORY_LABELS[submission.category] || submission.category}
                                                      </span>
                                                  </td>
                                              </tr>
                                              <tr className="border-bottom">
                                                  <th className="text-muted py-3">이름</th>
                                                  <td className="py-3">{submission.contact_name || "-"}</td>
                                              </tr>
                                              <tr className="border-bottom">
                                                  <th className="text-muted py-3">팀명</th>
                                                  <td className="py-3">{submission.team_name || "-"}</td>
                                              </tr>
                                              <tr className="border-bottom">
                                                  <th className="text-muted py-3">이메일</th>
                                                  <td className="py-3">{submission.contact_email}</td>
                                              </tr>
                                              {submission.contact_phone && (
                                                  <tr className="border-bottom">
                                                      <th className="text-muted py-3">전화번호</th>
                                                      <td className="py-3">{submission.contact_phone}</td>
                                                  </tr>
                                              )}
                                              {submission.description && (
                                                  <tr className="border-bottom">
                                                      <th className="text-muted py-3">작품 설명</th>
                                                      <td className="py-3 text-break">{submission.description}</td>
                                                  </tr>
                                              )}
                                              <tr className="border-bottom">
                                                  <th className="text-muted py-3">상태</th>
                                                  <td className="py-3">
                                                      <span className={`d-inline-block f-700 pt-5 pb-5 pl-15 pr-15 text-white`}
                                                          style={{
                                                              borderRadius: "4px", fontSize: "14px",
                                                              backgroundColor: submission.status === "submitted" ? "#5a67d8" : submission.status === "accepted" ? "#48bb78" : submission.status === "rejected" ? "#f56565" : "#ecc94b",
                                                              color: submission.status === "under_review" ? "#744210" : "#fff",
                                                          }}>
                                                          {STATUS_LABELS[submission.status] || submission.status}
                                                      </span>
                                                  </td>
                                              </tr>
                                              <tr className="border-bottom">
                                                  <th className="text-muted py-3">접수일</th>
                                                  <td className="py-3">{submission.created_at ? formatKST(submission.created_at, "yyyy-MM-dd HH:mm") : "-"}</td>
                                              </tr>
                                              <tr>
                                                  <th className="text-muted py-3">첨부 파일</th>
                                                  <td className="py-3">
                                                      {submission.submission_files?.length > 0 ? (
                                                          submission.submission_files.map((f) => (
                                                              <div key={f.id} className="mb-2">
                                                                  <span className="d-inline-block theme-bg text-white f-700 pt-3 pb-3 pl-10 pr-10 me-2" style={{ borderRadius: "4px", fontSize: "13px" }}>
                                                                      <i className="fas fa-file me-1"></i>{f.file_name}
                                                                  </span>
                                                                  <small className="text-muted">{f.file_size ? `${(f.file_size / 1024 / 1024).toFixed(1)}MB` : ""}</small>
                                                              </div>
                                                          ))
                                                      ) : <span className="text-muted">없음</span>}
                                                  </td>
                                              </tr>
                                          </tbody>
                                      </table>
                                  </div>

                                  <div className="row mt-40">
                                      <div className="col-6">
                                          <div className="my-btn">
                                              <Link href={`/submit/edit/${submission.id}`} className="btn theme-bg text-capitalize f-18 f-700 w-100" style={{ height: "50px", lineHeight: "50px" }}>
                                                  수정하기
                                              </Link>
                                          </div>
                                      </div>
                                      <div className="col-6">
                                          <div className="my-btn">
                                              <button className="btn secondary-border01 text-capitalize f-18 f-700 w-100" style={{ height: "50px", lineHeight: "50px" }}
                                                  onClick={() => { setSubmission(null); setError(""); }}>
                                                  다른 작품 조회
                                              </button>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </>
                      )}

                      <div className="text-center mt-50">
                          <Link href="/submit" className="theme-color f-700">
                              <i className="fal fa-long-arrow-left me-2"></i>작품 접수 페이지로 돌아가기
                          </Link>
                      </div>

                  </div>{/* /col */}
              </div>{/* /row */}
          </div>{/* /container */}
      </div>
      {/* lookup-content-area-end */}
    </>
  );
}
