"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

/**
 * Admin Menu Management Page — /admin/pages
 * 일반 사용자 설정 + 관리자 전용 설정 2개 섹션
 * 각 메뉴당 6개 필드: is_visible, is_public, access_warning, admin_visible, admin_public, admin_access_warning
 */

export default function AdminMenuPage() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [editingWarning, setEditingWarning] = useState(null); // { id, value, field }
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => { fetchMenus(); }, []);

  const fetchMenus = async () => {
    try {
      const res = await fetch("/api/admin/pages");
      if (res.ok) {
        const data = await res.json();
        setMenus(data.pages || []);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const updateMenu = async (id, updates) => {
    setSaving(id);
    setMessage({ type: "", text: "" });
    try {
      const res = await fetch(`/api/admin/pages/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const data = await res.json();
        setMenus((prev) => prev.map((m) => m.id === id ? { ...m, ...data.page } : m));
        setMessage({ type: "success", text: "저장되었습니다." });
      } else {
        const err = await res.json().catch(() => ({}));
        setMessage({ type: "danger", text: err.error || "저장 실패" });
      }
    } catch { setMessage({ type: "danger", text: "네트워크 오류" }); }
    finally { setSaving(null); }
  };

  const handleToggle = (id, field) => {
    const item = menus.find((m) => m.id === id);
    if (!item) return;
    updateMenu(id, { [field]: !item[field] });
  };

  const handleWarningSubmit = (id) => {
    if (!editingWarning || editingWarning.id !== id) return;
    updateMenu(id, { [editingWarning.field]: editingWarning.value });
    setEditingWarning(null);
  };

  // 경고 메시지 편집 UI 렌더러 (일반용/관리자용 공통)
  const renderWarningCell = (item, isPublicField, warningField) => {
    const isPrivate = !item[isPublicField];
    if (!isPrivate) return <span className="text-sm text-neutral-400">—</span>;

    if (editingWarning?.id === item.id && editingWarning?.field === warningField) {
      return (
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control form-control-sm"
            value={editingWarning.value}
            onChange={(e) => setEditingWarning({ ...editingWarning, value: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && handleWarningSubmit(item.id)}
            placeholder="경고 메시지를 입력하세요"
          />
          <button className="btn btn-sm btn-primary-600" onClick={() => handleWarningSubmit(item.id)} disabled={saving === item.id}>저장</button>
          <button className="btn btn-sm btn-outline-secondary" onClick={() => setEditingWarning(null)}>취소</button>
        </div>
      );
    }

    return (
      <div
        className="d-flex align-items-center gap-2 cursor-pointer"
        onClick={() => setEditingWarning({ id: item.id, value: item[warningField] || "", field: warningField })}
      >
        <span className="text-sm text-muted">
          {item[warningField] || "경고 메시지 미설정"}
        </span>
        <Icon icon="mdi:pencil-outline" className="text-primary-light text-sm" />
      </div>
    );
  };

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary-600" /></div>;
  }

  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <div>
          <h6 className="fw-semibold mb-1">메뉴 관리</h6>
          <p className="text-sm text-primary-light mb-0">일반 사용자 및 관리자의 메뉴 노출과 접근 권한을 독립적으로 설정합니다.</p>
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible mb-3`}>
          {message.text}
          <button className="btn-close" onClick={() => setMessage({ type: "", text: "" })} />
        </div>
      )}

      {/* ========== 일반 사용자 설정 ========== */}
      <div className="card shadow-none border">
        <div className="card-header border-bottom bg-base py-16 px-24">
          <div className="d-flex align-items-center gap-2">
            <Icon icon="solar:users-group-rounded-outline" className="text-xl" />
            <h6 className="text-lg mb-0">일반 사용자 메뉴 설정</h6>
            <span className="bg-primary-50 text-primary-600 px-10 py-2 rounded-pill text-xs fw-medium">공개 사이트</span>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table bordered-table mb-0">
              <thead>
                <tr>
                  <th className="text-sm text-center" style={{ width: "60px" }}>순서</th>
                  <th className="text-sm">메뉴명</th>
                  <th className="text-sm">경로</th>
                  <th className="text-sm text-center" style={{ width: "100px" }}>메뉴 노출</th>
                  <th className="text-sm text-center" style={{ width: "100px" }}>공개 여부</th>
                  <th className="text-sm">비공개 경고 메시지</th>
                </tr>
              </thead>
              <tbody>
                {menus.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-4">
                      메뉴 데이터가 없습니다. 마이그레이션(013)을 실행해주세요.
                    </td>
                  </tr>
                ) : (
                  menus.map((item) => (
                    <tr key={item.id} className={!item.is_visible ? "bg-neutral-50" : ""}>
                      <td className="text-center text-sm text-primary-light">{item.menu_order}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span className="fw-semibold">{item.title}</span>
                          {!item.is_visible && (
                            <span className="bg-neutral-200 text-neutral-600 px-8 py-2 rounded-pill text-xs fw-medium">미노출</span>
                          )}
                          {!item.is_public && item.is_visible && (
                            <span className="bg-warning-focus text-warning-600 px-8 py-2 rounded-pill text-xs fw-medium">비공개</span>
                          )}
                        </div>
                      </td>
                      <td className="text-sm"><code className="text-primary-600">{item.path}</code></td>
                      <td className="text-center">
                        <div className="form-check form-switch d-flex justify-content-end mb-0">
                          <input className="form-check-input" type="checkbox" checked={item.is_visible} onChange={() => handleToggle(item.id, "is_visible")} disabled={saving === item.id} />
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="form-check form-switch d-flex justify-content-end mb-0">
                          <input className="form-check-input" type="checkbox" checked={item.is_public} onChange={() => handleToggle(item.id, "is_public")} disabled={saving === item.id} />
                        </div>
                      </td>
                      <td>{renderWarningCell(item, "is_public", "access_warning")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ========== 관리자 전용 설정 ========== */}
      <div className="card shadow-none border mt-4">
        <div className="card-header border-bottom bg-base py-16 px-24">
          <div className="d-flex align-items-center gap-2">
            <Icon icon="mdi:shield-account-outline" className="text-xl text-warning-600" />
            <h6 className="text-lg mb-0">관리자 전용 메뉴 설정</h6>
            <span className="bg-warning-focus text-warning-600 px-10 py-2 rounded-pill text-xs fw-medium">관리자 접속 시</span>
          </div>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table bordered-table mb-0">
              <thead>
                <tr>
                  <th className="text-sm text-center" style={{ width: "60px" }}>순서</th>
                  <th className="text-sm">메뉴명</th>
                  <th className="text-sm">경로</th>
                  <th className="text-sm text-center" style={{ width: "120px" }}>관리자 노출</th>
                  <th className="text-sm text-center" style={{ width: "120px" }}>관리자 공개</th>
                  <th className="text-sm">관리자 비공개 경고</th>
                </tr>
              </thead>
              <tbody>
                {menus.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center text-muted py-4">
                      메뉴 데이터가 없습니다.
                    </td>
                  </tr>
                ) : (
                  menus.map((item) => (
                    <tr key={`admin-${item.id}`} className={item.admin_visible === false ? "bg-neutral-50" : ""}>
                      <td className="text-center text-sm text-primary-light">{item.menu_order}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span className="fw-semibold">{item.title}</span>
                          {item.admin_visible === false && (
                            <span className="bg-neutral-200 text-neutral-600 px-8 py-2 rounded-pill text-xs fw-medium">미노출</span>
                          )}
                          {item.admin_public === false && item.admin_visible !== false && (
                            <span className="bg-warning-focus text-warning-600 px-8 py-2 rounded-pill text-xs fw-medium">비공개</span>
                          )}
                        </div>
                      </td>
                      <td className="text-sm"><code className="text-primary-600">{item.path}</code></td>
                      <td className="text-center">
                        <div className="form-check form-switch d-flex justify-content-end mb-0">
                          <input className="form-check-input" type="checkbox" checked={item.admin_visible !== false} onChange={() => handleToggle(item.id, "admin_visible")} disabled={saving === item.id} />
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="form-check form-switch d-flex justify-content-end mb-0">
                          <input className="form-check-input" type="checkbox" checked={item.admin_public !== false} onChange={() => handleToggle(item.id, "admin_public")} disabled={saving === item.id} />
                        </div>
                      </td>
                      <td>{renderWarningCell(item, "admin_public", "admin_access_warning")}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 안내 */}
      <div className="card shadow-none border mt-3">
        <div className="card-body p-16">
          <div className="d-flex gap-2 align-items-start">
            <Icon icon="mdi:information-outline" className="text-primary-600 text-xl mt-1" />
            <div className="text-sm text-primary-light">
              <p className="mb-2 fw-semibold">일반 사용자 설정과 관리자 설정은 서로 완전히 독립적입니다.</p>
              <p className="mb-1"><strong>일반 메뉴 노출</strong>: 일반 사용자의 헤더 메뉴 표시 여부를 제어합니다.</p>
              <p className="mb-1"><strong>일반 공개 여부</strong>: 일반 사용자의 페이지 접근을 허용/차단합니다.</p>
              <p className="mb-1"><strong>관리자 노출</strong>: 관리자 로그인 시 헤더 메뉴 표시 여부를 제어합니다. (일반 설정과 무관)</p>
              <p className="mb-1"><strong>관리자 공개</strong>: 관리자 로그인 시 페이지 접근을 허용/차단합니다. (일반 설정과 무관)</p>
              <p className="mb-0"><strong>경고 메시지</strong>: 각각의 비공개 설정에 대해 별도의 경고 메시지를 설정합니다.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
