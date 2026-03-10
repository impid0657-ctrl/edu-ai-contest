"use client";

import { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { formatKST } from "@/lib/dateUtils";

/**
 * Admin License Management Page
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

const PAGE_SIZE_OPTIONS = [10, 30, 50, 100];

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

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (categoryFilter) params.set("category", categoryFilter);
      if (searchText) params.set("search", searchText);
      params.set("page", page.toString());
      params.set("limit", limit.toString());

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
  }, [statusFilter, categoryFilter, searchText, page, limit]);

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

    const confirmMsg =
      action === "approve"
        ? `${selectedIds.length}건을 일괄 승인하시겠습니까?`
        : `${selectedIds.length}건을 일괄 반려하시겠습니까?`;

    if (!confirm(confirmMsg)) return;

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

  const handleRowAction = async (e, id, action) => {
    e.stopPropagation();
    if (!confirm(`이 신청을 ${action === "approve" ? "승인" : "반려"}하시겠습니까?`)) return;
    setRowActionLoading(id);
    try {
      const res = await fetch("/api/admin/license/bulk-action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [id], action }),
      });
      if (res.ok) {
        const data = await res.json();
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
    if (!confirm(`${selectedIds.length}건을 발급 완료로 처리하시겠습니까?`)) return;
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

  // 스마트 페이지네이션: 현재 페이지 기준 앞뒤 2페이지 표시
  const getPageNumbers = () => {
    const pages = [];
    const sideCount = 2;
    let start = Math.max(1, page - sideCount);
    let end = Math.min(totalPages, page + sideCount);

    // 최소 5개 보장
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

      {/* Filters + Actions */}
      <div className="card shadow-none border mb-4">
        <div className="card-body p-20">
          <div className="row g-3 align-items-end">
            <div className="col-md-2">
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
            <div className="col-md-2">
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
            <div className="col-md-3">
              <label className="form-label">학교명 검색</label>
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="학교명을 입력하세요"
                value={searchText}
                onChange={(e) => { setSearchText(e.target.value); setPage(1); }}
              />
            </div>
            <div className="col-md-5 d-flex flex-wrap gap-2 justify-content-end">
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
                <Icon icon="solar:check-circle-outline" className="me-1" />
                일괄 승인 ({selectedIds.length})
              </button>
              <button
                className="btn btn-danger-600 btn-sm"
                disabled={selectedIds.length === 0 || actionLoading}
                onClick={() => handleBulkAction("reject")}
              >
                <Icon icon="solar:close-circle-outline" className="me-1" />
                일괄 반려 ({selectedIds.length})
              </button>
              <button
                className="btn btn-info btn-sm"
                disabled={selectedIds.length === 0 || issuedLoading}
                onClick={handleMarkIssued}
              >
                <Icon icon="mdi:check-decagram" className="me-1" />
                발급 확인 ({selectedIds.length})
              </button>
              <button
                className="btn btn-outline-primary-600 btn-sm"
                onClick={handleCsvDownload}
              >
                <Icon icon="solar:download-minimalistic-outline" className="me-1" />
                CSV
              </button>
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
                  <th>이름</th>
                  <th>이메일</th>
                  <th>인증</th>
                  <th>부문</th>
                  <th>학교</th>
                  <th>상태</th>
                  <th>발급</th>
                  <th>신청일</th>
                  <th className="text-center">처리</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={10} className="text-center py-4">
                      <div className="spinner-border spinner-border-sm text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </td>
                  </tr>
                ) : applications.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="text-center py-4 text-muted">
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
                      <td className="fw-medium">{app.users?.name || app.applicant_name || "-"}</td>
                      <td>{app.users?.email || app.applicant_email || "-"}</td>
                      <td>
                        <span className={`badge ${AUTH_METHOD_BADGE[app.auth_method] || "bg-secondary-focus text-secondary-600"}`}>
                          {AUTH_METHOD_LABELS[app.auth_method] || app.auth_method || "-"}
                        </span>
                      </td>
                      <td>
                        <span className="badge bg-primary-50 text-primary-600">
                          {CATEGORY_LABELS[app.category] || app.category}
                        </span>
                      </td>
                      <td>{app.school_name || "-"}</td>
                      <td>
                        <span className={`badge ${STATUS_BADGE_CLASS[app.status] || ""}`}>
                          {STATUS_LABELS[app.status] || app.status}
                        </span>
                      </td>
                      <td>
                        {app.license_issued_at ? (
                          <span className="badge bg-success-focus text-success-600">발급됨</span>
                        ) : app.status === "approved" ? (
                          <span className="badge bg-warning-focus text-warning-600">미발급</span>
                        ) : (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td className="text-muted">
                        {app.created_at
                          ? formatKST(app.created_at, "yyyy-MM-dd")
                          : "-"}
                      </td>
                      <td className="text-center" onClick={(e) => e.stopPropagation()}>
                        {app.status === "pending" ? (
                          <div className="d-flex gap-1 justify-content-center">
                            <button
                              className="btn btn-sm btn-success-600 py-2 px-8"
                              disabled={rowActionLoading === app.id}
                              onClick={(e) => handleRowAction(e, app.id, "approve")}
                              title="승인"
                            >
                              {rowActionLoading === app.id ? (
                                <span className="spinner-border spinner-border-sm" style={{ width: 12, height: 12 }} />
                              ) : (
                                <Icon icon="solar:check-circle-outline" />
                              )}
                            </button>
                            <button
                              className="btn btn-sm btn-danger-600 py-2 px-8"
                              disabled={rowActionLoading === app.id}
                              onClick={(e) => handleRowAction(e, app.id, "reject")}
                              title="반려"
                            >
                              <Icon icon="solar:close-circle-outline" />
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
