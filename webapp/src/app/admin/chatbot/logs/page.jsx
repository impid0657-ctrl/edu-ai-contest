"use client";

import { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { formatKST } from "@/lib/dateUtils";

/**
 * Admin Chatbot Logs Page — /admin/chatbot/logs
 * C-3: Token cost aggregation display (daily stats + totals)
 * C-10: WowDash design applied
 */

export default function AdminChatbotLogsPage() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [blockedOnly, setBlockedOnly] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  // Token stats
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: "30", blocked: blockedOnly.toString() });
      const res = await fetch(`/api/admin/chatbot/logs?${params}`);
      if (res.ok) { const data = await res.json(); setLogs(data.logs || []); setTotal(data.total || 0); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [page, blockedOnly]);

  const fetchStats = async () => {
    setStatsLoading(true);
    try {
      const res = await fetch("/api/admin/chatbot/logs?stats=true");
      if (res.ok) setStats(await res.json());
    } catch (err) { console.error(err); }
    finally { setStatsLoading(false); }
  };

  useEffect(() => { fetchLogs(); }, [fetchLogs]);
  useEffect(() => { fetchStats(); }, []);

  const totalPages = Math.ceil(total / 30);

  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <h6 className="fw-semibold mb-0">챗봇 로그</h6>
        <div className="card shadow-none border mb-0">
          <div className="card-body py-8 px-16 d-flex align-items-center gap-2">
            <span className="text-muted fw-medium">총</span>
            <span className="fw-bold text-primary-600 fs-6">{total}건</span>
          </div>
        </div>
      </div>

      {/* Token Stats Cards */}
      {statsLoading ? (
        <div className="text-center mb-4"><div className="spinner-border spinner-border-sm text-primary" /></div>
      ) : stats && (
        <div className="row g-3 mb-4">
          <div className="col-md-3 col-sm-6">
            <div className="card shadow-none border bg-gradient-start-1 h-100">
              <div className="card-body p-20">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                  <div>
                    <p className="fw-medium text-primary-light mb-1">30일 총 질의</p>
                    <h6 className="mb-0">{stats.total_queries.toLocaleString()}건</h6>
                  </div>
                  <div className="w-50-px h-50-px bg-cyan rounded-circle d-flex justify-content-center align-items-center">
                    <Icon icon="mdi:chat-processing" className="text-white text-2xl mb-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6">
            <div className="card shadow-none border bg-gradient-start-2 h-100">
              <div className="card-body p-20">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                  <div>
                    <p className="fw-medium text-primary-light mb-1">30일 총 토큰</p>
                    <h6 className="mb-0">{stats.total_tokens.toLocaleString()}</h6>
                  </div>
                  <div className="w-50-px h-50-px bg-purple rounded-circle d-flex justify-content-center align-items-center">
                    <Icon icon="mdi:counter" className="text-white text-2xl mb-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6">
            <div className="card shadow-none border bg-gradient-start-3 h-100">
              <div className="card-body p-20">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                  <div>
                    <p className="fw-medium text-primary-light mb-1">예상 비용 (30일)</p>
                    <h6 className="mb-0">${stats.estimated_cost_usd}</h6>
                  </div>
                  <div className="w-50-px h-50-px bg-success rounded-circle d-flex justify-content-center align-items-center">
                    <Icon icon="mdi:currency-usd" className="text-white text-2xl mb-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-6">
            <div className="card shadow-none border bg-gradient-start-4 h-100">
              <div className="card-body p-20">
                <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
                  <div>
                    <p className="fw-medium text-primary-light mb-1">질의당 평균 토큰</p>
                    <h6 className="mb-0">{stats.total_queries > 0 ? Math.round(stats.total_tokens / stats.total_queries) : 0}</h6>
                  </div>
                  <div className="w-50-px h-50-px bg-warning rounded-circle d-flex justify-content-center align-items-center">
                    <Icon icon="mdi:chart-line" className="text-white text-2xl mb-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Daily breakdown (collapsed) */}
      {stats?.daily?.length > 0 && (
        <div className="card shadow-none border mb-4">
          <div className="card-header border-bottom bg-base py-16 px-24 d-flex justify-content-between align-items-center">
            <h6 className="text-lg fw-semibold mb-0"><Icon icon="mdi:calendar-month" className="me-2" />일별 토큰 사용량 (최근 30일)</h6>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table bordered-table mb-0">
                <thead><tr><th>날짜</th><th>질의 수</th><th>토큰 사용량</th></tr></thead>
                <tbody>
                  {stats.daily.slice().reverse().map((d) => (
                    <tr key={d.date}>
                      <td className="fw-medium">{d.date}</td>
                      <td>{d.queries}건</td>
                      <td>{d.tokens.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card shadow-none border mb-4">
        <div className="card-body p-20">
          <div className="form-check form-switch d-flex align-items-center gap-2 mb-0">
            <input className="form-check-input mt-0" type="checkbox" checked={blockedOnly} onChange={(e) => { setBlockedOnly(e.target.checked); setPage(1); }} id="blockedFilter" style={{ cursor: "pointer" }} />
            <label className="form-check-label fw-medium" htmlFor="blockedFilter" style={{ cursor: "pointer" }}>차단된 질의만 보기</label>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="card shadow-none border">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table bordered-table mb-0">
              <thead>
                <tr><th>시각</th><th>질문</th><th>응답 미리보기</th><th>토큰</th><th>차단</th></tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-4"><div className="spinner-border spinner-border-sm text-primary" /></td></tr>
                ) : logs.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-4 text-muted">로그가 없습니다.</td></tr>
                ) : logs.map((log) => (
                  <tr key={log.id} className="cursor-pointer" onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}>
                    <td className="text-muted text-nowrap">{formatKST(log.created_at, "MM-dd HH:mm")}</td>
                    <td className="fw-medium">{(log.user_message || "").substring(0, 60)}{log.user_message?.length > 60 ? "..." : ""}</td>
                    <td className="text-muted">{(log.assistant_message || "").substring(0, 60)}{log.assistant_message?.length > 60 ? "..." : ""}</td>
                    <td><span className="badge bg-primary-50 text-primary-600">{log.tokens_used || 0}</span></td>
                    <td>{log.is_blocked ? <span className="badge bg-danger-focus text-danger-600">차단</span> : <span className="text-muted">-</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Expanded detail */}
          {expandedId && logs.find((l) => l.id === expandedId) && (() => {
            const log = logs.find((l) => l.id === expandedId);
            return (
              <div className="border-top p-24 bg-light">
                <div className="row g-3">
                  <div className="col-md-6">
                    <h6 className="fw-semibold mb-2">질문</h6>
                    <p className="text-break mb-0">{log.user_message}</p>
                  </div>
                  <div className="col-md-6">
                    <h6 className="fw-semibold mb-2">응답</h6>
                    <p className="text-break mb-0">{log.assistant_message}</p>
                  </div>
                </div>
                <div className="mt-2 text-muted small">
                  제공자: {log.provider || "-"} | 모델: {log.model || "-"} | 지연: {log.latency_ms || 0}ms | 세션: {log.session_id || "-"}
                </div>
              </div>
            );
          })()}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="card-footer d-flex justify-content-between align-items-center">
            <span className="text-muted">총 {total}건</span>
            <nav>
              <ul className="pagination mb-0">
                <li className={`page-item ${page <= 1 ? "disabled" : ""}`}><button className="page-link" onClick={() => setPage(page - 1)}>이전</button></li>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                  <li key={i + 1} className={`page-item ${page === i + 1 ? "active" : ""}`}><button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button></li>
                ))}
                <li className={`page-item ${page >= totalPages ? "disabled" : ""}`}><button className="page-link" onClick={() => setPage(page + 1)}>다음</button></li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </>
  );
}
