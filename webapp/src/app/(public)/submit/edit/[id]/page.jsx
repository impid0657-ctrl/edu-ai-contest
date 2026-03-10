"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { CONTEST_CATEGORIES } from "@/lib/constants";

/**
 * Submission Edit Page — /submit/edit/[id]
 * Phase 2: Evalo design system applied.
 * JWT-only auth (from sessionStorage). Deadline enforced by API.
 */

const ALLOWED_EXTENSIONS = [
  ".pdf", ".zip", ".hwp", ".hwpx", ".pptx", ".ppt",
  ".docx", ".doc", ".xlsx", ".xls",
  ".png", ".jpg", ".jpeg", ".mp4", ".avi", ".mov",
];

export default function SubmissionEditPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deadlinePassed, setDeadlinePassed] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [formData, setFormData] = useState({ title: "", description: "", category: "", team_name: "", contact_phone: "" });
  const [existingFiles, setExistingFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  useEffect(() => {
    async function init() {
      try {
        const storedToken = sessionStorage.getItem("submission_token") || "";
        setToken(storedToken);
        if (!storedToken) { setError("접수 내역 조회를 먼저 진행해주세요."); setLoading(false); return; }

        const res = await fetch(`/api/submission/${id}`, { headers: { Authorization: `Bearer ${storedToken}` } });
        if (res.status === 403) { setDeadlinePassed(true); setLoading(false); return; }
        if (!res.ok) { setError("작품 정보를 불러올 수 없습니다."); setLoading(false); return; }

        const { submission } = await res.json();
        setFormData({
          title: submission.title || "", description: submission.description || "",
          category: submission.category || "", team_name: submission.team_name || "",
          contact_phone: submission.contact_phone || "",
        });
        setExistingFiles(submission.submission_files || []);
      } catch { setError("네트워크 오류가 발생했습니다."); }
      finally { setLoading(false); }
    }
    init();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => setNewFiles(Array.from(e.target.files || []));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setSaving(true);
    try {
      let uploadedFiles = [];
      for (const file of newFiles) {
        const fd = new FormData();
        fd.append("file", file);
        const uploadRes = await fetch("/api/guest/upload", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd });
        if (!uploadRes.ok) { setError((await uploadRes.json()).error || "파일 업로드 실패"); setSaving(false); return; }
        uploadedFiles.push((await uploadRes.json()).file);
      }

      const patchRes = await fetch(`/api/submission/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...formData, files: uploadedFiles.length > 0 ? uploadedFiles : undefined }),
      });
      if (!patchRes.ok) { setError((await patchRes.json()).error || "수정에 실패했습니다."); setSaving(false); return; }
      setSaved(true);
    } catch { setError("네트워크 오류가 발생했습니다."); }
    finally { setSaving(false); }
  };

  // Status screens
  if (loading) {
    return (
      <section className="evalo-section text-center">
        <div className="container py-5">
          <div className="spinner-border" role="status" aria-label="Loading" />
        </div>
      </section>
    );
  }

  if (deadlinePassed) {
    return (
      <>
        <div className="evalo-page-banner"><div className="container"><h1 className="evalo-page-banner__title">마감 안내</h1></div></div>
        <section className="evalo-section text-center">
          <div className="container">
            <div className="display-1 mb-4">⏰</div>
            <h2 className="mb-3">마감되어 수정할 수 없습니다</h2>
            <p className="text-muted mb-4">접수 마감일이 지나 작품을 수정할 수 없습니다.</p>
            <Link href="/submit/lookup" className="evalo-btn">접수 내역 조회로 돌아가기</Link>
          </div>
        </section>
      </>
    );
  }

  if (saved) {
    return (
      <>
        <div className="evalo-page-banner"><div className="container"><h1 className="evalo-page-banner__title">수정 완료</h1></div></div>
        <section className="evalo-section text-center">
          <div className="container">
            <div className="display-1 mb-4">✅</div>
            <h2 className="mb-3">수정이 완료되었습니다</h2>
            <div className="d-flex gap-3 justify-content-center mt-4">
              <Link href="/submit/lookup" className="evalo-btn">접수 내역 조회</Link>
              <Link href="/" className="evalo-btn evalo-btn--outline">홈으로 돌아가기</Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* Page Banner */}
      <div className="evalo-page-banner">
        <div className="container">
          <h1 className="evalo-page-banner__title">작품 수정</h1>
          <ul className="evalo-page-banner__breadcrumb">
            <li><Link href="/">홈</Link></li>
            <li>/</li>
            <li><Link href="/submit/lookup">접수 조회</Link></li>
            <li>/</li>
            <li className="active">수정</li>
          </ul>
        </div>
      </div>

      <section className="evalo-section">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="evalo-title">
                <span className="evalo-title__label">수정</span>
                <h3 className="evalo-title__heading">작품 정보 수정</h3>
                <p className="evalo-title__desc">마감 전까지 작품 정보를 수정할 수 있습니다.</p>
              </div>

              <div className="evalo-card evalo-card--static evalo-card--lg">
                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleSubmit} className="evalo-form">
                  <div className="mb-3">
                    <label htmlFor="title" className="form-label">작품 제목 <span className="text-danger">*</span></label>
                    <input type="text" id="title" name="title" className="form-control" value={formData.title} onChange={handleChange} required />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">작품 설명</label>
                    <textarea id="description" name="description" className="form-control" rows={4} maxLength={1000}
                      value={formData.description} onChange={handleChange} />
                    <div className="form-text text-end">{formData.description.length}/1000</div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="category" className="form-label">참가 부문 <span className="text-danger">*</span></label>
                      <select id="category" name="category" className="form-select" value={formData.category} onChange={handleChange} required>
                        <option value="">부문을 선택해주세요</option>
                        {CONTEST_CATEGORIES.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="team_name" className="form-label">팀명</label>
                      <input type="text" id="team_name" name="team_name" className="form-control" value={formData.team_name} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="contact_phone" className="form-label">연락처</label>
                    <input type="tel" id="contact_phone" name="contact_phone" className="form-control" value={formData.contact_phone} onChange={handleChange} />
                  </div>

                  {/* Existing Files */}
                  {existingFiles.length > 0 && (
                    <div className="mb-3">
                      <label className="form-label">기존 첨부 파일</label>
                      {existingFiles.map((f) => (
                        <div key={f.id} className="d-flex justify-content-between align-items-center p-2 mb-1 rounded" style={{background: "var(--evalo-bg-light)"}}>
                          <span className="fw-medium">{f.file_name}</span>
                          <span className="evalo-badge evalo-badge--primary">{f.file_size ? `${(f.file_size / 1024 / 1024).toFixed(1)}MB` : "-"}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mb-4">
                    <label htmlFor="newFiles" className="form-label">추가 파일 첨부</label>
                    <input type="file" id="newFiles" className="form-control" multiple accept={ALLOWED_EXTENSIONS.join(",")} onChange={handleFileChange} />
                    <div className="form-text">새로운 파일을 추가할 수 있습니다.</div>
                  </div>

                  <button type="submit" className="evalo-btn evalo-btn--lg w-100" disabled={saving}>
                    {saving ? "저장 중..." : "수정 완료"}
                  </button>
                </form>
              </div>

              <div className="text-center mt-4">
                <Link href="/submit/lookup" className="text-muted text-decoration-none">← 접수 내역 조회로 돌아가기</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
