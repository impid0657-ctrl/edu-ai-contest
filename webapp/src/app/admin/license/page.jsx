"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { formatKST } from "@/lib/dateUtils";

/**
 * Admin License Management Page
 * - Dynamic column selector (localStorage persisted)
 * - Student verification status icon integration
 * - Applicant table with checkbox multi-select
 * - Filters: status, category, school search
 * - Bulk approve/reject with 500-seat cap
 * - CSV export (approved only)
 * - Per-row quick approve/reject buttons
 * - Smart pagination with page size selector
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

// ── Column definitions ──
const COLUMN_DEFS = [
  { key: "name", label: "이름", default: true },
  { key: "email", label: "이메일", default: true },
  { key: "auth_method", label: "인증", default: true },
  { key: "category", label: "부문", default: true },
  { key: "school_name", label: "학교", default: true },
  { key: "status", label: "상태", default: true },
  { key: "license_issued", label: "발급", default: true },
  { key: "verification_status", label: "학생증 인증", default: true },
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
  { key: "teacher_name", label: "지도교사", default: false },
  { key: "privacy_agreed", label: "개인정보 동의", default: false },
  { key: "third_party_agreed", label: "제3자 동의", default: false },
];

const LS_KEY = "admin_license_columns";

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
    case "auth_method":
      return (
        <span className={`badge ${AUTH_METHOD_BADGE[app.auth_method] || "bg-secondary-focus text-secondary-600"}`}>
          {AUTH_METHOD_LABELS[app.auth_method] || app.auth_method || "-"}
        </span>
      );
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
    case "license_issued":
      if (app.license_issued_at)
        return <span className="badge bg-success-focus text-success-600">발급됨</span>;
      if (app.status === "approved")
        return <span className="badge bg-warning-focus text-warning-600">미발급</span>;
      return <span className="text-muted">-</span>;
    case "verification_status":
      if (app.auth_method !== "student_direct") return <span className="text-muted">-</span>;
      const vs = app.verification_status;
      const vi = VERIFICATION_STATUS_ICON[vs];
      if (!vi) return <span className="text-muted">-</span>;
      return (
        <span className="d-inline-flex align-items-center gap-1" title={vi.label}>
          <Icon icon={vi.icon} style={{ color: vi.color, fontSize: "18px" }} />
          <span className="text-sm">{vi.label}</span>
        </span>
      );
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
    case "teacher_name":
      return app.teacher_name || "-";
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
              className="d-flex align-items-center gap-8 py-4 px-4 rounded cursor-pointer"
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
export default function AdminLicensePage() {
  const [applications, setApplications] = useState([]);
  const [total, setTotal] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [remainingSeats, setRemainingSeats] = useState(500);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [rowActionLoading, setRowActionLoading] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [trashMode, setTrashMode] = useState(false);
  const [issuedLoading, setIssuedLoading] = useState(false);

  // Detail modal
  const [detail, setDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState(getDefaultColumns);

  // Load saved columns on mount
  useEffect(() => {
    setVisibleColumns(loadColumns());
  }, []);

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (categoryFilter) params.set("category", categoryFilter);
      if (searchText) params.set("search", searchText);
      params.set("page", page.toString());
      params.set("limit", limit.toString());
      if (trashMode) params.set("trash", "true");

      const res = await fetch(`/api/admin/license?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch");

      const data = await res.json();
      setApplications(data.applications || []);
      setTotal(data.total || 0);
      setApprovedCount(data.approved_count || 0);
      setRemainingSeats(data.remaining_seats ?? 500);
      setPendingCount(data.pending_count ?? (data.applications || []).filter(a => a.status === "pending").length);
    } catch (err) {
      console.error("Fetch applications error:", err);
      setMessage({ type: "danger", text: "데이터를 불러오는데 실패했습니다." });
    } finally {
      setLoading(false);
    }
  }, [statusFilter, categoryFilter, searchText, page, limit, trashMode]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(applications.map((app) => app.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectPendingOnly = () => {
    const pendingIds = applications.filter(app => app.status === "pending").map(app => app.id);
    setSelectedIds(pendingIds);
  };

  const handleSelectRow = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkAction = async (action) => {
    if (selectedIds.length === 0) return;
    setActionLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/admin/license/bulk-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds, action }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "danger", text: data.error || "작업에 실패했습니다." });
        return;
      }

      setMessage({
        type: "success",
        text: `${data.updated}건이 ${action === "approve" ? "승인" : "반려"}되었습니다.`,
      });
      setSelectedIds([]);
      fetchApplications();
    } catch (err) {
      setMessage({ type: "danger", text: "네트워크 오류가 발생했습니다." });
    } finally {
      setActionLoading(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/license/bulk-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds, action: "delete" }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: `${data.updated}건이 삭제되었습니다.` });
        setSelectedIds([]);
        fetchApplications();
      } else {
        setMessage({ type: "danger", text: data.error || "삭제 실패" });
      }
    } catch { setMessage({ type: "danger", text: "네트워크 오류" }); }
    finally { setActionLoading(false); }
  };

  const handleBulkRestore = async () => {
    if (selectedIds.length === 0) return;
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/license/bulk-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds, action: "restore" }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: `${data.updated}건이 복구되었습니다.` });
        setSelectedIds([]);
        fetchApplications();
      } else {
        setMessage({ type: "danger", text: data.error || "복구 실패" });
      }
    } catch { setMessage({ type: "danger", text: "네트워크 오류" }); }
    finally { setActionLoading(false); }
  };

  const handleBulkPermanentDelete = async () => {
    if (selectedIds.length === 0) {
      alert("선택된 항목이 없습니다.");
      return;
    }
    console.log("[완전 삭제] 시작 - ids:", selectedIds);
    setActionLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const payload = { ids: selectedIds, action: "permanent_delete" };
      console.log("[완전 삭제] payload:", JSON.stringify(payload));
      const res = await fetch("/api/admin/license/bulk-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log("[완전 삭제] 응답:", res.status, data);
      if (res.ok) {
        setMessage({ type: "success", text: `${data.updated}건이 완전 삭제되었습니다.` });
        setSelectedIds([]);
        fetchApplications();
      } else {
        setMessage({ type: "danger", text: data.error || "완전 삭제 실패" });
        alert("완전 삭제 실패: " + (data.error || "알 수 없는 오류"));
      }
    } catch (err) {
      console.error("[완전 삭제] 에러:", err);
      setMessage({ type: "danger", text: "네트워크 오류" });
      alert("완전 삭제 네트워크 에러: " + err.message);
    }
    finally { setActionLoading(false); }
  };

  const handleRowAction = async (e, id, action) => {
    e.stopPropagation();
    setRowActionLoading(id);
    try {
      const res = await fetch("/api/admin/license/bulk-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id], action }),
      });
      if (res.ok) {
        setMessage({ type: "success", text: `${action === "approve" ? "승인" : "반려"} 완료` });
        fetchApplications();
      }
    } catch { setMessage({ type: "danger", text: "처리 실패" }); }
    finally { setRowActionLoading(null); }
  };

  const handleCsvDownload = () => {
    window.open("/api/admin/license/csv", "_blank");
  };

  const handleMarkIssued = async () => {
    if (selectedIds.length === 0) return;
    setIssuedLoading(true);
    try {
      const res = await fetch("/api/admin/license/mark-issued", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: `${data.updated}건이 발급 완료 처리되었습니다.` });
        setSelectedIds([]);
        fetchApplications();
      } else {
        setMessage({ type: "danger", text: data.error || "처리 실패" });
      }
    } catch { setMessage({ type: "danger", text: "네트워크 오류" }); }
    finally { setIssuedLoading(false); }
  };

  const openDetail = async (id) => {
    setDetailLoading(true); setDetail(null);
    try {
      const res = await fetch(`/api/admin/license/${id}`);
      if (res.ok) setDetail(await res.json());
    } catch (err) { console.error(err); }
    finally { setDetailLoading(false); }
  };

  const handleIndividualAction = async (id, action) => {
    const res = await fetch("/api/admin/license/bulk-action", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: [id], action }),
    });
    if (res.ok) { setDetail(null); fetchApplications(); }
  };

  const totalPages = Math.ceil(total / limit);

  const getPageNumbers = () => {
    const pages = [];
    const sideCount = 2;
    let start = Math.max(1, page - sideCount);
    let end = Math.min(totalPages, page + sideCount);

    if (end - start < sideCount * 2) {
      if (start === 1) end = Math.min(totalPages, start + sideCount * 2);
      else if (end === totalPages) start = Math.max(1, end - sideCount * 2);
    }

    if (start > 1) { pages.push(1); if (start > 2) pages.push("..."); }
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages) { if (end < totalPages - 1) pages.push("..."); pages.push(totalPages); }

    return pages;
  };

  const currentPendingInPage = applications.filter(a => a.status === "pending").length;
  const activeColumns = COLUMN_DEFS.filter((c) => visibleColumns.includes(c.key));
  const totalColSpan = activeColumns.length + 2; // checkbox + action

  return (
    <>
      {/* Header with stats */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <div className="d-flex align-items-center gap-3">
          <h6 className="fw-semibold mb-0">이용권 관리</h6>
          {pendingCount > 0 && (
            <span className="badge bg-warning-focus text-warning-600 fs-6 px-12 py-6">
              대기 {pendingCount}건
            </span>
          )}
        </div>
        <div className="d-flex gap-3">
          <div className="card shadow-none border mb-0">
            <div className="card-body py-8 px-16 d-flex align-items-center gap-2">
              <span className="text-muted fw-medium">승인</span>
              <span className="fw-bold text-success-600">{approvedCount}</span>
            </div>
          </div>
          <div className="card shadow-none border mb-0">
            <div className="card-body py-8 px-16 d-flex align-items-center gap-2">
              <span className="text-muted fw-medium">잔여</span>
              <span className="fw-bold text-primary-600">{remainingSeats} / 500</span>
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible`} role="alert">
          {message.text}
          <button
            type="button"
            className="btn-close"
            onClick={() => setMessage({ type: "", text: "" })}
          ></button>
        </div>
      )}

      {/* Actions + Filters */}
      <div className="card shadow-none border mb-4">
        <div className="card-body p-20">
          {/* 1행: 액션 버튼 + 컬럼 설정 */}
          <div className="d-flex flex-nowrap gap-2 justify-content-end mb-16">
            {currentPendingInPage > 0 && (
              <button
                className="btn btn-outline-warning btn-sm"
                onClick={handleSelectPendingOnly}
              >
                <Icon icon="solar:clock-circle-outline" className="me-1" />
                대기만 선택 ({currentPendingInPage})
              </button>
            )}
            <button
              className="btn btn-success-600 btn-sm"
              disabled={selectedIds.length === 0 || actionLoading}
              onClick={() => handleBulkAction("approve")}
            >
              일괄 승인 ({selectedIds.length})
            </button>
            <button
              className="btn btn-danger-600 btn-sm"
              disabled={selectedIds.length === 0 || actionLoading}
              onClick={() => handleBulkAction("reject")}
            >
              일괄 반려 ({selectedIds.length})
            </button>
            <button
              className="btn btn-info btn-sm"
              disabled={selectedIds.length === 0 || issuedLoading}
              onClick={handleMarkIssued}
            >
              발급 확인 ({selectedIds.length})
            </button>
            {!trashMode && (
              <button
                className="btn btn-outline-danger btn-sm"
                disabled={selectedIds.length === 0 || actionLoading}
                onClick={handleBulkDelete}
              >
                삭제 ({selectedIds.length})
              </button>
            )}
            {trashMode && (
              <>
                <button
                  className="btn btn-success-600 btn-sm"
                  disabled={selectedIds.length === 0 || actionLoading}
                  onClick={handleBulkRestore}
                >
                  복구 ({selectedIds.length})
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  disabled={selectedIds.length === 0 || actionLoading}
                  onClick={handleBulkPermanentDelete}
                >
                  완전 삭제 ({selectedIds.length})
                </button>
              </>
            )}
            <button
              className="btn btn-outline-primary-600 btn-sm"
              onClick={handleCsvDownload}
            >
              <Icon icon="solar:download-minimalistic-outline" className="me-1" />
              CSV
            </button>
            <button
              className={`btn btn-sm ${trashMode ? "btn-secondary" : "btn-outline-secondary"}`}
              onClick={() => { setTrashMode(!trashMode); setPage(1); setSelectedIds([]); }}
            >
              <Icon icon="solar:trash-bin-2-outline" className="me-1" />
              {trashMode ? "목록으로" : "휴지통"}
            </button>

            {/* 컬럼 설정 */}
            <ColumnSelector visibleColumns={visibleColumns} setVisibleColumns={setVisibleColumns} />
          </div>
          {/* 2행: 필터 */}
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <label className="form-label">상태</label>
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
            <div className="col-md-3">
              <label className="form-label">부문</label>
              <select
                className="form-select form-select-sm"
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
              >
                <option value="">전체</option>
                <option value="elementary">초등부</option>
                <option value="secondary">중·고등부</option>
                <option value="general">일반부</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">학교명 검색</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="학교명을 입력하세요"
                value={searchText}
                onChange={(e) => { setSearchText(e.target.value); setPage(1); }}
              />
            </div>
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
                  <th>
                    <input
                      type="checkbox"
                      className="form-check-input"
                      onChange={handleSelectAll}
                      checked={
                        applications.length > 0 &&
                        selectedIds.length === applications.length
                      }
                    />
                  </th>
                  {activeColumns.map((col) => (
                    <th key={col.key}>{col.label}</th>
                  ))}
                  <th className="text-center">처리</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={totalColSpan} className="text-center py-4">
                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan={totalColSpan} className="text-center py-4 text-muted">
                      신청 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr key={app.id} style={{ cursor: "pointer" }} onClick={() => openDetail(app.id)}>
                      <td onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          checked={selectedIds.includes(app.id)}
                          onChange={() => handleSelectRow(app.id)}
                        />
                      </td>
                      {activeColumns.map((col) => (
                        <td key={col.key}>{renderCell(app, col.key)}</td>
                      ))}
                      <td className="text-center align-middle" onClick={(e) => e.stopPropagation()}>
                        {app.status === "pending" ? (
                          <div className="d-flex gap-1 justify-content-center align-items-center">
                            <button
                              className="btn btn-sm btn-success-600 d-flex align-items-center justify-content-center"
                              style={{ minWidth: "52px", height: "30px" }}
                              disabled={rowActionLoading === app.id}
                              onClick={(e) => handleRowAction(e, app.id, "approve")}
                            >
                              {rowActionLoading === app.id ? (
                                <span className="spinner-border spinner-border-sm" style={{ width: 12, height: 12 }} />
                              ) : "승인"}
                            </button>
                            <button
                              className="btn btn-sm btn-danger-600 d-flex align-items-center justify-content-center"
                              style={{ minWidth: "52px", height: "30px" }}
                              disabled={rowActionLoading === app.id}
                              onClick={(e) => handleRowAction(e, app.id, "reject")}
                            >
                              반려
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination + Page Size */}
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
                  <button className="page-link" onClick={() => setPage(page - 1)}>
                    <Icon icon="solar:alt-arrow-left-outline" />
                  </button>
                </li>
                {getPageNumbers().map((p, i) =>
                  p === "..." ? (
                    <li key={`dots-${i}`} className="page-item disabled">
                      <span className="page-link">…</span>
                    </li>
                  ) : (
                    <li key={p} className={`page-item ${page === p ? "active" : ""}`}>
                      <button className="page-link" onClick={() => setPage(p)}>{p}</button>
                    </li>
                  )
                )}
                <li className={`page-item ${page >= totalPages ? "disabled" : ""}`}>
                  <button className="page-link" onClick={() => setPage(page + 1)}>
                    <Icon icon="solar:alt-arrow-right-outline" />
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {(detail || detailLoading) && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{detailLoading ? "로딩 중..." : `이용권 신청 상세`}</h5>
                <button className="btn-close" onClick={() => setDetail(null)} />
              </div>
              {detail && (
                <div className="modal-body">
                  <div className="card mb-3">
                    <div className="card-header"><h6 className="mb-0">신청 정보</h6></div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-md-6"><strong>이름:</strong> {detail.user_info?.name || detail.applicant_name || "-"}</div>
                        <div className="col-md-6"><strong>이메일:</strong> {detail.user_info?.email || detail.applicant_email || detail.email || "-"}</div>
                        <div className="col-md-6"><strong>연락처:</strong> {detail.phone || detail.user_info?.phone || "-"}</div>
                        <div className="col-md-6"><strong>학교:</strong> {detail.school_name || "-"}</div>
                        {detail.teacher_name && <div className="col-md-6"><strong>지도교사:</strong> {detail.teacher_name}</div>}
                        <div className="col-md-6"><strong>부문:</strong> {CATEGORY_LABELS[detail.category] || detail.category}</div>
                        <div className="col-md-6">
                          <strong>인증방법:</strong>{" "}
                          <span className={`badge ${AUTH_METHOD_BADGE[detail.auth_method] || "bg-secondary-focus text-secondary-600"}`}>
                            {AUTH_METHOD_LABELS[detail.auth_method] || detail.auth_method || "-"}
                          </span>
                        </div>
                        <div className="col-md-6"><strong>상태:</strong> <span className={`badge ${STATUS_BADGE_CLASS[detail.status] || ""}`}>{STATUS_LABELS[detail.status] || detail.status}</span></div>
                        <div className="col-md-6"><strong>신청일:</strong> {detail.created_at ? formatKST(detail.created_at, "yyyy-MM-dd HH:mm") : "-"}</div>
                        <div className="col-md-6"><strong>발급일:</strong> {detail.license_issued_at ? formatKST(detail.license_issued_at, "yyyy-MM-dd HH:mm") : <span className="text-muted">미발급</span>}</div>
                      </div>
                    </div>
                  </div>

                  {/* Extended Info */}
                  <div className="card mb-3">
                    <div className="card-header"><h6 className="mb-0">추가 정보</h6></div>
                    <div className="card-body">
                      <div className="row g-3">
                        <div className="col-md-6"><strong>출생연도:</strong> {detail.birth_year || "-"}</div>
                        <div className="col-md-6"><strong>대표자명:</strong> {detail.representative_name || "-"}</div>
                        <div className="col-md-6"><strong>팀명:</strong> {detail.team_name || "-"}</div>
                        <div className="col-md-6"><strong>팀원 수:</strong> {detail.member_count ?? "-"}</div>
                        <div className="col-md-6"><strong>팀원1:</strong> {detail.member1_name || "-"}</div>
                        <div className="col-md-6"><strong>팀원2:</strong> {detail.member2_name || "-"}</div>
                        <div className="col-md-12"><strong>주제:</strong> {detail.topic || "-"}</div>
                        <div className="col-md-6"><strong>지역:</strong> {detail.region || "-"}</div>
                        <div className="col-md-6">
                          <strong>개인정보 동의:</strong>{" "}
                          {detail.privacy_agreed_at ? (
                            <span className="badge bg-success-focus text-success-600">동의 ({formatKST(detail.privacy_agreed_at, "MM-dd HH:mm")})</span>
                          ) : <span className="text-muted">미동의</span>}
                        </div>
                        <div className="col-md-6">
                          <strong>제3자 제공 동의:</strong>{" "}
                          {detail.third_party_agreed_at ? (
                            <span className="badge bg-success-focus text-success-600">동의 ({formatKST(detail.third_party_agreed_at, "MM-dd HH:mm")})</span>
                          ) : <span className="text-muted">미동의</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Student Verification */}
                  {detail.verification && (
                    <div className="card mb-3">
                      <div className="card-header"><h6 className="mb-0">학생 인증 현황</h6></div>
                      <div className="card-body">
                        {detail.verification.email_otp ? (
                          <div className="mb-2">
                            <strong>학교 이메일 OTP:</strong>{" "}
                            <span className={`badge ${detail.verification.email_otp.verified ? "bg-success-focus text-success-600" : "bg-warning-focus text-warning-600"}`}>
                              {detail.verification.email_otp.verified ? "인증 완료" : "미인증"}
                            </span>
                            <br /><small className="text-muted">이메일: {detail.verification.email_otp.school_email}</small>
                          </div>
                        ) : null}
                        {detail.verification.student_id ? (
                          <div>
                            <strong>학생증 업로드:</strong>{" "}
                            <span className={`badge ${detail.verification.student_id.status === "approved" ? "bg-success-focus text-success-600" : detail.verification.student_id.status === "rejected" ? "bg-danger-focus text-danger-600" : "bg-warning-focus text-warning-600"}`}>
                              {detail.verification.student_id.status === "approved" ? "승인" : detail.verification.student_id.status === "rejected" ? "반려" : "대기"}
                            </span>
                            {detail.verification.student_id.file_url && (
                              <a href={detail.verification.student_id.file_url} target="_blank" className="btn btn-sm btn-outline-primary ms-2">학생증 보기</a>
                            )}
                          </div>
                        ) : null}
                        {!detail.verification.email_otp && !detail.verification.student_id && (
                          <p className="text-muted">인증 기록 없음</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="modal-footer">
                {detail && detail.status === "pending" && (
                  <>
                    <button className="btn btn-success-600" onClick={() => handleIndividualAction(detail.id, "approve")}>승인</button>
                    <button className="btn btn-danger-600" onClick={() => handleIndividualAction(detail.id, "reject")}>반려</button>
                  </>
                )}
                <button className="btn btn-secondary" onClick={() => setDetail(null)}>닫기</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
