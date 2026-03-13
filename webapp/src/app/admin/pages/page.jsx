"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

/**
 * Admin Menu Management Page — /admin/pages
 * Shows all hardcoded menu items from DB.
 * Admin can toggle: 메뉴 노출, 공개/비공개, 비공개 경고 메시지
 * Cannot add/remove menus (hardcoded routes).
 */

export default function AdminMenuPage() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null); // ID of item being saved
  const [editingWarning, setEditingWarning] = useState(null); // { id, value }
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
    updateMenu(id, { access_warning: editingWarning.value });
    setEditingWarning(null);
  };

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary-600" /></div>;
  }

  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <div>
          <h6 className="fw-semibold mb-1">메뉴 관리</h6>
          <p className="text-sm text-primary-light mb-0">각 메뉴의 노출 여부와 접근 권한을 설정합니다.</p>
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible mb-3`}>
          {message.text}
          <button className="btn-close" onClick={() => setMessage({ type: "", text: "" })} />
        </div>
      )}

      <div className="card shadow-none border">
        <div className="card-header border-bottom bg-base py-16 px-24">
          <div className="d-flex align-items-center gap-2">
            <Icon icon="solar:hamburger-menu-outline" className="text-xl" />
            <h6 className="text-lg mb-0">사이트 메뉴 목록</h6>
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
                      {/* 순서 */}
                      <td className="text-center text-sm text-primary-light">{item.menu_order}</td>

                      {/* 메뉴명 */}
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

                      {/* 경로 */}
                      <td className="text-sm">
                        <code className="text-primary-600">{item.path}</code>
                      </td>

                      {/* 메뉴 노출 토글 */}
                      <td className="text-center">
                        <div className="form-check form-switch d-flex justify-content-end mb-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={item.is_visible}
                            onChange={() => handleToggle(item.id, "is_visible")}
                            disabled={saving === item.id}
                          />
                        </div>
                      </td>

                      {/* 공개/비공개 토글 */}
                      <td className="text-center">
                        <div className="form-check form-switch d-flex justify-content-end mb-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={item.is_public}
                            onChange={() => handleToggle(item.id, "is_public")}
                            disabled={saving === item.id}
                          />
                        </div>
                      </td>

                      {/* 비공개 경고 메시지 */}
                      <td>
                        {!item.is_public ? (
                          editingWarning?.id === item.id ? (
                            <div className="d-flex gap-2">
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                value={editingWarning.value}
                                onChange={(e) => setEditingWarning({ id: item.id, value: e.target.value })}
                                onKeyDown={(e) => e.key === "Enter" && handleWarningSubmit(item.id)}
                              />
                              <button
                                className="btn btn-sm btn-primary-600"
                                onClick={() => handleWarningSubmit(item.id)}
                                disabled={saving === item.id}
                              >
                                저장
                              </button>
                              <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => setEditingWarning(null)}
                              >
                                취소
                              </button>
                            </div>
                          ) : (
                            <div
                              className="d-flex align-items-center gap-2 cursor-pointer"
                              onClick={() => setEditingWarning({ id: item.id, value: item.access_warning || "" })}
                            >
                              <span className="text-sm text-muted">
                                {item.access_warning || "경고 메시지 미설정"}
                              </span>
                              <Icon icon="mdi:pencil-outline" className="text-primary-light text-sm" />
                            </div>
                          )
                        ) : (
                          <span className="text-sm text-neutral-400">—</span>
                        )}
                      </td>
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
              <p className="mb-1"><strong>메뉴 노출</strong>: 꺼두면 헤더 메뉴에서 보이지 않습니다. 직접 URL로 접근은 가능합니다.</p>
              <p className="mb-1"><strong>공개 여부</strong>: 비공개로 설정하면 관리자 로그인 후에만 접근할 수 있습니다. 일반 사용자가 접근하면 경고 메시지가 표시됩니다.</p>
              <p className="mb-0"><strong>경고 메시지</strong>: 비공개 페이지에 접근했을 때 보여줄 안내 문구를 설정합니다.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
