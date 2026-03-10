"use client";

import { useState } from "react";
import Link from "next/link";
import { CONTEST_CATEGORIES } from "@/lib/constants";

/**
 * Submission Form — Evalo Design
 * Single flow for everyone. Contact-us style form layout from Evalo.
 */

const ALLOWED_EXTENSIONS = [
  ".pdf", ".zip", ".hwp", ".hwpx", ".pptx", ".ppt",
  ".docx", ".doc", ".xlsx", ".xls",
  ".png", ".jpg", ".jpeg", ".mp4", ".avi", ".mov",
];

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submissionNo, setSubmissionNo] = useState("");
  const [error, setError] = useState("");
  const [uploadProgress, setUploadProgress] = useState("");

  const [formData, setFormData] = useState({
    title: "", description: "", category: "", team_name: "",
    contact_name: "", contact_email: "", contact_phone: "", password: "",
  });
  const [files, setFiles] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => setFiles(Array.from(e.target.files || []));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSubmitting(true); setUploadProgress("");

    try {
      if (files.length === 0) { setError("파일을 1개 이상 첨부해주세요."); setSubmitting(false); return; }

      const totalSize = files.reduce((acc, f) => acc + f.size, 0);
      if (totalSize > 500 * 1024 * 1024) { setError("파일 총 용량이 500MB를 초과합니다."); setSubmitting(false); return; }

      setUploadProgress("작품 정보를 저장하는 중...");
      const submitRes = await fetch("/api/submit", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const submitData = await submitRes.json();
      if (!submitRes.ok) { setError(submitData.error || "접수에 실패했습니다."); setSubmitting(false); return; }

      const token = submitData.token;

      setUploadProgress("파일을 업로드하는 중...");
      for (let i = 0; i < files.length; i++) {
        setUploadProgress(`파일 업로드 중... (${i + 1}/${files.length})`);
        const fd = new FormData();
        fd.append("file", files[i]);
        const uploadRes = await fetch("/api/guest/upload", {
          method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd,
        });
        if (!uploadRes.ok) {
          const uploadErr = await uploadRes.json();
          setError(uploadErr.error || `파일 업로드 실패: ${files[i].name}`); setSubmitting(false); return;
        }
      }

      if (token) {
        sessionStorage.setItem("submission_token", token);
        sessionStorage.setItem("submission_id", submitData.submission.id);
      }

      setSubmissionNo(submitData.submission.submission_no);
      setSubmitted(true);
    } catch (err) {
      console.error("Submit error:", err);
      setError("네트워크 오류가 발생했습니다.");
    } finally { setSubmitting(false); setUploadProgress(""); }
  };

  // ── Success ──
  if (submitted) {
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
                                <h1 className="text-capitalize f-700 mt-10 mb-20">대회접수</h1>
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb justify-content-center bg-transparent">
                                    <li className="breadcrumb-item"><a className="secondary-color3" href="/">홈</a></li>
                                    <li className="breadcrumb-item active text-capitalize secondary-color3" aria-current="page">대회접수</li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {/* slider-area-end */}

        <div className="pt-135 pb-120 over-hidden">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-xl-6 col-lg-7 col-md-10 col-sm-12 col-12">
                        <div className="secondary-border01 pt-60 pb-60 pl-60 pr-60 text-center">
                            <div className="display-1 mb-30">🎉</div>
                            <div className="title mb-30">
                                <span className="theme-color f-700">접수 완료</span>
                                <h3 className="f-700 mb-10">작품 접수가 완료되었습니다</h3>
                            </div>
                            <p className="text-muted mb-10">접수번호</p>
                            <h2 className="theme-color f-700 mb-30">{submissionNo}</h2>
                            <p className="mb-5" style={{ color: "#e53e3e" }}><strong>접수번호를 반드시 저장해주세요.</strong></p>
                            <p className="text-muted mb-40">접수번호와 비밀번호로 조회/수정이 가능합니다.</p>
                            <div className="row justify-content-center">
                                <div className="col-6">
                                    <div className="my-btn">
                                        <Link href="/" className="btn theme-bg text-capitalize f-18 f-700 w-100" style={{ height: "50px", lineHeight: "50px" }}>
                                            홈으로
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="my-btn">
                                        <Link href="/submit/lookup" className="btn secondary-border01 text-capitalize f-18 f-700 w-100" style={{ height: "50px", lineHeight: "50px" }}>
                                            접수 조회
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </>
    );
  }

  // ── Form ──
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
                              <h1 className="text-capitalize f-700 mt-10 mb-20">대회접수</h1>
                              <nav aria-label="breadcrumb">
                                  <ol className="breadcrumb justify-content-center bg-transparent">
                                  <li className="breadcrumb-item"><a className="secondary-color3" href="/">홈</a></li>
                                  <li className="breadcrumb-item active text-capitalize secondary-color3" aria-current="page">대회접수</li>
                                  </ol>
                              </nav>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      {/* slider-area-end */}

      <div className="contact-area pt-135 pb-120 over-hidden">
          <div className="container">
              <div className="row justify-content-center">
                  <div className="col-xl-8 col-lg-9 col-md-10 col-sm-12 col-12">
                      <div className="title text-center mb-50">
                          <span className="theme-color f-700">작품 접수</span>
                          <h3 className="f-700 mb-20">대회 참가 신청서</h3>
                          <p>아래 양식을 작성하여 작품을 접수해주세요.</p>
                      </div>

                      <div className="contact-form-wrapper secondary-border01 pt-60 pb-60 pl-60 pr-60">
                          {error && (
                              <div className="alert alert-danger mb-30" role="alert">
                                  <i className="fas fa-exclamation-circle me-2"></i>{error}
                              </div>
                          )}

                          <form onSubmit={handleSubmit}>
                              <div className="row">
                                  {/* 작품 제목 */}
                                  <div className="col-xl-12 col-lg-12 mb-25">
                                      <label className="f-700 mb-10 d-block">작품 제목 <span className="theme-color">*</span></label>
                                      <input type="text" name="title" className="form-control secondary-border01"
                                          placeholder="작품 제목을 입력해주세요" value={formData.title} onChange={handleChange} required
                                          style={{ height: "55px", paddingLeft: "20px", fontSize: "16px" }} />
                                  </div>

                                  {/* 작품 설명 */}
                                  <div className="col-xl-12 col-lg-12 mb-25">
                                      <label className="f-700 mb-10 d-block">작품 설명</label>
                                      <textarea name="description" className="form-control secondary-border01" rows={4}
                                          maxLength={1000} placeholder="작품에 대한 설명을 작성해주세요 (선택)"
                                          value={formData.description} onChange={handleChange}
                                          style={{ paddingLeft: "20px", paddingTop: "15px", fontSize: "16px" }}></textarea>
                                      <div className="text-end mt-5"><small className="text-muted">{formData.description.length}/1000</small></div>
                                  </div>

                                  {/* 참가 부문 + 팀명 */}
                                  <div className="col-xl-6 col-lg-6 mb-25">
                                      <label className="f-700 mb-10 d-block">참가 부문 <span className="theme-color">*</span></label>
                                      <select name="category" className="form-control secondary-border01"
                                          value={formData.category} onChange={handleChange} required
                                          style={{ height: "55px", paddingLeft: "20px", fontSize: "16px" }}>
                                          <option value="">부문 선택</option>
                                          {CONTEST_CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                      </select>
                                  </div>
                                  <div className="col-xl-6 col-lg-6 mb-25">
                                      <label className="f-700 mb-10 d-block">팀명</label>
                                      <input type="text" name="team_name" className="form-control secondary-border01"
                                          placeholder="개인 참가 시 빈칸" value={formData.team_name} onChange={handleChange}
                                          style={{ height: "55px", paddingLeft: "20px", fontSize: "16px" }} />
                                  </div>

                                  {/* 이름 + 이메일 + 연락처 */}
                                  <div className="col-xl-4 col-lg-4 mb-25">
                                      <label className="f-700 mb-10 d-block">이름 <span className="theme-color">*</span></label>
                                      <input type="text" name="contact_name" className="form-control secondary-border01"
                                          placeholder="대표자 이름" value={formData.contact_name} onChange={handleChange} required
                                          style={{ height: "55px", paddingLeft: "20px", fontSize: "16px" }} />
                                  </div>
                                  <div className="col-xl-4 col-lg-4 mb-25">
                                      <label className="f-700 mb-10 d-block">이메일 <span className="theme-color">*</span></label>
                                      <input type="email" name="contact_email" className="form-control secondary-border01"
                                          placeholder="연락 이메일" value={formData.contact_email} onChange={handleChange} required
                                          style={{ height: "55px", paddingLeft: "20px", fontSize: "16px" }} />
                                  </div>
                                  <div className="col-xl-4 col-lg-4 mb-25">
                                      <label className="f-700 mb-10 d-block">연락처</label>
                                      <input type="tel" name="contact_phone" className="form-control secondary-border01"
                                          placeholder="010-0000-0000" value={formData.contact_phone} onChange={handleChange}
                                          style={{ height: "55px", paddingLeft: "20px", fontSize: "16px" }} />
                                  </div>

                                  {/* 비밀번호 */}
                                  <div className="col-xl-12 col-lg-12 mb-25">
                                      <label className="f-700 mb-10 d-block">비밀번호 <span className="theme-color">*</span></label>
                                      <input type="password" name="password" className="form-control secondary-border01"
                                          placeholder="조회/수정 시 필요 (4자 이상)" minLength={4}
                                          value={formData.password} onChange={handleChange} required
                                          style={{ height: "55px", paddingLeft: "20px", fontSize: "16px" }} />
                                  </div>

                                  {/* 파일 첨부 */}
                                  <div className="col-xl-12 col-lg-12 mb-35">
                                      <label className="f-700 mb-10 d-block">파일 첨부 <span className="theme-color">*</span></label>
                                      <input type="file" className="form-control secondary-border01" multiple
                                          accept={ALLOWED_EXTENSIONS.join(",")} onChange={handleFileChange} required
                                          style={{ height: "55px", paddingLeft: "20px", paddingTop: "14px", fontSize: "16px" }} />
                                      <small className="text-muted d-block mt-10">PDF, ZIP, HWP, PPTX, DOCX, XLSX, 이미지, 동영상 (총 500MB 이내)</small>
                                      {files.length > 0 && (
                                          <div className="mt-15 d-flex flex-wrap gap-2">
                                              {files.map((f, i) => (
                                                  <span key={i} className="d-inline-block theme-bg text-white f-700 pt-3 pb-3 pl-10 pr-10" style={{ borderRadius: "4px", fontSize: "13px" }}>
                                                      <i className="fas fa-file me-1"></i>{f.name} ({(f.size / 1024 / 1024).toFixed(1)}MB)
                                                  </span>
                                              ))}
                                          </div>
                                      )}
                                  </div>

                                  {/* Upload Progress */}
                                  {uploadProgress && (
                                      <div className="col-xl-12 col-lg-12 mb-25">
                                          <div className="alert alert-info d-flex align-items-center gap-2 mb-0">
                                              <div className="spinner-border spinner-border-sm" role="status"></div>
                                              {uploadProgress}
                                          </div>
                                      </div>
                                  )}

                                  {/* Submit Button */}
                                  <div className="col-xl-12 col-lg-12">
                                      <div className="my-btn">
                                          <button type="submit" className="btn theme-bg text-capitalize f-18 f-700 w-100" disabled={submitting}
                                              style={{ height: "60px" }}>
                                              {submitting ? (
                                                  <><span className="spinner-border spinner-border-sm me-2" role="status"></span>접수 중...</>
                                              ) : "작품 접수하기"}
                                          </button>
                                      </div>
                                  </div>
                              </div>
                          </form>
                      </div>
                  </div>{/* /col */}
              </div>{/* /row */}
          </div>{/* /container */}
      </div>
    </>
  );
}
