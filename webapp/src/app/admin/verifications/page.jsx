"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { formatKST } from "@/lib/dateUtils";

/**
 * Admin Student Direct Application Page — /admin/verifications
 * Shows license_applications where auth_method = 'student_direct'
 * Same column structure as /admin/license, but with additional
 * student verification review actions (approve/reject student ID).
 */

const CATEGORY_LABELS = {
  elementary: "초등부",
  secondary: "중·고등부",
  general: "일반부",
};

const STATUS_LABELS = {
  pending: "대기 중",
  approved: "승인됨",
  rejected: "반려됨",
};

const STATUS_BADGE_CLASS = {
  pending: "bg-warning-focus text-warning-600",
  approved: "bg-success-focus text-success-600",
  rejected: "bg-danger-focus text-danger-600",
};

const AUTH_METHOD_LABELS = {
  kakao: "카카오",
  naver: "네이버",
  school_email: "학교이메일",
  student_direct: "학생직접신청",
};

const AUTH_METHOD_BADGE = {
  kakao: "bg-warning-focus text-warning-600",
  naver: "bg-success-focus text-success-600",
  school_email: "bg-info-focus text-info-600",
  student_direct: "bg-primary-focus text-primary-600",
};

const VERIFICATION_STATUS_ICON = {
  pending: { icon: "solar:clock-circle-bold", color: "#f59e0b", label: "심사중" },
  approved: { icon: "solar:check-circle-bold", color: "#22c55e", label: "승인" },
  rejected: { icon: "solar:close-circle-bold", color: "#ef4444", label: "반려" },
};

const PAGE_SIZE_OPTIONS = [10, 30, 50, 100];

// ── Column definitions (이용권 관리와 동일) ──
const COLUMN_DEFS = [
  { key: "name", label: "이름", default: true },
  { key: "email", label: "이메일", default: true },
  { key: "category", label: "부문", default: true },
  { key: "school_name", label: "학교", default: true },
  { key: "status", label: "이용권 상태", default: true },
  { key: "verification_status", label: "학생증 심사", default: true },
  { key: "created_at", label: "신청일", default: true },
  // 확장 필드 (기본 OFF)
  { key: "birth_year", label: "출생연도", default: false },
  { key: "representative_name", label: "대표자명", default: false },
  { key: "team_name", label: "팀명", default: false },
  { key: "member_count", label: "팀원 수", default: false },
  { key: "member1_name", label: "팀원1", default: false },
  { key: "member2_name", label: "팀원2", default: false },
  { key: "phone", label: "연락처", default: false },
  { key: "topic", label: "주제", default: false },
  { key: "region", label: "지역", default: false },
  { key: "privacy_agreed", label: "개인정보 동의", default: false },
  { key: "third_party_agreed", label: "제3자 동의", default: false },
];

const LS_KEY = "admin_verifications_columns";

function getDefaultColumns() {
  return COLUMN_DEFS.filter((c) => c.default).map((c) => c.key);
}

