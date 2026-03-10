"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/components/RichTextEditor";

/**
 * QnA Write Page — /board/write
 * Evalo original template design (contact-form style)
 */

export default function BoardWritePage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    author_name: "", password: "", title: "", content: "", is_secret: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSubmitting(true);
    try {
      const res = await fetch("/api/board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "qna", ...formData }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "작성에 실패했습니다."); setSubmitting(false); return; }
      router.push("/contact");
    } catch { setError("네트워크 오류가 발생했습니다."); }
    finally { setSubmitting(false); }
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
                              <h1 className="text-capitalize f-700 mt-10 mb-20">문의 작성</h1>
                              <nav aria-label="breadcrumb">
                                  <ol className="breadcrumb justify-content-center bg-transparent">
                                  <li className="breadcrumb-item"><a className="secondary-color3" href="/">홈</a></li>
                                  <li className="breadcrumb-item"><a className="secondary-color3" href="/contact">문의하기</a></li>
                                  <li className="breadcrumb-item active text-capitalize secondary-color3" aria-current="page">문의 작성</li>
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
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                      <div className="title text-center mb-50">
                          <span className="theme-color f-700">문의 작성</span>
                          <h3 className="f-700 mb-20">궁금한 점을 남겨주세요</h3>
                          <p>작성하신 문의에 대한 답변은 관리자가 확인 후 등록해드립니다.</p>
                      </div>

                      <div className="contact-form-wrapper secondary-border01 pt-60 pb-60 pl-60 pr-60">
                          {error && (
                              <div className="alert alert-danger mb-30" role="alert">
                                  <i className="fas fa-exclamation-circle me-2"></i>{error}
                              </div>
                          )}

                          <form onSubmit={handleSubmit}>
                              <div className="row">
                                  {/* 작성자 이름 */}
                                  <div className="col-xl-6 col-lg-6 mb-25">
                                      <label className="f-700 mb-10 d-block">작성자 이름 <span className="theme-color">*</span></label>
                                      <input type="text" name="author_name" className="form-control secondary-border01"
                                          placeholder="이름을 입력해주세요" value={formData.author_name} onChange={handleChange} required
                                          style={{ height: "55px", paddingLeft: "20px", fontSize: "16px" }} />
                                  </div>

                                  {/* 비밀번호 */}
                                  <div className="col-xl-6 col-lg-6 mb-25">
                                      <label className="f-700 mb-10 d-block">비밀번호 <span className="theme-color">*</span></label>
                                      <input type="password" name="password" className="form-control secondary-border01"
                                          placeholder="수정/삭제 시 필요 (4자 이상)" minLength={4}
                                          value={formData.password} onChange={handleChange} required
                                          style={{ height: "55px", paddingLeft: "20px", fontSize: "16px" }} />
                                  </div>

                                  {/* 제목 */}
                                  <div className="col-xl-12 col-lg-12 mb-25">
                                      <label className="f-700 mb-10 d-block">제목 <span className="theme-color">*</span></label>
                                      <input type="text" name="title" className="form-control secondary-border01"
                                          placeholder="문의 제목을 입력해주세요" value={formData.title} onChange={handleChange} required
                                          style={{ height: "55px", paddingLeft: "20px", fontSize: "16px" }} />
                                  </div>

                                  {/* 내용 */}
                                  <div className="col-xl-12 col-lg-12 mb-25">
                                      <label className="f-700 mb-10 d-block">내용 <span className="theme-color">*</span></label>
                                      <RichTextEditor
                                        value={formData.content}
                                        onChange={(html) => setFormData((prev) => ({ ...prev, content: html }))}
                                        placeholder="궁금한 내용을 작성해주세요"
                                        height="200px"
                                      />
                                  </div>

                                  {/* 비밀글 */}
                                  <div className="col-xl-12 col-lg-12 mb-35">
                                      <div className="d-flex align-items-center">
                                          <input type="checkbox" name="is_secret" id="is_secret"
                                              checked={formData.is_secret} onChange={handleChange}
                                              style={{ width: "18px", height: "18px", marginRight: "10px" }} />
                                          <label htmlFor="is_secret" className="mb-0">🔒 비밀글로 작성</label>
                                      </div>
                                  </div>

                                  {/* 버튼 */}
                                  <div className="col-xl-6 col-lg-6 mb-15">
                                      <div className="my-btn">
                                          <button type="button" className="btn secondary-border01 text-capitalize f-18 f-700 w-100"
                                              style={{ height: "55px" }}
                                              onClick={() => router.push("/contact")}>
                                              취소
                                          </button>
                                      </div>
                                  </div>
                                  <div className="col-xl-6 col-lg-6 mb-15">
                                      <div className="my-btn">
                                          <button type="submit" className="btn theme-bg text-capitalize f-18 f-700 w-100" disabled={submitting}
                                              style={{ height: "55px" }}>
                                              {submitting ? (
                                                  <><span className="spinner-border spinner-border-sm me-2" role="status"></span>작성 중...</>
                                              ) : "문의 등록"}
                                          </button>
                                      </div>
                                  </div>
                              </div>
                          </form>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </>
  );
}
