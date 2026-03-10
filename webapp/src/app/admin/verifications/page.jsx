"use client";

import { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { formatKST } from "@/lib/dateUtils";

/**
 * Admin Student Direct Application Page — /admin/verifications
 * Students without school email can apply directly by uploading student ID.
 * Admin views the uploaded image/info and approves or rejects.
 * WowDash design — zero inline styles.
 */

const STATUS_LABELS = {
  pending: "대기 중",
  approved: "승인됨",
  rejected: "반려됨",
};

const STATUS_BADGE = {
  pending: "bg-warning-focus text-warning-600",
  approved: "bg-success-focus text-success-600",
  rejected: "bg-danger-focus text-danger-600",
};

export default function AdminVerificationsPage() {
  const [verifications, setVerifications] = useState([]);
  const [total, setTotal] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Detail / action
  const [selectedItem, setSelectedItem] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const limit = 20;

  const fetchVerifications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      params.set("page", page.toString());
      params.set("limit", limit.toString());

      const res = await fetch(`/api/admin/verifications?${params.toString()}`);
      if (!res.ok) throw new Error("Fetch failed");

      const data = await res.json();
      setVerifications(data.verifications || []);
      setTotal(data.total || 0);
      setPendingCount(data.pending_count || 0);
    } catch (err) {
      console.error("Fetch verifications error:", err);
      setMessage({ type: "danger", text: "데이터를 불러오는데 실패했습니다." });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page]);

  useEffect(() => { fetchVerifications(); }, [fetchVerifications]);

  const handleAction = async (id, action) => {
    setActionLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await fetch("/api/admin/verifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, admin_note: adminNote }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: data.message });
        setSelectedItem(null);
        setAdminNote("");
        fetchVerifications();
      } else {
        setMessage({ type: "danger", text: data.error || "처리 실패" });
      }
    } catch {
      setMessage({ type: "danger", text: "네트워크 오류" });
    } finally {
      setActionLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <>
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <h6 className="fw-semibold mb-0">이용권 학생 직접 신청</h6>
        {pendingCount > 0 && (
          <div className="card shadow-none border border-danger mb-0">
            <div className="card-body py-8 px-16 d-flex align-items-center gap-2">
              <span className="text-danger fw-medium">대기</span>
              <span className="fw-bold text-danger-600 fs-6">{pendingCount}건</span>
            </div>
          </div>
        )}
      </div>

      {/* Message */}
      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible mb-4`}>
          {message.text}
          <button className="btn-close" onClick={() => setMessage({ type: "", text: "" })} />
        </div>
      )}

      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        {[
          { label: "전체 요청", value: total, icon: "solar:document-text-outline", color: "primary" },
          { label: "대기 중", value: pendingCount, icon: "solar:clock-circle-outline", color: "warning" },
        ].map((card) => (
          <div key={card.label} className="col-md-3">
            <div className="card shadow-none border h-100">
              <div className="card-body p-20 d-flex align-items-center gap-12">
                <div className={`w-48-px h-48-px bg-${card.color}-50 rounded-circle d-flex justify-content-center align-items-center`}>
                  <Icon icon={card.icon} className={`text-${card.color}-600 text-2xl`} />
                </div>
                <div>
                  <span className="text-muted text-sm d-block">{card.label}</span>
                  <span className="fw-bold text-lg">{card.value}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="card shadow-none border mb-4">
        <div className="card-body p-20">
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <label className="form-label">상태 필터</label>
              <select
                className="form-select form-select-sm"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              >
                <option value="">전체</option>
                <option value="pending">대기 중</option>
                <option value="approved">승인됨</option>
                <option value="rejected">반려됨</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card shadow-none border">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover bordered-table mb-0">
              <thead>
                <tr>
                  <th>이메일</th>
                  <th>학교명</th>
                  <th>상태</th>
                  <th>학생증</th>
                  <th>관리자 메모</th>
                  <th>요청일</th>
                  <th>액션</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4">
                      <div className="spinner-border spinner-border-sm text-primary" />
                    </td>
                  </tr>
                ) : verifications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-muted">
                      학생 직접 신청 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  verifications.map((v) => (
                    <tr key={v.id}>
                      <td className="fw-medium">{v.email}</td>
                      <td>{v.school_name || "-"}</td>
                      <td>
                        <span className={`badge ${STATUS_BADGE[v.status] || ""}`}>
                          {STATUS_LABELS[v.status] || v.status}
                        </span>
                      </td>
                      <td>
                        {v.file_url ? (
                          <a href={v.file_url} target="_blank" rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-primary-600">
                            <Icon icon="solar:eye-outline" className="me-1" />
                            보기
                          </a>
                        ) : (
                          <span className="text-muted">없음</span>
                        )}
                      </td>
                      <td className="text-muted text-sm">{v.admin_note || "-"}</td>
                      <td className="text-muted text-sm">
                        {v.created_at ? formatKST(v.created_at, "yyyy-MM-dd HH:mm") : "-"}
                      </td>
                      <td>
                        {v.status === "pending" ? (
                          <button
                            className="btn btn-sm btn-primary-600"
                            onClick={() => { setSelectedItem(v); setAdminNote(""); }}
                          >
                            심사
                          </button>
                        ) : (
                          <span className="text-muted text-sm">처리됨</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="card-footer d-flex justify-content-between align-items-center">
            <span className="text-muted">
              총 {total}건 중 {(page - 1) * limit + 1}-{Math.min(page * limit, total)}건
            </span>
            <nav>
              <ul className="pagination mb-0">
                <li className={`page-item ${page <= 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setPage(page - 1)}>이전</button>
                </li>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                  <li key={i + 1} className={`page-item ${page === i + 1 ? "active" : ""}`}>
                    <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
                  </li>
                ))}
                <li className={`page-item ${page >= totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setPage(page + 1)}>다음</button>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {selectedItem && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">학생 직접 신청 심사</h5>
                <button className="btn-close" onClick={() => setSelectedItem(null)} />
              </div>
              <div className="modal-body">
                {/* Student Info */}
                <div className="card mb-3">
                  <div className="card-body">
                    <div className="row g-2">
                      <div className="col-md-6">
                        <strong>이메일:</strong> {selectedItem.email}
                      </div>
                      <div className="col-md-6">
                        <strong>학교명:</strong> {selectedItem.school_name || "미입력"}
                      </div>
                      <div className="col-12">
                        <strong>요청일:</strong>{" "}
                        {selectedItem.created_at ? formatKST(selectedItem.created_at, "yyyy-MM-dd HH:mm:ss") : "-"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Student ID Image */}
                <div className="card mb-3">
                  <div className="card-header">
                    <h6 className="mb-0">업로드된 학생증</h6>
                  </div>
                  <div className="card-body text-center">
                    {selectedItem.file_url ? (
                      selectedItem.student_id_file_path?.endsWith(".pdf") ? (
                        <a href={selectedItem.file_url} target="_blank" rel="noopener noreferrer"
                          className="btn btn-outline-primary-600">
                          <Icon icon="solar:document-text-outline" className="me-1" />
                          PDF 파일 열기
                        </a>
                      ) : (
                        <img
                          src={selectedItem.file_url}
                          alt="학생증"
                          className="img-fluid rounded border"
                        />
                      )
                    ) : (
                      <p className="text-muted">파일을 불러올 수 없습니다.</p>
                    )}
                  </div>
                </div>

                {/* Admin Note */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">관리자 메모 (선택)</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    placeholder="승인/반려 사유를 입력하세요 (학생에게 표시되지 않음)"
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-success-600"
                  disabled={actionLoading}
                  onClick={() => handleAction(selectedItem.id, "approve")}
                >
                  <Icon icon="solar:check-circle-outline" className="me-1" />
                  {actionLoading ? "처리 중..." : "승인"}
                </button>
                <button
                  className="btn btn-danger-600"
                  disabled={actionLoading}
                  onClick={() => handleAction(selectedItem.id, "reject")}
                >
                  <Icon icon="solar:close-circle-outline" className="me-1" />
                  반려
                </button>
                <button className="btn btn-secondary" onClick={() => setSelectedItem(null)}>닫기</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal backdrop */}
      {selectedItem && <div className="modal-backdrop fade show" onClick={() => setSelectedItem(null)} />}
    </>
  );
}