function loadColumns() {
  try {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch { /* ignore */ }
  return getDefaultColumns();
}

// ── Cell renderer ──
function renderCell(app, colKey) {
  switch (colKey) {
    case "name":
      return app.users?.name || app.applicant_name || "-";
    case "email":
      return app.users?.email || app.applicant_email || "-";
    case "category":
      return (
        <span className="badge bg-primary-50 text-primary-600">
          {CATEGORY_LABELS[app.category] || app.category}
        </span>
      );
    case "school_name":
      return app.school_name || "-";
    case "status":
      return (
        <span className={`badge ${STATUS_BADGE_CLASS[app.status] || ""}`}>
          {STATUS_LABELS[app.status] || app.status}
        </span>
      );
    case "verification_status": {
      const vs = app.verification_status;
      const vi = VERIFICATION_STATUS_ICON[vs];
      if (!vi) return <span className="text-muted">-</span>;
      return (
        <span className="d-inline-flex align-items-center gap-1" title={vi.label}>
          <Icon icon={vi.icon} style={{ color: vi.color, fontSize: "18px" }} />
          <span className="text-sm">{vi.label}</span>
        </span>
      );
    }
    case "created_at":
      return app.created_at ? formatKST(app.created_at, "yyyy-MM-dd") : "-";
    case "birth_year":
      return app.birth_year || "-";
    case "representative_name":
      return app.representative_name || "-";
    case "team_name":
      return app.team_name || "-";
    case "member_count":
      return app.member_count ?? "-";
    case "member1_name":
      return app.member1_name || "-";
    case "member2_name":
      return app.member2_name || "-";
    case "phone":
      return app.phone || "-";
    case "topic":
      return app.topic || "-";
    case "region":
      return app.region || "-";
    case "privacy_agreed":
      return app.privacy_agreed_at ? (
        <span className="badge bg-success-focus text-success-600">동의</span>
      ) : (
        <span className="text-muted">-</span>
      );
    case "third_party_agreed":
      return app.third_party_agreed_at ? (
        <span className="badge bg-success-focus text-success-600">동의</span>
      ) : (
        <span className="text-muted">-</span>
      );
    default:
      return "-";
  }
}

// ── Column selector dropdown ──
function ColumnSelector({ visibleColumns, setVisibleColumns }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const toggle = (key) => {
    setVisibleColumns((prev) => {
      const next = prev.includes(key)
        ? prev.filter((k) => k !== key)
        : [...prev, key];
      localStorage.setItem(LS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const resetToDefault = () => {
    const defaults = getDefaultColumns();
    setVisibleColumns(defaults);
    localStorage.setItem(LS_KEY, JSON.stringify(defaults));
  };

  const selectAll = () => {
    const all = COLUMN_DEFS.map((c) => c.key);
    setVisibleColumns(all);
    localStorage.setItem(LS_KEY, JSON.stringify(all));
  };

  return (
    <div className="position-relative" ref={ref}>
      <button
        className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1"
        onClick={() => setOpen(!open)}
      >
        <Icon icon="solar:settings-minimalistic-outline" />
        컬럼 설정
      </button>
      {open && (
        <div
          className="position-absolute end-0 mt-1 bg-white border rounded shadow-lg p-16"
          style={{ zIndex: 1050, minWidth: "240px", maxHeight: "420px", overflowY: "auto" }}
        >
          <div className="d-flex justify-content-between align-items-center mb-12">
            <span className="fw-semibold text-sm">표시할 컬럼 선택</span>
            <div className="d-flex gap-1">
              <button className="btn btn-sm btn-outline-primary py-2 px-8" onClick={selectAll} style={{ fontSize: "11px" }}>전체</button>
              <button className="btn btn-sm btn-outline-secondary py-2 px-8" onClick={resetToDefault} style={{ fontSize: "11px" }}>초기화</button>
            </div>
          </div>
          {COLUMN_DEFS.map((col) => (
            <label
              key={col.key}
              className="d-flex align-items-center gap-8 py-4 px-4 rounded"
              style={{ cursor: "pointer" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f4ff")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <input
                type="checkbox"
                className="form-check-input m-0"
                checked={visibleColumns.includes(col.key)}
                onChange={() => toggle(col.key)}
              />
              <span className="text-sm">{col.label}</span>
              {col.default && (
                <span className="badge bg-light text-muted" style={{ fontSize: "10px", marginLeft: "auto" }}>기본</span>
              )}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════
// Main page
// ════════════════════════════════════════════
export default function AdminVerificationsPage() {
  const [applications, setApplications] = useState([]);
  const [total, setTotal] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState(getDefaultColumns);

  // Review modal
  const [selectedItem, setSelectedItem] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    setVisibleColumns(loadColumns());
  }, []);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("auth_method", "student_direct");
      if (statusFilter) params.set("status", statusFilter);
      params.set("page", page.toString());
      params.set("limit", limit.toString());

      const res = await fetch(`/api/admin/license?${params.toString()}`);
      if (!res.ok) throw new Error("Fetch failed");

      const data = await res.json();
      setApplications(data.applications || []);
      setTotal(data.total || 0);
      setPendingCount(data.pending_count || 0);
    } catch (err) {
      console.error("Fetch verifications error:", err);
      setMessage({ type: "danger", text: "데이터를 불러오는데 실패했습니다." });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, page, limit]);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  // 학생증 인증 심사 (student_verifications + license_applications 상태 동기화)
  const handleVerificationAction = async (app, action) => {
    setActionLoading(true);
    setMessage({ type: "", text: "" });
    try {
      if (app.student_verification_id) {
        // 학생증 인증 레코드가 있으면 verifications API
        const res = await fetch("/api/admin/verifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: app.student_verification_id, action, admin_note: adminNote }),
        });
        const data = await res.json();
        if (res.ok) {
          setMessage({ type: "success", text: data.message });
        } else {
          setMessage({ type: "danger", text: data.error || "처리 실패" });
          setActionLoading(false); return;
        }
      } else {
        // 학생증 없이 은 student_direct 신청 — 직접 license 상태 변경
        const newStatus = action === "approve" ? "approved" : "rejected";
        const res = await fetch("/api/admin/license", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: [app.id], status: newStatus }),
        });
        const data = await res.json();
        if (res.ok) {
          setMessage({ type: "success", text: `이용권 ${action === "approve" ? "승인" : "반려"} 완료` });
        } else {
          setMessage({ type: "danger", text: data.error || "처리 실패" });
          setActionLoading(false); return;
        }
      }
      setSelectedItem(null);
      setAdminNote("");
      fetchApplications();
    } catch {
      setMessage({ type: "danger", text: "네트워크 오류" });
    } finally {
      setActionLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);
  const activeColumns = COLUMN_DEFS.filter((c) => visibleColumns.includes(c.key));
  const totalColSpan = activeColumns.length + 1; // +1 for action column

  return (
    <>
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <div className="d-flex align-items-center gap-3">
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
        <div className="d-flex gap-3">
          <div className="card shadow-none border mb-0">
            <div className="card-body py-8 px-16 d-flex align-items-center gap-2">
              <span className="text-muted fw-medium">전체</span>
              <span className="fw-bold text-primary-600">{total}건</span>
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible mb-4`}>
          {message.text}
          <button className="btn-close" onClick={() => setMessage({ type: "", text: "" })} />
        </div>
      )}

      {/* Filters + Column settings */}
      <div className="card shadow-none border mb-4">
        <div className="card-body p-20">
          <div className="d-flex justify-content-between align-items-end">
            <div className="row g-3 align-items-end" style={{ flex: 1 }}>
              <div className="col-md-3">
                <label className="form-label">이용권 상태</label>
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
            <ColumnSelector visibleColumns={visibleColumns} setVisibleColumns={setVisibleColumns} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card shadow-none border">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  {activeColumns.map((col) => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                  <th className="text-center">학생증 심사</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={totalColSpan} className="text-center py-4">
                      <div className="spinner-border spinner-border-sm text-primary" />
                    </td>
                  </tr>
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan={totalColSpan} className="text-center py-4 text-muted">
                      학생 직접 신청 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id}>
                      {activeColumns.map((col) => (
                        <td key={col.key}>{renderCell(app, col.key)}</td>
                      ))}
                      <td className="text-center">
                        {(app.status === "pending" || app.verification_status === "pending") ? (
                          <button
                            className="btn btn-sm btn-primary-600"
                            onClick={() => { setSelectedItem(app); setAdminNote(""); }}
                          >
                            심사
                          </button>
                        ) : app.status === "approved" || app.verification_status === "approved" ? (
                          <span className="badge bg-success-focus text-success-600">승인됨</span>
                        ) : app.status === "rejected" || app.verification_status === "rejected" ? (
                          <span className="badge bg-danger-focus text-danger-600">반려됨</span>
                        ) : (
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => { setSelectedItem(app); setAdminNote(""); }}
                          >
                            심사
                          </button>
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
        <div className="card-footer d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div className="d-flex align-items-center gap-2">
            <span className="text-muted">표시:</span>
            {PAGE_SIZE_OPTIONS.map(size => (
              <button
                key={size}
                className={`btn btn-sm ${limit === size ? "btn-primary-600" : "btn-outline-primary-600"}`}
                onClick={() => { setLimit(size); setPage(1); }}
              >
                {size}
              </button>
            ))}
            <span className="text-muted ms-2">
              총 {total}건 중 {total > 0 ? (page - 1) * limit + 1 : 0}-{Math.min(page * limit, total)}건
            </span>
          </div>
          {totalPages > 1 && (
            <nav>
              <ul className="pagination mb-0">
                <li className={`page-item ${page <= 1 ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setPage(page - 1)}>이전</button>
                </li>
                {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
                  const p = i + 1;
                  return (
                    <li key={p} className={`page-item ${page === p ? "active" : ""}`}>
                      <button className="page-link" onClick={() => setPage(p)}>{p}</button>
                    </li>
                  );
                })}
                <li className={`page-item ${page >= totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setPage(page + 1)}>다음</button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>

      {/* Review Modal */}
      {selectedItem && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">학생 직접 신청 심사</h5>
                <button className="btn-close" onClick={() => setSelectedItem(null)} />
              </div>
              <div className="modal-body">
                {/* Application Info */}
                <div className="card mb-3">
                  <div className="card-header"><h6 className="mb-0">신청 정보</h6></div>
                  <div className="card-body">
                    <div className="row g-3">
                      <div className="col-md-6"><strong>이름:</strong> {selectedItem.applicant_name || "-"}</div>
                      <div className="col-md-6"><strong>이메일:</strong> {selectedItem.applicant_email || "-"}</div>
                      <div className="col-md-6"><strong>학교명:</strong> {selectedItem.school_name || "-"}</div>
                      <div className="col-md-6"><strong>부문:</strong> {CATEGORY_LABELS[selectedItem.category] || selectedItem.category}</div>
                      <div className="col-md-6"><strong>출생연도:</strong> {selectedItem.birth_year || "-"}</div>
                      <div className="col-md-6"><strong>대표자명:</strong> {selectedItem.representative_name || "-"}</div>
                      <div className="col-md-6"><strong>팀명:</strong> {selectedItem.team_name || "-"}</div>
                      <div className="col-md-6"><strong>주제:</strong> {selectedItem.topic || "-"}</div>
                      <div className="col-md-6"><strong>지역:</strong> {selectedItem.region || "-"}</div>
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
                    {selectedItem.verification_file_url ? (
                      <img
                        src={selectedItem.verification_file_url}
                        alt="학생증"
                        className="img-fluid rounded border"
                        style={{ maxHeight: "400px" }}
                      />
                    ) : (
                      <p className="text-muted">학생증 파일을 불러올 수 없습니다.</p>
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
                  onClick={() => handleVerificationAction(selectedItem, "approve")}
                >
                  <Icon icon="solar:check-circle-outline" className="me-1" />
                  {actionLoading ? "처리 중..." : "승인"}
                </button>
                <button
                  className="btn btn-danger-600"
                  disabled={actionLoading}
                  onClick={() => handleVerificationAction(selectedItem, "reject")}
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
    </>
  );
}
