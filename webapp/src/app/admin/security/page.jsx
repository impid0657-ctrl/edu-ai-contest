"use client";

import { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

/**
 * 관리자 보안 페이지
 * - 접속 로그 / 로그인 기록 / 이상 징후 3개 탭
 * - 필터: 날짜, 이벤트유형, IP 검색
 * - 90일 이상 로그 정리 기능
 */
export default function SecurityPage() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState("all"); // all, login, alerts
  const [ipFilter, setIpFilter] = useState("");
  const [cleaning, setCleaning] = useState(false);
  const limit = 30;

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });

      if (tab === "login") {
        // 로그인 성공+실패만
        // 두 번 호출 대신 서버에서 필터
      } else if (tab === "alerts") {
        params.set("severity", "warning");
      }

      if (tab === "login") {
        // login_success와 login_fail 모두 가져오기 위해 event_type 미지정
        // 대신 page_access 제외
      }

      if (ipFilter.trim()) params.set("ip", ipFilter.trim());

      const res = await fetch(`/api/admin/security?${params}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();

      let filtered = data.logs || [];
      if (tab === "login") {
        filtered = filtered.filter(l => l.event_type === "login_success" || l.event_type === "login_fail");
      } else if (tab === "alerts") {
        filtered = filtered.filter(l => l.severity === "warning" || l.severity === "critical");
      }

      setLogs(filtered);
      setTotal(data.total || 0);
    } catch (err) {
      console.error("Fetch logs error:", err);
    } finally {
      setLoading(false);
    }
  }, [page, tab, ipFilter]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const handleCleanup = async () => {
    if (!confirm("90일 이상 된 로그를 삭제하시겠습니까?")) return;
    setCleaning(true);
    try {
      const res = await fetch("/api/admin/security", { method: "DELETE" });
      const data = await res.json();
      alert(`${data.deleted}건 삭제 완료`);
      fetchLogs();
    } catch {
      alert("삭제 실패");
    } finally {
      setCleaning(false);
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "-";
    const d = new Date(iso);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const h = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    const s = String(d.getSeconds()).padStart(2, "0");
    return `${y}-${m}-${day} ${h}:${min}:${s}`;
  };

  const getEventBadge = (type) => {
    switch (type) {
      case "login_success": return <span style={{ ...badge, background: "#d4edda", color: "#155724" }}>로그인 성공</span>;
      case "login_fail": return <span style={{ ...badge, background: "#f8d7da", color: "#721c24" }}>로그인 실패</span>;
      case "page_access": return <span style={{ ...badge, background: "#d1ecf1", color: "#0c5460" }}>페이지 접근</span>;
      default: return <span style={badge}>{type}</span>;
    }
  };

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case "critical": return <span style={{ ...badge, background: "#dc3545", color: "#fff" }}>🔴 위험</span>;
      case "warning": return <span style={{ ...badge, background: "#ffc107", color: "#000" }}>🟡 주의</span>;
      default: return <span style={{ ...badge, background: "#e9ecef", color: "#495057" }}>정상</span>;
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <h5 style={{ margin: 0, fontWeight: 700 }}>
            <Icon icon="solar:shield-keyhole-outline" style={{ marginRight: 8, verticalAlign: "middle" }} />
            보안
          </h5>
          <p style={{ margin: "4px 0 0", color: "#888", fontSize: 14 }}>접속 로그 · 로그인 기록 · 이상 징후</p>
        </div>
        <button
          onClick={handleCleanup}
          disabled={cleaning}
          style={{
            padding: "8px 16px", border: "1px solid #dc3545", borderRadius: 8,
            background: "#fff", color: "#dc3545", cursor: cleaning ? "not-allowed" : "pointer",
            fontSize: 13, fontWeight: 600,
          }}
        >
          {cleaning ? "정리 중..." : "90일 이상 로그 정리"}
        </button>
      </div>

      {/* 탭 */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {[
          { key: "all", label: "전체 로그", icon: "mdi:format-list-bulleted" },
          { key: "login", label: "로그인 기록", icon: "mdi:login" },
          { key: "alerts", label: "이상 징후", icon: "mdi:alert-outline" },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setPage(1); }}
            style={{
              padding: "8px 20px", border: "1px solid #dee2e6", borderRadius: 8,
              background: tab === t.key ? "#487fff" : "#fff",
              color: tab === t.key ? "#fff" : "#333",
              cursor: "pointer", fontSize: 14, fontWeight: 600,
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            <Icon icon={t.icon} />
            {t.label}
          </button>
        ))}
      </div>

      {/* IP 필터 */}
      <div style={{ marginBottom: 16, display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="text"
          placeholder="IP 주소로 검색..."
          value={ipFilter}
          onChange={(e) => setIpFilter(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchLogs()}
          style={{
            padding: "8px 14px", border: "1px solid #dee2e6", borderRadius: 8,
            fontSize: 14, width: 240,
          }}
        />
        <button
          onClick={() => { setPage(1); fetchLogs(); }}
          style={{
            padding: "8px 16px", border: "1px solid #dee2e6", borderRadius: 8,
            background: "#f8f9fa", cursor: "pointer", fontSize: 14,
          }}
        >
          검색
        </button>
        {ipFilter && (
          <button
            onClick={() => { setIpFilter(""); setPage(1); }}
            style={{
              padding: "8px 12px", border: "none", background: "transparent",
              color: "#888", cursor: "pointer", fontSize: 13,
            }}
          >
            초기화
          </button>
        )}
        <span style={{ marginLeft: "auto", fontSize: 13, color: "#888" }}>
          총 {total}건
        </span>
      </div>

      {/* 테이블 */}
      <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e9ecef", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead>
            <tr style={{ background: "#f8f9fa", borderBottom: "2px solid #dee2e6" }}>
              <th style={th}>시간</th>
              <th style={th}>유형</th>
              <th style={th}>심각도</th>
              <th style={th}>IP</th>
              <th style={th}>이메일</th>
              <th style={th}>경로</th>
              <th style={th}>상세</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: 40, color: "#888" }}>로딩 중...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: "center", padding: 40, color: "#888" }}>
                {tab === "alerts" ? "이상 징후가 없습니다 ✅" : "로그가 없습니다"}
              </td></tr>
            ) : (
              logs.map((log) => (
                <tr
                  key={log.id}
                  style={{
                    borderBottom: "1px solid #f0f0f0",
                    background: log.severity === "critical" ? "#fff5f5"
                      : log.severity === "warning" ? "#fffdf0"
                      : "transparent",
                  }}
                >
                  <td style={td}>{formatDate(log.created_at)}</td>
                  <td style={td}>{getEventBadge(log.event_type)}</td>
                  <td style={td}>{getSeverityBadge(log.severity)}</td>
                  <td style={{ ...td, fontFamily: "monospace", fontSize: 13 }}>{log.ip_address || "-"}</td>
                  <td style={td}>{log.email || "-"}</td>
                  <td style={td}>{log.path || "-"}</td>
                  <td style={{ ...td, fontSize: 12, color: "#888" }}>
                    {log.details && Object.keys(log.details).length > 0
                      ? Object.entries(log.details).map(([k, v]) => `${k}: ${v}`).join(", ")
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 16 }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={pageBtn}
          >
            ‹
          </button>
          {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                style={{
                  ...pageBtn,
                  background: page === p ? "#487fff" : "#fff",
                  color: page === p ? "#fff" : "#333",
                }}
              >
                {p}
              </button>
            );
          })}
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={pageBtn}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

const badge = {
  display: "inline-block",
  padding: "3px 10px",
  borderRadius: 6,
  fontSize: 12,
  fontWeight: 600,
  whiteSpace: "nowrap",
};

const th = {
  padding: "12px 14px",
  textAlign: "left",
  fontWeight: 600,
  fontSize: 13,
  color: "#555",
  whiteSpace: "nowrap",
};

const td = {
  padding: "10px 14px",
  verticalAlign: "middle",
};

const pageBtn = {
  width: 36,
  height: 36,
  border: "1px solid #dee2e6",
  borderRadius: 8,
  background: "#fff",
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 600,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
