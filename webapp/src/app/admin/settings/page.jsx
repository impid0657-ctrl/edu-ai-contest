"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import EmailEditor from "@/components/EmailEditor";

/**
 * Admin Settings Page — /admin/settings
 * Sections:
 *   1. 대회 운영 설정 (site_settings: deadline, contest name, submission toggle)
 *   2. 인증 제공자 설정 (chatbot_settings.auth_providers)
 *   3. 파일 업로드 설정 (file_upload_settings table)
 *
 * WowDash design — zero inline styles.
 */

export default function AdminSettingsPage() {
  // Auth providers
  const [authProviders, setAuthProviders] = useState({ kakao: true, naver: true, school_email: true, student_direct: true });
  // File upload settings
  const [fileSettings, setFileSettings] = useState([]);
  // Site settings (deadline, contest name, etc.)
  const [siteSettings, setSiteSettings] = useState({
    contest_deadline: "2026-08-31T23:59:59+09:00",
    contest_name: "제8회 교육 공공데이터 AI활용대회",
    contest_location: "세종특별자치시 교육부",
    max_license_seats: 500,
    submission_enabled: true,
  });

  // Email settings (Gmail SMTP)
  const [emailSettings, setEmailSettings] = useState({
    email_provider: "gmail",
    gmail_user: "",
    gmail_app_password: "",
    email_sender_name: "교육 공공데이터 AI활용대회",
  });
  // Email templates
  const [emailTemplates, setEmailTemplates] = useState({
    email_template_otp_subject: "[제8회 교육 공공데이터 AI활용대회] 이메일 인증번호 안내",
    email_template_otp_body: `<div style="max-width:600px;margin:0 auto;font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;background:#ffffff;">
  <div style="background:linear-gradient(135deg,#4361ee 0%,#7c3aed 100%);padding:40px 30px;text-align:center;border-radius:12px 12px 0 0;">
    <h1 style="color:#ffffff;font-size:22px;margin:0 0 8px 0;font-weight:700;">제8회 교육 공공데이터 AI활용 경진대회</h1>
    <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:0;">이메일 인증번호 안내</p>
  </div>
  <div style="padding:40px 30px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
    <p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 25px 0;">안녕하세요,<br>AI 이용권 신청을 위한 <strong>이메일 인증번호</strong>입니다.</p>
    <div style="background:linear-gradient(135deg,#f0f4ff 0%,#ede9fe 100%);border:2px solid #4361ee;border-radius:16px;padding:30px;text-align:center;margin:0 0 25px 0;">
      <p style="font-size:13px;color:#6b7280;margin:0 0 8px 0;letter-spacing:1px;">인증번호</p>
      <p style="font-size:42px;font-weight:800;letter-spacing:10px;color:#4361ee;margin:0;font-family:'Courier New',monospace;">{{OTP_CODE}}</p>
    </div>
    <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:12px 16px;border-radius:0 8px 8px 0;margin:0 0 25px 0;">
      <p style="font-size:13px;color:#92400e;margin:0;">⏱ 이 인증번호는 <strong>5분 후 만료</strong>됩니다. 시간 내에 입력해주세요.</p>
    </div>
    <p style="font-size:13px;color:#9ca3af;line-height:1.6;margin:0 0 8px 0;">본인이 요청하지 않았다면 이 이메일을 무시해주세요.</p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:25px 0;" />
    <p style="font-size:12px;color:#d1d5db;text-align:center;margin:0;">교육부 · 한국교육학술정보원 · 제8회 교육 공공데이터 AI활용 경진대회</p>
  </div>
</div>`,
    email_template_submission_subject: "[제8회 교육 공공데이터 AI활용대회] 작품 접수 완료 ({{SUBMISSION_NO}})",
    email_template_submission_body: `<div style="max-width:600px;margin:0 auto;font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif;background:#ffffff;">
  <div style="background:linear-gradient(135deg,#4361ee 0%,#7c3aed 100%);padding:40px 30px;text-align:center;border-radius:12px 12px 0 0;">
    <h1 style="color:#ffffff;font-size:22px;margin:0 0 8px 0;font-weight:700;">제8회 교육 공공데이터 AI활용 경진대회</h1>
    <p style="color:rgba(255,255,255,0.85);font-size:14px;margin:0;">🎉 작품 접수 완료</p>
  </div>
  <div style="padding:40px 30px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;">
    <p style="font-size:15px;color:#333;line-height:1.6;margin:0 0 25px 0;">안녕하세요,<br>작품이 <strong>정상적으로 접수</strong>되었습니다. 아래 내용을 확인해주세요.</p>
    <div style="background:#f0fdf4;border:1px solid #86efac;border-radius:12px;padding:24px;margin:0 0 25px 0;">
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;font-size:14px;color:#6b7280;width:100px;">접수번호</td><td style="padding:8px 0;font-size:16px;font-weight:700;color:#059669;font-family:'Courier New',monospace;">{{SUBMISSION_NO}}</td></tr>
        <tr><td style="padding:8px 0;font-size:14px;color:#6b7280;border-top:1px solid #d1fae5;">작품 제목</td><td style="padding:8px 0;font-size:15px;font-weight:600;color:#333;border-top:1px solid #d1fae5;">{{TITLE}}</td></tr>
      </table>
    </div>
    <div style="background:#eff6ff;border-left:4px solid #3b82f6;padding:14px 16px;border-radius:0 8px 8px 0;margin:0 0 25px 0;">
      <p style="font-size:13px;color:#1e40af;margin:0 0 4px 0;font-weight:600;">📋 안내사항</p>
      <p style="font-size:13px;color:#1e40af;margin:0;line-height:1.6;">• 접수번호와 비밀번호로 접수 내역 <strong>조회 및 수정</strong>이 가능합니다.<br>• 마감일 이전까지 수정이 가능하며, 마감 후에는 변경이 불가합니다.<br>• 심사 결과는 대회 홈페이지에서 확인하실 수 있습니다.</p>
    </div>
    <p style="font-size:13px;color:#9ca3af;line-height:1.6;margin:0;">대회 참여에 감사드립니다. 좋은 결과가 있기를 바랍니다!</p>
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:25px 0;" />
    <p style="font-size:12px;color:#d1d5db;text-align:center;margin:0;">교육부 · 한국교육학술정보원 · 제8회 교육 공공데이터 AI활용 경진대회</p>
  </div>
</div>`,
  });
  const [activeTemplateTab, setActiveTemplateTab] = useState("otp");
  const [showPreview, setShowPreview] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [testingEmail, setTestingEmail] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => { fetchAllSettings(); }, []);

  const fetchAllSettings = async () => {
    try {
      // Fetch existing auth + file settings
      const [settingsRes, siteRes] = await Promise.all([
        fetch("/api/admin/settings"),
        fetch("/api/admin/site-settings"),
      ]);

      if (settingsRes.ok) {
        const data = await settingsRes.json();
        setAuthProviders(data.settings.auth_providers || { kakao: true, naver: true, school_email: true });
        setFileSettings(data.settings.file_upload_settings || []);
      }

      if (siteRes.ok) {
        const siteData = await siteRes.json();
        const s = siteData.settings || {};
        setSiteSettings((prev) => ({
          contest_deadline: parseSettingValue(s.contest_deadline?.value) || prev.contest_deadline,
          contest_name: parseSettingValue(s.contest_name?.value) || prev.contest_name,
          contest_location: parseSettingValue(s.contest_location?.value) || prev.contest_location,
          max_license_seats: parseSettingValue(s.max_license_seats?.value) ?? prev.max_license_seats,
          submission_enabled: parseSettingValue(s.submission_enabled?.value) ?? prev.submission_enabled,
        }));
        // Gmail 설정 로드
        setEmailSettings((prev) => ({
          email_provider: parseSettingValue(s.email_provider?.value) || prev.email_provider,
          gmail_user: parseSettingValue(s.gmail_user?.value) || prev.gmail_user,
          gmail_app_password: parseSettingValue(s.gmail_app_password?.value) || prev.gmail_app_password,
          email_sender_name: parseSettingValue(s.email_sender_name?.value) || prev.email_sender_name,
        }));
        // 이메일 템플릿 로드
        setEmailTemplates((prev) => ({
          email_template_otp_subject: parseSettingValue(s.email_template_otp_subject?.value) || prev.email_template_otp_subject,
          email_template_otp_body: parseSettingValue(s.email_template_otp_body?.value) || prev.email_template_otp_body,
          email_template_submission_subject: parseSettingValue(s.email_template_submission_subject?.value) || prev.email_template_submission_subject,
          email_template_submission_body: parseSettingValue(s.email_template_submission_body?.value) || prev.email_template_submission_body,
        }));
      }
    } catch (err) { console.error("Settings fetch error:", err); }
    finally { setLoading(false); }
  };

  function parseSettingValue(val) {
    if (val === undefined || val === null) return null;
    if (typeof val === "string") {
      try { return JSON.parse(val); } catch { return val; }
    }
    return val;
  }

  const handleProviderToggle = (provider) => {
    setAuthProviders((prev) => ({ ...prev, [provider]: !prev[provider] }));
    setMessage({ type: "", text: "" });
  };

  const handleFileSettingChange = (uploadType, field, value) => {
    setFileSettings((prev) => prev.map((fs) =>
      fs.upload_type === uploadType ? { ...fs, [field]: value } : fs
    ));
    setMessage({ type: "", text: "" });
  };

  const handleSiteSettingChange = (key, value) => {
    setSiteSettings((prev) => ({ ...prev, [key]: value }));
    setMessage({ type: "", text: "" });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      // Save auth + file settings
      const res1 = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auth_providers: authProviders, file_upload_settings: fileSettings }),
      });

      // Save site settings (deadline, etc.) + email settings + templates
      const allSiteUpdates = { ...siteSettings, ...emailSettings, ...emailTemplates };
      const res2 = await fetch("/api/admin/site-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updates: allSiteUpdates }),
      });

      if (res1.ok && res2.ok) {
        setMessage({ type: "success", text: "모든 설정이 저장되었습니다." });
      } else {
        const err1 = !res1.ok ? await res1.json().catch(() => ({})) : {};
        const err2 = !res2.ok ? await res2.json().catch(() => ({})) : {};
        setMessage({ type: "danger", text: err1.error || err2.error || "일부 설정 저장에 실패했습니다." });
      }
    } catch { setMessage({ type: "danger", text: "네트워크 오류가 발생했습니다." }); }
    finally { setSaving(false); }
  };

  // Convert ISO datetime to input-friendly format (datetime-local)
  const deadlineToInput = (isoStr) => {
    if (!isoStr) return "";
    try {
      const d = new Date(isoStr);
      // Convert to KST for display
      const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
      return kst.toISOString().slice(0, 16);
    } catch { return ""; }
  };

  const inputToDeadline = (localStr) => {
    if (!localStr) return "";
    // Treat input as KST, store with +09:00 offset
    return localStr + ":00+09:00";
  };

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;
  }

  const PROVIDER_INFO = [
    { key: "kakao", label: "카카오 본인 인증", icon: "ri:kakao-talk-fill", desc: "카카오 계정으로 보호자/성인 본인 인증" },
    { key: "naver", label: "네이버 본인 인증", icon: "simple-icons:naver", desc: "네이버 계정으로 보호자/성인 본인 인증" },
    { key: "school_email", label: "학교 이메일 OTP", icon: "mdi:email-check", desc: "*.ac.kr, *.hs.kr 등 학교 이메일 인증" },
    { key: "student_direct", label: "학생 직접 신청", icon: "mdi:account-school", desc: "학교 이메일 없는 학생이 학생증 업로드로 신청 (관리자 승인 필요)" },
  ];

  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <h6 className="fw-semibold mb-0">설정</h6>
        <button className="btn btn-primary-600" onClick={handleSave} disabled={saving}>
          <Icon icon="mdi:content-save" className="me-1" />
          {saving ? "저장 중..." : "전체 설정 저장"}
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible mb-4`}>
          {message.text}
          <button className="btn-close" onClick={() => setMessage({ type: "", text: "" })} />
        </div>
      )}

      {/* ===== Section 1: 대회 운영 설정 ===== */}
      <div className="card shadow-none border mb-4">
        <div className="card-header border-bottom bg-base py-16 px-24">
          <h6 className="text-lg fw-semibold mb-0">
            <Icon icon="mdi:calendar-clock" className="me-2" />
            대회 운영 설정
          </h6>
        </div>
        <div className="card-body p-24">
          <div className="row g-3">
            {/* Contest Name */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">대회명</label>
              <input
                type="text"
                className="form-control"
                value={siteSettings.contest_name}
                onChange={(e) => handleSiteSettingChange("contest_name", e.target.value)}
              />
            </div>
            {/* Contest Location */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">대회 장소</label>
              <input
                type="text"
                className="form-control"
                value={siteSettings.contest_location}
                onChange={(e) => handleSiteSettingChange("contest_location", e.target.value)}
              />
            </div>
            {/* Deadline */}
            <div className="col-md-6">
              <label className="form-label fw-semibold">
                <Icon icon="mdi:clock-alert-outline" className="me-1 text-danger-600" />
                작품 접수 마감일 (KST)
              </label>
              <input
                type="datetime-local"
                className="form-control"
                value={deadlineToInput(siteSettings.contest_deadline)}
                onChange={(e) => handleSiteSettingChange("contest_deadline", inputToDeadline(e.target.value))}
              />
              <small className="text-muted d-block mt-1">
                현재 설정: {siteSettings.contest_deadline || "미설정"}
              </small>
            </div>
            {/* Max License Seats */}
            <div className="col-md-3">
              <label className="form-label fw-semibold">이용권 최대 승인 수</label>
              <input
                type="number"
                className="form-control"
                min={1}
                max={10000}
                value={siteSettings.max_license_seats}
                onChange={(e) => handleSiteSettingChange("max_license_seats", parseInt(e.target.value, 10) || 500)}
              />
            </div>
            {/* Submission Toggle */}
            <div className="col-md-3 d-flex align-items-end">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="submission-toggle"
                  checked={siteSettings.submission_enabled}
                  onChange={(e) => handleSiteSettingChange("submission_enabled", e.target.checked)}
                />
                <label className="form-check-label fw-semibold" htmlFor="submission-toggle">
                  작품 접수 {siteSettings.submission_enabled ? "활성" : "비활성"}
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== Section 2: 인증 제공자 설정 ===== */}
      <div className="card shadow-none border mb-4">
        <div className="card-header border-bottom bg-base py-16 px-24">
          <h6 className="text-lg fw-semibold mb-0">
            <Icon icon="mdi:shield-account" className="me-2" />
            인증 제공자 설정
          </h6>
        </div>
        <div className="card-body p-24">
          <p className="text-muted mb-16">이용권 신청 시 사용할 본인 인증 방법을 선택하세요.</p>
          {PROVIDER_INFO.map((p) => (
            <div key={p.key} className="d-flex align-items-center justify-content-between py-12 border-bottom">
              <div className="d-flex align-items-center gap-12">
                <div className="w-40-px h-40-px bg-primary-50 rounded-circle d-flex justify-content-center align-items-center">
                  <Icon icon={p.icon} className="text-primary-600 text-xl" />
                </div>
                <div>
                  <span className="fw-semibold d-block">{p.label}</span>
                  <span className="text-muted text-sm">{p.desc}</span>
                </div>
              </div>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={authProviders[p.key] ?? true}
                  onChange={() => handleProviderToggle(p.key)}
                  id={`auth-${p.key}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Section 3: 파일 업로드 설정 ===== */}
      <div className="card shadow-none border mb-4">
        <div className="card-header border-bottom bg-base py-16 px-24">
          <h6 className="text-lg fw-semibold mb-0">
            <Icon icon="mdi:cloud-upload" className="me-2" />
            파일 업로드 설정
          </h6>
        </div>
        <div className="card-body p-24">
          {fileSettings.length === 0 ? (
            <p className="text-muted">파일 업로드 설정이 없습니다. DB 마이그레이션(008c)을 실행하세요.</p>
          ) : (
            <div className="table-responsive">
              <table className="table bordered-table mb-0">
                <thead>
                  <tr>
                    <th>유형</th>
                    <th>최대 크기 (MB)</th>
                    <th>허용 확장자</th>
                    <th>활성화</th>
                  </tr>
                </thead>
                <tbody>
                  {fileSettings.map((fs) => (
                    <tr key={fs.upload_type}>
                      <td className="fw-medium">{fs.display_name || fs.upload_type}</td>
                      <td>
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={fs.max_file_size_mb}
                          min={1}
                          max={1000}
                          onChange={(e) => handleFileSettingChange(fs.upload_type, "max_file_size_mb", parseInt(e.target.value, 10) || 10)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={(fs.allowed_extensions || []).join(", ")}
                          onChange={(e) => handleFileSettingChange(
                            fs.upload_type,
                            "allowed_extensions",
                            e.target.value.split(",").map((s) => s.trim().toLowerCase()).filter(Boolean)
                          )}
                        />
                      </td>
                      <td>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={fs.is_active}
                            onChange={(e) => handleFileSettingChange(fs.upload_type, "is_active", e.target.checked)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ===== Section 4: 이메일 발송 설정 (Gmail) ===== */}
      <div className="card shadow-none border mb-4">
        <div className="card-header border-bottom bg-base py-16 px-24">
          <h6 className="text-lg fw-semibold mb-0">
            <Icon icon="mdi:email-fast" className="me-2" />
            이메일 발송 설정 (Gmail SMTP)
          </h6>
        </div>
        <div className="card-body p-24">
          <p className="text-muted mb-16">학교 이메일 OTP 인증, 접수 확인 등 이메일 발송에 사용될 Gmail 설정입니다.</p>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label fw-semibold">Gmail 계정</label>
              <input
                type="email"
                className="form-control"
                placeholder="example@gmail.com"
                value={emailSettings.gmail_user}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, gmail_user: e.target.value }))}
              />
              <small className="text-muted">이메일 발송에 사용할 Gmail 주소</small>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">앱 비밀번호</label>
              <input
                type="password"
                className="form-control"
                placeholder="xxxx xxxx xxxx xxxx"
                value={emailSettings.gmail_app_password}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, gmail_app_password: e.target.value }))}
              />
              <small className="text-muted">
                <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noopener noreferrer" className="text-primary-600">Google 앱 비밀번호 생성하기 →</a>
                {" "}(2단계 인증 필요)
              </small>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">발신자명</label>
              <input
                type="text"
                className="form-control"
                placeholder="교육 공공데이터 AI활용대회"
                value={emailSettings.email_sender_name}
                onChange={(e) => setEmailSettings(prev => ({ ...prev, email_sender_name: e.target.value }))}
              />
              <small className="text-muted">수신자에게 표시되는 발신자 이름</small>
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">테스트 이메일 발송</label>
              <div className="input-group">
                <input
                  type="email"
                  className="form-control"
                  placeholder="test@example.com"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                />
                <button
                  className="btn btn-outline-primary-600"
                  disabled={testingEmail || !testEmail.trim() || !emailSettings.gmail_user}
                  onClick={async () => {
                    setTestingEmail(true);
                    try {
                      // 먼저 설정 저장
                      await handleSave();
                      const res = await fetch("/api/admin/email-test", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ to: testEmail }),
                      });
                      const data = await res.json();
                      if (res.ok) {
                        setMessage({ type: "success", text: `테스트 이메일이 ${testEmail}로 발송되었습니다.` });
                      } else {
                        setMessage({ type: "danger", text: data.error || "테스트 발송 실패" });
                      }
                    } catch { setMessage({ type: "danger", text: "네트워크 오류" }); }
                    finally { setTestingEmail(false); }
                  }}
                >
                  {testingEmail ? (
                    <><span className="spinner-border spinner-border-sm me-1" />발송 중...</>
                  ) : (
                    <><Icon icon="mdi:send" className="me-1" />테스트 발송</>
                  )}
                </button>
              </div>
              <small className="text-muted">설정을 저장한 후 테스트 이메일을 보내 확인합니다.</small>
            </div>
          </div>
          {!emailSettings.gmail_user && (
            <div className="alert alert-warning mt-16 mb-0">
              <Icon icon="mdi:alert" className="me-1" />
              Gmail 설정이 완료되지 않으면 학교 이메일 OTP 인증이 작동하지 않습니다.
            </div>
          )}
        </div>
      </div>

      {/* ===== Section 5: 이메일 템플릿 에디터 ===== */}
      <div className="card shadow-none border mb-4">
        <div className="card-header border-bottom bg-base py-16 px-24">
          <h6 className="text-lg fw-semibold mb-0">
            <Icon icon="mdi:email-edit" className="me-2" />
            이메일 템플릿 편집
          </h6>
        </div>
        <div className="card-body p-24">
          <p className="text-muted mb-16">발송되는 이메일의 제목과 내용을 직접 편집할 수 있습니다. HTML 형식으로 작성하면 스타일이 적용됩니다.</p>

          {/* Tab selector */}
          <ul className="nav nav-pills mb-16">
            <li className="nav-item">
              <button
                className={`nav-link ${activeTemplateTab === "otp" ? "active" : ""}`}
                onClick={() => setActiveTemplateTab("otp")}
              >
                <Icon icon="mdi:email-check" className="me-1" /> OTP 인증 메일
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTemplateTab === "submission" ? "active" : ""}`}
                onClick={() => setActiveTemplateTab("submission")}
              >
                <Icon icon="mdi:file-check" className="me-1" /> 접수 확인 메일
              </button>
            </li>
          </ul>

          {/* Variable buttons */}
          <div className="mb-12">
            <span className="text-muted me-2 fw-medium">변수 삽입:</span>
            {activeTemplateTab === "otp" ? (
              <button
                className="btn btn-sm btn-outline-primary-600 me-1"
                onClick={() => {
                  setEmailTemplates(prev => ({
                    ...prev,
                    email_template_otp_body: prev.email_template_otp_body + "{{OTP_CODE}}"
                  }));
                }}
              >
                {"{{OTP_CODE}}"} — 인증번호
              </button>
            ) : (
              <>
                <button
                  className="btn btn-sm btn-outline-primary-600 me-1"
                  onClick={() => {
                    setEmailTemplates(prev => ({
                      ...prev,
                      email_template_submission_body: prev.email_template_submission_body + "{{SUBMISSION_NO}}"
                    }));
                  }}
                >
                  {"{{SUBMISSION_NO}}"} — 접수번호
                </button>
                <button
                  className="btn btn-sm btn-outline-primary-600"
                  onClick={() => {
                    setEmailTemplates(prev => ({
                      ...prev,
                      email_template_submission_body: prev.email_template_submission_body + "{{TITLE}}"
                    }));
                  }}
                >
                  {"{{TITLE}}"} — 작품제목
                </button>
              </>
            )}
          </div>

          {/* OTP Template */}
          {activeTemplateTab === "otp" && (
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label fw-semibold">메일 제목</label>
                <input
                  type="text"
                  className="form-control"
                  value={emailTemplates.email_template_otp_subject}
                  onChange={(e) => setEmailTemplates(prev => ({ ...prev, email_template_otp_subject: e.target.value }))}
                />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">메일 본문</label>
                <EmailEditor
                  value={emailTemplates.email_template_otp_body}
                  onChange={(val) => setEmailTemplates(prev => ({ ...prev, email_template_otp_body: val }))}
                  placeholder="OTP 인증 메일 내용을 작성하세요..."
                />
              </div>
            </div>
          )}

          {/* Submission Template */}
          {activeTemplateTab === "submission" && (
            <div className="row g-3">
              <div className="col-12">
                <label className="form-label fw-semibold">메일 제목</label>
                <input
                  type="text"
                  className="form-control"
                  value={emailTemplates.email_template_submission_subject}
                  onChange={(e) => setEmailTemplates(prev => ({ ...prev, email_template_submission_subject: e.target.value }))}
                />
              </div>
              <div className="col-12">
                <label className="form-label fw-semibold">메일 본문</label>
                <EmailEditor
                  value={emailTemplates.email_template_submission_body}
                  onChange={(val) => setEmailTemplates(prev => ({ ...prev, email_template_submission_body: val }))}
                  placeholder="접수 확인 메일 내용을 작성하세요..."
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
