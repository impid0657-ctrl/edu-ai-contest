"use client";

import { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { formatKST } from "@/lib/dateUtils";

/**
 * Admin Submissions Management Page — Sprint 6.5 rebuild
 * - Table with filters (status, category, search)
 * - Detail modal with info, files, AI review, status change
 * - AI review trigger button
 * All styles via WowDash/Bootstrap classes.
 */

const CATEGORY_LABELS = { elementary: "초등부", secondary: "중·고등부", general: "일반부" };
const STATUS_LABELS = { submitted: "접수됨", under_review: "심사 중", accepted: "수상작", rejected: "탈락" };
const STATUS_BADGE = {
  submitted: "bg-primary-focus text-primary-600",
  under_review: "bg-warning-focus text-warning-600",
  accepted: "bg-success-focus text-success-600",
  rejected: "bg-danger-focus text-danger-600",
};
const AI_STATUS_LABELS = { pending: "대기", queued: "대기열", processing: "처리 중", completed: "완료", failed: "실패" };
const AI_STATUS_BADGE = { pending: "text-muted", queued: "text-info", processing: "text-warning", completed: "text-success", failed: "text-danger" };

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  // AI review trigger
  const [triggering, setTriggering] = useState(false);
  const [triggerResult, setTriggerResult] = useState("");

  // Detail modal
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (categoryFilter) params.set("category", categoryFilter);
      if (searchText) params.set("search", searchText);
      params.set("page", page.toString());
      params.set("limit", limit.toString());
      const res = await fetch(`/api/admin/submissions?${params.toString()}`);
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setSubmissions(data.submissions || []);
      setTotal(data.total || 0);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [statusFilter, categoryFilter, searchText, page]);

  useEffect(() => { fetchSubmissions(); }, [fetchSubmissions]);

  const handleAIReviewTrigger = async () => {
    setTriggering(true); setTriggerResult("");
    try {
      const res = await fetch("/api/admin/ai-review/trigger", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
      const data = await res.json();
      setTriggerResult(data.message || `${data.queued}건 처리`);
      fetchSubmissions();
    } catch { setTriggerResult("오류 발생"); }
    finally { setTriggering(false); }
  };

  const openDetail = async (id) => {
    setDetailLoading(true); setDetail(null); setStatusMsg("");
    try {
      const res = await fetch(`/api/admin/submissions/${id}`);
      if (res.ok) {
        const data = await res.json();
        setDetail(data);
        setNewStatus(data.status);
      }
    } catch (err) { console.error(err); }
    finally { setDetailLoading(false); }
  };

  const handleStatusChange = async () => {
    if (!detail || !newStatus) return;
    try {
      const res = await fetch(`/api/admin/submissions/${detail.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setStatusMsg("상태가 변경되었습니다.");
        setDetail((prev) => ({ ...prev, status: newStatus }));
        fetchSubmissions();
      } else { setStatusMsg("변경 실패"); }
    } catch { setStatusMsg("오류 발생"); }
  };

  const handleFileDownload = async (fileId, fileName) => {
    try {
      const res = await fetch(`/api/admin/submissions/${detail.id}/files/${fileId}`);
      if (res.ok) {
        const data = await res.json();
        window.open(data.url, "_blank");
      } else alert("파일 다운로드 실패");
    } catch { alert("오류 발생"); }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <h6 className="fw-semibold mb-0">작품 관리</h6>
        <div className="d-flex align-items-center gap-3">
          <button className="btn btn-sm btn-outline-warning" onClick={handleAIReviewTrigger} disabled={triggering}>
            {triggering ? "처리 중..." : "🤖 AI 심사 일괄 실행"}
          </button>
          <div className="card shadow-none border mb-0">
            <div className="card-body py-8 px-16 d-flex align-items-center gap-2">
              <span className="text-muted fw-medium">총</span>
              <span className="fw-bold text-primary-600 fs-6">{total}건</span>
            </div>
          </div>
        </div>
      </div>

      {triggerResult && <div className="alert alert-info mb-3">{triggerResult}</div>}

      {/* Filters */}
      <div className="card shadow-none border mb-4">
        <div className="card-body p-20">
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <label className="form-label">상태</label>
              <select className="form-select form-select-sm" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
                <option value="">전체</option>
                <option value="submitted">접수됨</option>
                <option value="under_review">심사 중</option>
                <option value="accepted">수상작</option>
                <option value="rejected">탈락</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">부문</label>
              <select className="form-select form-select-sm" value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}>
                <option value="">전체</option>
                <option value="elementary">초등부</option>
                <option value="secondary">중·고등부</option>
                <option value="general">일반부</option>
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">검색 (제목/접수번호)</label>
              <input type="text" className="form-control form-control-sm" placeholder="검색어 입력" value={searchText} onChange={(e) => { setSearchText(e.target.value); setPage(1); }} />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card shadow-none border">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table bordered-table mb-0">
              <thead>
                <tr>
                  <th>접수번호</th><th>제목</th><th>부문</th><th>팀명</th><th>이메일</th><th>상태</th><th>AI 심사</th><th>파일</th><th>접수일</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={9} className="text-center py-4"><div className="spinner-border spinner-border-sm text-primary" /></td></tr>
                ) : submissions.length === 0 ? (
                  <tr><td colSpan={9} className="text-center py-4 text-muted">접수된 작품이 없습니다.</td></tr>
                ) : submissions.map((s) => (
                  <tr key={s.id} style={{ cursor: "pointer" }} onClick={() => openDetail(s.id)}>
                    <td className="fw-medium text-primary">{s.submission_no}</td>
                    <td>{s.title}</td>
                    <td><span className="badge bg-primary-50 text-primary-600">{CATEGORY_LABELS[s.category] || s.category}</span></td>
                    <td>{s.team_name || "-"}</td>
                    <td>{s.contact_email}</td>
                    <td><span className={`badge ${STATUS_BADGE[s.status] || ""}`}>{STATUS_LABELS[s.status] || s.status}</span></td>
                    <td><span className={`small ${AI_STATUS_BADGE[s.ai_review_status] || ""}`}>{AI_STATUS_LABELS[s.ai_review_status] || s.ai_review_status}</span></td>
                    <td><span className="badge bg-light text-dark">{s.file_count || 0}개</span></td>
                    <td className="text-muted">{s.created_at ? formatKST(s.created_at, "yyyy-MM-dd") : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="card-footer d-flex justify-content-between align-items-center">
            <span className="text-muted">총 {total}건 중 {(page - 1) * limit + 1}-{Math.min(page * limit, total)}건</span>
            <nav>
              <ul className="pagination mb-0">
                <li className={`page-item ${page <= 1 ? "disabled" : ""}`}><button className="page-link" onClick={() => setPage(page - 1)}>이전</button></li>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const p = i + 1;
                  return <li key={p} className={`page-item ${page === p ? "active" : ""}`}><button className="page-link" onClick={() => setPage(p)}>{p}</button></li>;
                })}
                <li className={`page-item ${page >= totalPages ? "disabled" : ""}`}><button className="page-link" onClick={() => setPage(page + 1)}>다음</button></li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {(detail || detailLoading) && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{detailLoading ? "로딩 중..." : `접수번호: ${detail?.submission_no}`}</h5>
                <button className="btn-close" onClick={() => setDetail(null)} />
              </div>
              {detail && (
                <div className="modal-body">
                  {/* Info */}
                  <div className="card mb-3">
                    <div className="card-header"><h6 className="mb-0">접수 정보</h6></div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-md-6"><strong>작품명:</strong> {detail.title}</div>
                        <div className="col-md-6"><strong>부문:</strong> {CATEGORY_LABELS[detail.category] || detail.category}</div>
                        <div className="col-md-6"><strong>팀명:</strong> {detail.team_name || "-"}</div>
                        <div className="col-md-6"><strong>대표자:</strong> {detail.contact_name || "-"}</div>
                        <div className="col-md-6"><strong>이메일:</strong> {detail.contact_email || "-"}</div>
                        <div className="col-md-6"><strong>전화:</strong> {detail.contact_phone || "-"}</div>
                        <div className="col-12"><strong>설명:</strong><p className="mt-1 text-muted">{detail.description || "(없음)"}</p></div>
                        <div className="col-md-6"><strong>접수일:</strong> {formatKST(detail.created_at, "yyyy-MM-dd HH:mm")}</div>
                      </div>
                    </div>
                  </div>

                  {/* Files */}
                  <div className="card mb-3">
                    <div className="card-header"><h6 className="mb-0">제출 파일 ({detail.submission_files?.length || 0}개)</h6></div>
                    <div className="card-body">
                      {(!detail.submission_files || detail.submission_files.length === 0) ? (
                        <p className="text-muted">제출된 파일이 없습니다.</p>
                      ) : (
                        <ul className="list-group">
                          {detail.submission_files.map((f) => (
                            <li key={f.id} className="list-group-item d-flex justify-content-between align-items-center">
                              <div>
                                <Icon icon="mdi:file-document-outline" className="me-2" />
                                {f.file_name}
                                <small className="text-muted ms-2">({(f.file_size / 1024 / 1024).toFixed(1)}MB)</small>
                              </div>
                              <button className="btn btn-sm btn-outline-primary" onClick={() => handleFileDownload(f.id, f.file_name)}>
                                <Icon icon="mdi:download" className="me-1" />다운로드
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* AI Review */}
                  {detail.ai_review && (
                    <div className="card mb-3">
                      <div className="card-header"><h6 className="mb-0">AI 심사 결과</h6></div>
                      <div className="card-body">
                        {detail.ai_review.status === "completed" ? (
                          <>
                            <div className="d-flex align-items-center gap-3 mb-3">
                              <div className="text-center">
                                <div className="fw-bold fs-2 text-primary-600">{detail.ai_review.ai_score || "-"}</div>
                                <small className="text-muted">총점</small>
                              </div>
                              {detail.ai_review.ai_feedback?.recommendation && (
                                <span className={`badge fs-6 ${
                                  detail.ai_review.ai_feedback.recommendation === "pass" ? "bg-success-600" :
                                  detail.ai_review.ai_feedback.recommendation === "reject" ? "bg-danger-600" : "bg-warning-600"
                                }`}>
                                  {detail.ai_review.ai_feedback.recommendation === "pass" ? "통과" :
                                   detail.ai_review.ai_feedback.recommendation === "reject" ? "탈락 권고" : "재검토 필요"}
                                </span>
                              )}
                            </div>
                            {detail.ai_review.ai_feedback?.summary && (
                              <p className="fw-medium mb-2">{detail.ai_review.ai_feedback.summary}</p>
                            )}
                            {detail.ai_review.ai_feedback?.creativity_score !== undefined && (
                              <div className="row g-2 mb-3">
                                <div className="col-3"><small className="text-muted">창의성</small><div className="fw-bold">{detail.ai_review.ai_feedback.creativity_score}/30</div></div>
                                <div className="col-3"><small className="text-muted">기술성</small><div className="fw-bold">{detail.ai_review.ai_feedback.technical_score}/30</div></div>
                                <div className="col-3"><small className="text-muted">활용성</small><div className="fw-bold">{detail.ai_review.ai_feedback.utility_score}/30</div></div>
                                <div className="col-3"><small className="text-muted">완성도</small><div className="fw-bold">{detail.ai_review.ai_feedback.completeness_score}/10</div></div>
                              </div>
                            )}
                            {detail.ai_review.ai_feedback?.strengths?.length > 0 && (
                              <div className="mb-2"><strong>강점:</strong> {detail.ai_review.ai_feedback.strengths.join(", ")}</div>
                            )}
                            {detail.ai_review.ai_feedback?.improvements?.length > 0 && (
                              <div><strong>개선사항:</strong> {detail.ai_review.ai_feedback.improvements.join(", ")}</div>
                            )}
                            <details className="mt-3"><summary className="text-muted small">원본 JSON 보기</summary><pre className="bg-light p-3 rounded mt-1 small">{JSON.stringify(detail.ai_review.ai_feedback, null, 2)}</pre></details>
                          </>
                        ) : detail.ai_review.status === "processing" ? (
                          <div className="text-center"><div className="spinner-border text-warning" /><p className="mt-2">AI 분석 진행 중...</p></div>
                        ) : detail.ai_review.status === "failed" ? (
                          <div className="alert alert-danger">{detail.ai_review.error_message || "AI 심사 실패"}</div>
                        ) : (
                          <p className="text-muted">상태: {AI_STATUS_LABELS[detail.ai_review.status] || detail.ai_review.status}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Status Change */}
                  <div className="card">
                    <div className="card-header"><h6 className="mb-0">상태 변경</h6></div>
                    <div className="card-body">
                      <div className="d-flex align-items-center gap-3">
                        <select className="form-select form-select-sm w-auto" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                          <option value="submitted">접수됨</option>
                          <option value="under_review">심사 중</option>
                          <option value="accepted">수상작</option>
                          <option value="rejected">탈락</option>
                        </select>
                        <button className="btn btn-sm btn-primary-600" onClick={handleStatusChange}>저장</button>
                        {statusMsg && <span className="text-success small">{statusMsg}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setDetail(null)}>닫기</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
