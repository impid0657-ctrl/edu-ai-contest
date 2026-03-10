"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { CONTEST_CATEGORIES } from "@/lib/constants";

/**
 * AI License Application Page
 *
 * 4 auth paths:
 * 1. Kakao OAuth  → Supabase session → /api/license/apply (auth_method: "kakao")
 * 2. Naver OAuth  → Supabase session → /api/license/apply (auth_method: "naver")
 * 3. School Email OTP → no session → /api/license/apply-guest (auth_method: "school_email")
 * 4. Student ID upload → /api/school-email/upload-student-id → admin review (no form)
 */

const STATUS_LABELS = {
  pending: "대기 중",
  approved: "승인됨",
  rejected: "반려됨",
};

export default function LicenseApplyPage() {
  const supabase = createClient();

  // ── Hero (공통) ──
  const heroSection = (
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
                            <h1 className="text-capitalize f-700 mt-10 mb-20">AI이용권 신청</h1>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb justify-content-center bg-transparent">
                                <li className="breadcrumb-item"><a className="secondary-color3" href="/">홈</a></li>
                                <li className="breadcrumb-item active text-capitalize secondary-color3" aria-current="page">AI이용권 신청</li>
                                </ol>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );

  // ── State ──
  const [user, setUser] = useState(null);
  const [authMethod, setAuthMethod] = useState(null); // "kakao" | "naver" | "school_email"
  const [authConfirmed, setAuthConfirmed] = useState(false); // 인증 확인 완료 → 신청 폼으로 진행
  const [loading, setLoading] = useState(true);
  const [existingApp, setExistingApp] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Auth provider toggle (관리자 설정)
  const [authProviders, setAuthProviders] = useState({
    kakao: true, naver: true, school_email: true, student_direct: true,
  });

  // School email OTP
  const [showSchoolEmail, setShowSchoolEmail] = useState(false);
  const [schoolEmail, setSchoolEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [emailVerified, setEmailVerified] = useState(false); // OTP 인증 완료 상태

  // Student ID upload (독립)
  const [showStudentId, setShowStudentId] = useState(false);
  const [studentIdFile, setStudentIdFile] = useState(null);
  const [studentIdEmail, setStudentIdEmail] = useState("");
  const [studentIdSchool, setStudentIdSchool] = useState("");
  const [uploadingStudentId, setUploadingStudentId] = useState(false);
  const [studentIdSubmitted, setStudentIdSubmitted] = useState(false);
  const [studentIdError, setStudentIdError] = useState("");

  // Application form
  const [formData, setFormData] = useState({
    category: "",
    team_name: "",
    school_name: "",
    grade: "",
    member_count: 1,
    phone: "",
    motivation: "",
    applicant_name: "", // 비회원(학교 이메일) 전용
  });

  const inputStyle = { height: "55px", paddingLeft: "20px", fontSize: "16px" };

  // ── Init ──
  useEffect(() => {
    async function init() {
      try {
        // 인증 제공자 토글 설정 조회 (공개 API)
        try {
          const settingsRes = await fetch("/api/settings/auth-providers");
          if (settingsRes.ok) {
            const { auth_providers } = await settingsRes.json();
            if (auth_providers) setAuthProviders(auth_providers);
          }
        } catch { /* 실패 시 기본값(전부 ON) 유지 */ }

        // OAuth 콜백에서 방금 돌아왔을 때만 사용자 정보 로드 (?auth=done)
        const params = new URLSearchParams(window.location.search);
        const justAuthenticated = params.get("auth") === "done";

        if (justAuthenticated) {
          const meRes = await fetch("/api/auth/me");
          if (meRes.ok) {
            const { user: userData } = await meRes.json();
            if (userData) {
              setUser(userData);
              const provider = userData.app_metadata?.provider;
              if (provider === "kakao") setAuthMethod("kakao");
              else if (provider === "naver") setAuthMethod("naver");
              if (userData.phone) {
                setFormData((prev) => ({ ...prev, phone: userData.phone }));
              }
            }
          }

          // URL에서 ?auth=done 제거 (새로고침 시 다시 인증 화면으로)
          const cleanUrl = window.location.pathname;
          window.history.replaceState({}, "", cleanUrl);
        }
      } catch (err) {
        console.error("Init error:", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  // ── Handlers ──
  const handleOAuth = async (provider) => {
    const siteUrl = window.location.origin;
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${siteUrl}/callback?next=/license-apply` },
    });
    if (error) setError("본인 인증에 실패했습니다. 다시 시도해주세요.");
  };

  const handleSendOTP = async () => {
    setOtpError("");
    setOtpLoading(true);
    try {
      const res = await fetch("/api/school-email/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: schoolEmail }),
      });
      const data = await res.json();
      if (!res.ok) { setOtpError(data.error || "인증번호 발송에 실패했습니다."); return; }
      setOtpSent(true);
    } catch { setOtpError("네트워크 오류가 발생했습니다."); }
    finally { setOtpLoading(false); }
  };

  const handleVerifyOTP = async () => {
    setOtpError("");
    setOtpLoading(true);
    try {
      const res = await fetch("/api/school-email/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: schoolEmail, otp: otpCode }),
      });
      const data = await res.json();
      if (!res.ok) { setOtpError(data.error || "인증에 실패했습니다."); return; }
      // OTP 인증 성공 → 비회원 폼 표시 (Supabase 세션 없음)
      setEmailVerified(true);
      setAuthMethod("school_email");
    } catch { setOtpError("네트워크 오류가 발생했습니다."); }
    finally { setOtpLoading(false); }
  };

  const handleStudentIdUpload = async () => {
    if (!studentIdFile || !studentIdEmail) return;
    setStudentIdError("");
    setUploadingStudentId(true);
    try {
      const fd = new FormData();
      fd.append("file", studentIdFile);
      fd.append("email", studentIdEmail);
      fd.append("school_name", studentIdSchool);
      const res = await fetch("/api/school-email/upload-student-id", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) { setStudentIdError(data.error || "업로드에 실패했습니다."); return; }
      // 학생증 제출 성공 → 모달 닫고 바로 신청 폼으로 이동
      setStudentIdSubmitted(true);
      setAuthMethod("student_direct");
      setShowStudentId(false);
      // 학교명을 폼 데이터에 자동 반영
      if (studentIdSchool) {
        setFormData(prev => ({ ...prev, school_name: studentIdSchool }));
      }
    } catch { setStudentIdError("네트워크 오류가 발생했습니다."); }
    finally { setUploadingStudentId(false); }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "member_count" ? parseInt(value, 10) || 1 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      // OAuth 인증 (카카오/네이버) → 기존 API
      if (user) {
        const res = await fetch("/api/license/apply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...formData, auth_method: authMethod }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error || "신청에 실패했습니다."); return; }
        setSubmitted(true);
      }
      // 학교 이메일 OTP → 비회원 API
      else if (emailVerified) {
        const res = await fetch("/api/license/apply-guest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            auth_method: "school_email",
            applicant_email: schoolEmail,
          }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error || "신청에 실패했습니다."); return; }
        setSubmitted(true);
      }
      // 학생증 직접 제출 → 비회원 API (student_direct)
      else if (studentIdSubmitted) {
        const res = await fetch("/api/license/apply-guest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            auth_method: "student_direct",
            applicant_email: studentIdEmail,
          }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error || "신청에 실패했습니다."); return; }
        setSubmitted(true);
      }
    } catch (err) {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  const needsSchoolInfo = formData.category === "elementary" || formData.category === "secondary";

  // ════════════════════════════════════════════
  // RENDER: Loading
  // ════════════════════════════════════════════
  if (loading) {
    return (
      <>
      {heroSection}
      <div className="pt-135 pb-120 over-hidden">
        <div className="container text-center py-5">
          <div className="spinner-border" style={{ color: "var(--public-primary)" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
      </>
    );
  }

  // ════════════════════════════════════════════
  // RENDER: Already has application (OAuth user)
  // ════════════════════════════════════════════
  if (existingApp && !submitted) {
    return (
      <>
      {heroSection}
      <div className="pt-135 pb-120 over-hidden">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-7 col-lg-8 col-md-10 col-sm-12 col-12">
              <div className="contact-form-wrapper secondary-border01 pt-60 pb-60 pl-60 pr-60 text-center">
                <div className="display-4 mb-20">📋</div>
                <h3 className="f-700 mb-20">신청 현황</h3>
                <span className={`d-inline-block f-700 mb-30 ${existingApp.status === "rejected" ? "" : "theme-bg"} text-white`} style={{
                  borderRadius: "30px", fontSize: "16px", padding: "8px 30px",
                  ...(existingApp.status === "rejected" ? { background: "#dc3545" } : {})
                }}>
                  {STATUS_LABELS[existingApp.status] || existingApp.status}
                </span>
                <div className="text-start mt-20">
                  <div className="secondary-border01 py-3 px-4 mb-15">
                    <span className="f-700 me-2">부문:</span>
                    {CONTEST_CATEGORIES.find((c) => c.id === existingApp.category)?.name || existingApp.category}
                  </div>
                  {existingApp.team_name && (
                    <div className="secondary-border01 py-3 px-4 mb-15">
                      <span className="f-700 me-2">팀명:</span>{existingApp.team_name}
                    </div>
                  )}
                  <p className="text-muted text-center mt-20 mb-0">관리자 승인까지 1~3일 소요됩니다.</p>
                </div>
                <div className="my-btn mt-30">
                  <a href="/" className="btn theme-bg text-uppercase f-18 f-700">홈으로 돌아가기</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }

  // ════════════════════════════════════════════
  // RENDER: Submitted successfully
  // ════════════════════════════════════════════
  if (submitted) {
    return (
      <>
      {heroSection}
      <div className="pt-135 pb-120 over-hidden">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-7 col-lg-8 col-md-10 col-sm-12 col-12">
              <div className="contact-form-wrapper secondary-border01 pt-60 pb-60 pl-60 pr-60 text-center">
                <div className="display-1 mb-20">🎉</div>
                <h3 className="f-700 mb-20">신청이 완료되었습니다!</h3>
                <span className="d-inline-block theme-bg text-white f-700 mb-30" style={{
                  borderRadius: "30px", fontSize: "16px", padding: "8px 30px"
                }}>대기 중 (pending)</span>
                <p className="text-muted mb-30">관리자 승인까지 1~3일 소요됩니다.</p>
                <div className="my-btn">
                  <a href="/" className="btn theme-bg text-uppercase f-18 f-700">홈으로 돌아가기</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }

  // ════════════════════════════════════════════
  // RENDER: OAuth user logged in — show auth confirmation step
  // ════════════════════════════════════════════
  if (user && !authConfirmed) {
    const providerLabel = authMethod === "kakao" ? "카카오" : authMethod === "naver" ? "네이버" : "소셜 로그인";
    return (
      <>
      {heroSection}
      <div className="contact-area pt-135 pb-120 over-hidden">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-7 col-lg-8 col-md-10 col-sm-12 col-12">
              <div className="title text-center mb-50">
                <span className="theme-color f-700">AI 이용권 신청</span>
                <h3 className="f-700 mb-20">본인 인증 확인</h3>
                <p>아래 계정 정보로 AI 이용권을 신청합니다.</p>
              </div>

              <div className="contact-form-wrapper secondary-border01 pt-60 pb-60 pl-60 pr-60 text-center">
                <div className="display-3 mb-20">✅</div>
                <h4 className="f-700 mb-15">{providerLabel} 인증 완료</h4>
                <p className="mb-10"><span className="f-700">이메일:</span> {user.email || "(비공개)"}</p>
                {user.user_metadata?.name && (
                  <p className="mb-10"><span className="f-700">이름:</span> {user.user_metadata.name}</p>
                )}
                <p className="text-muted mb-30" style={{ fontSize: "14px" }}>
                  위 계정으로 신청을 진행하시겠습니까?
                </p>

                <div className="row g-3 justify-content-center">
                  <div className="col-auto">
                    <div className="my-btn">
                      <button type="button" className="btn theme-bg text-uppercase f-18 f-700"
                        style={{ height: "55px", paddingLeft: "40px", paddingRight: "40px" }}
                        onClick={() => setAuthConfirmed(true)}>
                        신청서 작성하기
                      </button>
                    </div>
                  </div>
                  <div className="col-auto">
                    <button type="button" className="btn secondary-border01 text-uppercase f-18 f-700"
                      style={{ height: "55px", paddingLeft: "40px", paddingRight: "40px" }}
                      onClick={async () => { await supabase.auth.signOut(); setUser(null); setAuthMethod(null); }}>
                      다른 계정으로 인증
                    </button>
                  </div>
                </div>
              </div>

              {/* 신청 현황 조회 */}
              <div className="text-center mt-40">
                <p className="text-muted mb-15">이미 신청하셨나요?</p>
                <div className="my-btn d-inline-block">
                  <a href="/license-apply/status" className="btn theme-bg text-uppercase f-18 f-700">신청 현황 조회</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }

  // ════════════════════════════════════════════
  // RENDER: Application form (Auth confirmed OR OTP verified)
  // ════════════════════════════════════════════
  if ((user && authConfirmed) || emailVerified || studentIdSubmitted) {
    return (
      <>
      {heroSection}
      <div className="contact-area pt-135 pb-120 over-hidden">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-9 col-md-10 col-sm-12 col-12">
              <div className="title text-center mb-50">
                <span className="theme-color f-700">AI 이용권 신청</span>
                <h3 className="f-700 mb-20">에듀핏(EduFit) AI 학습 플랫폼</h3>
                <p>선착순 500명까지 무료로 제공 (2개월 이용권: 4월 1일 ~ 5월 31일)</p>
              </div>

              {/* 신청 현황 조회 */}
              <div className="text-center mb-40">
                <p className="text-muted mb-10">이미 신청하셨나요?</p>
                <div className="my-btn d-inline-block">
                  <a href="/license-apply/status" className="btn theme-bg text-uppercase f-16 f-700">신청 현황 조회</a>
                </div>
              </div>

              <div className="contact-form-wrapper secondary-border01 pt-60 pb-60 pl-60 pr-60">
                {error && (
                  <div className="alert alert-danger mb-30" role="alert">
                    <i className="fas fa-exclamation-circle me-2"></i>{error}
                  </div>
                )}

                {/* OTP 인증 완료 안내 */}
                {emailVerified && (
                  <div className="alert alert-success mb-30">
                    <i className="fas fa-check-circle me-2"></i>
                    <span className="f-700">{schoolEmail}</span> 인증이 완료되었습니다.
                  </div>
                )}

                {/* 학생증 인증 완료 안내 */}
                {studentIdSubmitted && (
                  <div className="alert alert-success mb-30">
                    <i className="fas fa-check-circle me-2"></i>
                    학생증 인증이 완료되었습니다. 아래 신청서를 작성해주세요.
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row">

                    {/* 비회원 전용: 이름 */}
                    {(emailVerified || studentIdSubmitted) && !user && (
                      <div className="col-xl-12 col-lg-12 mb-25">
                        <label className="f-700 mb-10 d-block">이름 <span className="theme-color">*</span></label>
                        <input type="text" name="applicant_name" className="form-control secondary-border01"
                          placeholder="이름을 입력해주세요"
                          value={formData.applicant_name} onChange={handleChange} required
                          style={inputStyle} />
                      </div>
                    )}

                    {/* Category */}
                    <div className="col-xl-12 col-lg-12 mb-25">
                      <label className="f-700 mb-10 d-block">참가 부문 <span className="theme-color">*</span></label>
                      <select name="category" className="form-control secondary-border01"
                        value={formData.category} onChange={handleChange} required
                        style={inputStyle}>
                        <option value="">부문을 선택해주세요</option>
                        {CONTEST_CATEGORIES.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Team Name + Member Count */}
                    <div className="col-xl-6 col-lg-6 mb-25">
                      <label className="f-700 mb-10 d-block">팀명</label>
                      <input type="text" name="team_name" className="form-control secondary-border01"
                        placeholder="팀명 (개인 참가 시 빈칸)"
                        value={formData.team_name} onChange={handleChange}
                        style={inputStyle} />
                    </div>
                    <div className="col-xl-6 col-lg-6 mb-25">
                      <label className="f-700 mb-10 d-block">팀원 수 <span className="theme-color">*</span></label>
                      <input type="number" name="member_count" className="form-control secondary-border01"
                        min={1} max={4} value={formData.member_count} onChange={handleChange} required
                        style={inputStyle} />
                      <p className="text-muted mt-5 mb-0" style={{ fontSize: "13px" }}>1~4명 (개인 참가 시 1명)</p>
                    </div>

                    {/* School — conditional */}
                    {needsSchoolInfo && (
                      <>
                        <div className="col-xl-6 col-lg-6 mb-25">
                          <label className="f-700 mb-10 d-block">학교명 <span className="theme-color">*</span></label>
                          <input type="text" name="school_name" className="form-control secondary-border01"
                            placeholder="학교명을 입력해주세요"
                            value={formData.school_name} onChange={handleChange} required
                            style={inputStyle} />
                        </div>
                        <div className="col-xl-6 col-lg-6 mb-25">
                          <label className="f-700 mb-10 d-block">학년 <span className="theme-color">*</span></label>
                          <input type="text" name="grade" className="form-control secondary-border01"
                            placeholder="예: 5학년"
                            value={formData.grade} onChange={handleChange} required
                            style={inputStyle} />
                        </div>
                      </>
                    )}

                    {/* Phone */}
                    <div className="col-xl-12 col-lg-12 mb-25">
                      <label className="f-700 mb-10 d-block">연락처 <span className="theme-color">*</span></label>
                      <input type="tel" name="phone" className="form-control secondary-border01"
                        placeholder="010-0000-0000"
                        value={formData.phone} onChange={handleChange} required
                        style={inputStyle} />
                    </div>

                    {/* Motivation */}
                    <div className="col-xl-12 col-lg-12 mb-35">
                      <label className="f-700 mb-10 d-block">참가 동기</label>
                      <textarea name="motivation" className="form-control secondary-border01" rows={4}
                        maxLength={500} placeholder="참가 동기를 간단히 작성해주세요"
                        value={formData.motivation} onChange={handleChange}
                        style={{ paddingLeft: "20px", paddingTop: "15px", fontSize: "16px" }}></textarea>
                      <p className="text-muted text-end mt-5 mb-0" style={{ fontSize: "13px" }}>{formData.motivation.length}/500</p>
                    </div>

                    {/* Submit */}
                    <div className="col-xl-12 col-lg-12">
                      <div className="my-btn">
                        <button type="submit" className="btn theme-bg text-uppercase f-18 f-700 w-100"
                          style={{ height: "60px" }} disabled={submitting}>
                          {submitting ? (
                            <><span className="spinner-border spinner-border-sm me-2" role="status"></span>제출 중...</>
                          ) : "신청하기"}
                        </button>
                      </div>
                      <p className="text-muted text-center mt-20 mb-0" style={{ fontSize: "14px" }}>
                        신청 후 관리자 승인까지 1~3일 소요됩니다.
                      </p>
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

  // ════════════════════════════════════════════
  // RENDER: Not authenticated → show auth buttons
  // ════════════════════════════════════════════
  return (
    <>
    {heroSection}
    <div className="contact-area pt-135 pb-120 over-hidden">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-7 col-lg-8 col-md-10 col-sm-12 col-12">
            <div className="title text-center mb-50">
              <span className="theme-color f-700">AI 이용권 신청</span>
              <h3 className="f-700 mb-20">본인 인증이 필요합니다</h3>
              <p>카카오, 네이버, 학교 이메일 또는 학생증으로 본인 인증을 완료해 주세요.</p>
            </div>

            <div className="contact-form-wrapper secondary-border01 pt-60 pb-60 pl-60 pr-60">
              {error && (
                <div className="alert alert-danger mb-30" role="alert">
                  <i className="fas fa-exclamation-circle me-2"></i>{error}
                </div>
              )}

              <div className="row">
                {/* ── 1. 카카오 인증 ── */}
                {authProviders.kakao && (
                <div className="col-xl-12 col-lg-12 mb-20">
                  <div className="my-btn">
                    <button type="button" className="btn w-100 f-18 f-700 text-capitalize"
                      style={{ height: "55px", backgroundColor: "#FEE500", color: "#191919", border: "none" }}
                      onClick={() => handleOAuth("kakao")}>
                      카카오로 본인 인증
                    </button>
                  </div>
                </div>
                )}

                {/* ── 2. 네이버 인증 ── */}
                {authProviders.naver && (
                <div className="col-xl-12 col-lg-12 mb-20">
                  <div className="my-btn">
                    <button type="button" className="btn w-100 f-18 f-700 text-capitalize"
                      style={{ height: "55px", backgroundColor: "#03C75A", color: "#fff", border: "none" }}
                      onClick={() => handleOAuth("naver")}>
                      네이버로 본인 인증
                    </button>
                  </div>
                </div>
                )}

                {/* ── 3. 학교 이메일 인증 ── */}
                {authProviders.school_email && (
                <div className="col-xl-12 col-lg-12 mb-20">
                  <div className="my-btn">
                    <button type="button" className="btn theme-bg w-100 f-18 f-700 text-capitalize"
                      style={{ height: "55px" }}
                      onClick={() => setShowSchoolEmail(true)}>
                      학교 이메일로 본인 인증
                    </button>
                  </div>
                </div>
                )}

                {/* ── 4. 학교 학생증으로 본인 인증 ── */}
                {authProviders.student_direct && (
                <div className="col-xl-12 col-lg-12 mb-20">
                  <div className="my-btn">
                    <button type="button" className="btn theme-bg w-100 f-18 f-700 text-capitalize"
                      style={{ height: "55px" }}
                      onClick={() => setShowStudentId(true)}>
                      학교 학생증으로 본인 인증
                    </button>
                  </div>
                </div>
                )}
              </div>

              <p className="text-muted text-center mt-20 mb-0" style={{ fontSize: "14px" }}>
                본인 인증은 AI 이용권 신청 자격 확인을 위해서만 사용됩니다.
              </p>
            </div>

            {/* 신청 현황 조회 */}
            <div className="text-center mt-40">
              <p className="text-muted mb-15">이미 신청하셨나요?</p>
              <div className="my-btn d-inline-block">
                <a href="/license-apply/status" className="btn theme-bg text-uppercase f-18 f-700">신청 현황 조회</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* ═══ 학교 이메일 인증 모달 ═══ */}
    {showSchoolEmail && (
      <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 99999 }}>
        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "500px" }}>
          <div className="modal-content" style={{ borderRadius: "12px", border: "none", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <div className="modal-header" style={{ borderBottom: "2px solid #f0f0f0", padding: "20px 30px" }}>
              <h5 className="modal-title f-700" style={{ fontSize: "20px" }}>학교 이메일 인증</h5>
              <button className="btn-close" onClick={() => { setShowSchoolEmail(false); setOtpSent(false); setOtpCode(""); setOtpError(""); }} />
            </div>
            <div className="modal-body" style={{ padding: "50px 30px" }}>
              {otpError && (
                <div className="alert alert-danger py-2 mb-20" role="alert">
                  <i className="fas fa-exclamation-circle me-2"></i>{otpError}
                </div>
              )}

              {!otpSent ? (
                <>
                  <label className="f-700 mb-10 d-block">학교 이메일 <span className="theme-color">*</span></label>
                  <p className="text-muted mb-15" style={{ fontSize: "14px" }}>*.ac.kr, *.hs.kr, *.ms.kr, *.es.kr</p>
                  <input type="email" className="form-control secondary-border01 mb-20"
                    placeholder="student@school.ac.kr"
                    value={schoolEmail}
                    onChange={(e) => setSchoolEmail(e.target.value)}
                    disabled={otpLoading}
                    style={inputStyle} />
                  <div className="my-btn">
                    <button type="button" className="btn theme-bg f-700 w-100"
                      style={{ height: "55px", fontSize: "16px" }}
                      onClick={handleSendOTP}
                      disabled={otpLoading || !schoolEmail.trim()}>
                      {otpLoading ? (
                        <><span className="spinner-border spinner-border-sm me-2" role="status"></span>발송 중...</>
                      ) : "인증번호 발송"}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="alert alert-info py-2 mb-20" style={{ background: "#e8f4fd", border: "none" }}>
                    <i className="fas fa-check-circle me-1 theme-color"></i>
                    인증번호가 <span className="f-700">{schoolEmail}</span>으로 발송되었습니다.
                  </div>
                  <label className="f-700 mb-10 d-block">인증번호 6자리</label>
                  <input type="text" className="form-control secondary-border01 mb-20 text-center"
                    placeholder="000000"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    disabled={otpLoading}
                    style={{ ...inputStyle, fontSize: "24px", letterSpacing: "8px" }} />
                  <div className="my-btn mb-15">
                    <button type="button" className="btn theme-bg f-700 w-100"
                      style={{ height: "55px", fontSize: "16px" }}
                      onClick={handleVerifyOTP}
                      disabled={otpLoading || otpCode.length !== 6}>
                      {otpLoading ? (
                        <><span className="spinner-border spinner-border-sm me-2" role="status"></span>확인 중...</>
                      ) : "인증 확인"}
                    </button>
                  </div>
                  <div className="text-center">
                    <button type="button" className="btn btn-link p-0 theme-color f-700"
                      style={{ fontSize: "14px" }}
                      onClick={() => { setOtpSent(false); setOtpCode(""); setOtpError(""); }}>
                      인증번호 재발송
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer" style={{ borderTop: "2px solid #f0f0f0", padding: "15px 30px" }}>
              <button type="button" className="btn secondary-border01 f-700 w-100"
                style={{ height: "45px" }}
                onClick={() => { setShowSchoolEmail(false); setOtpSent(false); setOtpCode(""); setOtpError(""); }}>
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* ═══ 학생증 업로드 모달 ═══ */}
    {showStudentId && (
      <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: 99999 }}>
        <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "500px" }}>
          <div className="modal-content" style={{ borderRadius: "12px", border: "none", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <div className="modal-header" style={{ borderBottom: "2px solid #f0f0f0", padding: "20px 30px" }}>
              <h5 className="modal-title f-700" style={{ fontSize: "20px" }}>학생증 본인 인증</h5>
              <button className="btn-close" onClick={() => { setShowStudentId(false); setStudentIdError(""); }} />
            </div>
            <div className="modal-body" style={{ padding: "25px 30px" }}>
              {studentIdSubmitted ? (
                <div className="text-center py-3">
                  <div className="display-3 mb-20">✅</div>
                  <h5 className="f-700 mb-15">학생증이 제출되었습니다!</h5>
                  <p className="text-muted mb-20">관리자 확인 후 승인됩니다 (1~3일 소요).</p>
                  <div className="my-btn">
                    <button type="button" className="btn theme-bg f-700 w-100"
                      style={{ height: "50px" }}
                      onClick={() => setShowStudentId(false)}>
                      확인
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {studentIdError && (
                    <div className="alert alert-danger py-2 mb-20">{studentIdError}</div>
                  )}
                  <div className="mb-20">
                    <label className="f-700 mb-10 d-block">연락 이메일 <span className="theme-color">*</span></label>
                    <input type="email" className="form-control secondary-border01"
                      placeholder="결과를 받을 이메일"
                      value={studentIdEmail}
                      onChange={(e) => setStudentIdEmail(e.target.value)}
                      style={inputStyle} />
                  </div>
                  <div className="mb-20">
                    <label className="f-700 mb-10 d-block">학교명 <span className="theme-color">*</span></label>
                    <input type="text" className="form-control secondary-border01"
                      placeholder="학교명" value={studentIdSchool}
                      onChange={(e) => setStudentIdSchool(e.target.value)}
                      style={inputStyle} />
                  </div>
                  <div className="mb-20">
                    <label className="f-700 mb-10 d-block">학생증 사진 <span className="theme-color">*</span></label>
                    <p className="text-muted mb-10" style={{ fontSize: "14px" }}>jpg, png, pdf / 최대 5MB</p>
                    <input type="file" className="form-control secondary-border01"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => setStudentIdFile(e.target.files?.[0] || null)}
                      style={{ height: "auto", padding: "12px 20px" }} />
                  </div>
                  <div className="my-btn">
                    <button type="button" className="btn theme-bg w-100 f-18 f-700"
                      style={{ height: "55px" }}
                      onClick={handleStudentIdUpload}
                      disabled={uploadingStudentId || !studentIdFile || !studentIdEmail.trim()}>
                      {uploadingStudentId ? (
                        <><span className="spinner-border spinner-border-sm me-2" role="status"></span>제출 중...</>
                      ) : "학생증 제출하기"}
                    </button>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer" style={{ borderTop: "2px solid #f0f0f0", padding: "15px 30px" }}>
              <button type="button" className="btn secondary-border01 f-700 w-100"
                style={{ height: "45px" }}
                onClick={() => { setShowStudentId(false); setStudentIdError(""); }}>
                닫기
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
}
