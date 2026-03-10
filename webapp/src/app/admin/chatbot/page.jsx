"use client";

import { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";

// Gemini 모델 목록 (공식 문서 기준 유효 모델 — https://ai.google.dev/gemini-api/docs/deprecations)
const GEMINI_MODELS = [
  { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite", desc: "가장 빠름, 저비용 (기본 추천)" },
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash", desc: "빠른 응답, 균형 잡힌 성능" },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro", desc: "최고 품질, 복잡한 추론" },
];

// OpenRouter 모델 목록 (서버의 openrouter.js와 동기화)
const OPENROUTER_MODELS = [
  { id: "anthropic/claude-3.5-haiku", name: "Claude 3.5 Haiku", desc: "빠르고 저렴, 한국어 우수" },
  { id: "meta-llama/llama-3.3-70b-instruct", name: "Llama 3.3 70B", desc: "고성능, 저비용" },
  { id: "mistralai/mistral-small-3.1-24b-instruct", name: "Mistral Small 3.1", desc: "중간 성능, 빠른 응답" },
  { id: "qwen/qwen-2.5-72b-instruct", name: "Qwen 2.5 72B", desc: "다국어 우수, 고성능" },
];

/**
 * Admin Chatbot Page — /admin/chatbot
 * C-2: RAG document management (add/edit/delete)
 * C-9: WowDash design applied
 * Two tabs: "챗봇 설정" + "RAG 문서 관리"
 */

export default function AdminChatbotPage() {
  const [activeTab, setActiveTab] = useState("settings");

  return (
    <>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <h6 className="fw-semibold mb-0">챗봇 관리</h6>
      </div>

      {/* Tabs */}
      <ul className="nav nav-pills mb-24 gap-2">
        <li className="nav-item">
          <button className={`nav-link d-flex align-items-center gap-2 ${activeTab === "settings" ? "active" : ""}`} onClick={() => setActiveTab("settings")}>
            <Icon icon="mdi:cog" className="text-lg" />
            <span>챗봇 설정</span>
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link d-flex align-items-center gap-2 ${activeTab === "documents" ? "active" : ""}`} onClick={() => setActiveTab("documents")}>
            <Icon icon="mdi:file-document-multiple" className="text-lg" />
            <span>RAG 문서 관리</span>
          </button>
        </li>
      </ul>

      {activeTab === "settings" && <ChatbotSettingsTab />}
      {activeTab === "documents" && <DocumentsTab />}
    </>
  );
}

/* ─── Settings Tab ─── */
function ChatbotSettingsTab() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [healthStatus, setHealthStatus] = useState(null);
  const [healthLoading, setHealthLoading] = useState(false);
  const [fallbackLogs, setFallbackLogs] = useState([]);
  const [logsOpen, setLogsOpen] = useState(false);
  const [logsLoading, setLogsLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/chatbot/settings");
        if (res.ok) {
          const data = await res.json();
          const s = data.settings;
          // example_questions가 완전히 비어있으면 API에서 현재 표시 중인 질문 로드
          if (!Array.isArray(s.example_questions) || s.example_questions.length === 0) {
            try {
              const qRes = await fetch("/api/settings/chatbot-questions");
              if (qRes.ok) {
                const qData = await qRes.json();
                if (Array.isArray(qData.questions) && qData.questions.length > 0) {
                  s.example_questions = qData.questions;
                }
              }
            } catch { }
            // 여전히 비어있으면 기본값
            if (!Array.isArray(s.example_questions) || s.example_questions.length === 0) {
              s.example_questions = [
                "참가 자격은 어떻게 되나요?",
                "AI 이용권은 어떻게 받나요?",
                "작품 접수 마감일은 언제인가요?",
                "팀으로 참가할 수 있나요?",
              ];
            }
          }
          setSettings(s);
        }
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    })();
    // Load health status
    (async () => {
      try {
        const res = await fetch("/api/admin/chatbot/healthcheck");
        if (res.ok) { const data = await res.json(); setHealthStatus(data.latest); }
      } catch { }
    })();
  }, []);

  const runHealthCheck = async () => {
    setHealthLoading(true);
    try {
      const res = await fetch("/api/admin/chatbot/healthcheck", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setHealthStatus(data);
        setMessage({ type: data.status === "ok" ? "success" : "warning", text: data.status === "ok" ? "헬스체크 정상 통과" : `헬스체크 실패: ${data.error_message}` });
      }
    } catch { setMessage({ type: "danger", text: "헬스체크 요청 실패" }); }
    finally { setHealthLoading(false); }
  };

  const loadFallbackLogs = async () => {
    if (!logsOpen) {
      setLogsLoading(true);
      try {
        const res = await fetch("/api/admin/chatbot/fallback-logs");
        if (res.ok) { const data = await res.json(); setFallbackLogs(data.logs || []); }
      } catch { }
      finally { setLogsLoading(false); }
    }
    setLogsOpen(!logsOpen);
  };

  const handleChange = (field, value) => { setSettings((prev) => ({ ...prev, [field]: value })); setMessage({ type: "", text: "" }); };

  const handleSave = async () => {
    setSaving(true); setMessage({ type: "", text: "" });
    try {
      const res = await fetch("/api/admin/chatbot/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
      if (res.ok) setMessage({ type: "success", text: "설정이 저장되었습니다." });
      else { const d = await res.json(); setMessage({ type: "danger", text: d.error || "저장 실패" }); }
    } catch { setMessage({ type: "danger", text: "네트워크 오류" }); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;
  if (!settings) return <p className="text-danger">설정을 불러올 수 없습니다.</p>;

  return (
    <>
      {message.text && <div className={`alert alert-${message.type} alert-dismissible mb-3`}>{message.text}<button className="btn-close" onClick={() => setMessage({ type: "", text: "" })} /></div>}

      <div className="row g-4">
        {/* Left: Provider + Model */}
        <div className="col-lg-6">
          <div className="card shadow-none border h-100">
            <div className="card-header border-bottom bg-base py-16 px-24">
              <h6 className="text-lg fw-semibold mb-0"><Icon icon="mdi:brain" className="me-2" />AI 모델 설정</h6>
            </div>
            <div className="card-body p-24">
              <div className="mb-16">
                <label className="form-label fw-semibold">AI 제공자</label>
                <select className="form-select" value={settings.provider} onChange={(e) => { handleChange("provider", e.target.value); }}>
                  <option value="google">Google Gemini</option>
                  <option value="openrouter">OpenRouter</option>
                </select>
              </div>
              <div className="mb-16">
                <label className="form-label fw-semibold">모델명</label>
                {settings.provider === "openrouter" ? (
                  <select className="form-select" value={settings.model_name} onChange={(e) => handleChange("model_name", e.target.value)}>
                    {OPENROUTER_MODELS.map((m) => (
                      <option key={m.id} value={m.id}>{m.name} — {m.desc}</option>
                    ))}
                  </select>
                ) : (
                  <select className="form-select" value={settings.model_name} onChange={(e) => handleChange("model_name", e.target.value)}>
                    {GEMINI_MODELS.map((m) => (
                      <option key={m.id} value={m.id}>{m.name} — {m.desc}</option>
                    ))}
                  </select>
                )}
                <small className="text-muted mt-4 d-block">
                  {settings.provider === "google" && (
                    <>
                      <strong>자동 캐스케이드:</strong> 선택한 모델 실패 시 gemini-2.5-flash-lite → gemini-2.5-flash → OpenRouter 순으로 자동 전환됩니다.
                    </>
                  )}
                  {settings.provider === "openrouter" && "OpenRouter 모델 — OPENROUTER_API_KEY 필요"}
                </small>
              </div>
              <div className="mb-16">
                <label className="form-label fw-semibold">API 키</label>
                <div className="input-group">
                  <input type="password" className="form-control" value={settings.api_key || ""} onChange={(e) => handleChange("api_key", e.target.value)} placeholder={`${settings.provider === "google" ? "GEMINI" : "OPENROUTER"}_API_KEY`} />
                  <button className="btn btn-outline-secondary" type="button" onClick={(e) => { const inp = e.target.previousElementSibling; inp.type = inp.type === "password" ? "text" : "password"; }}>
                    <Icon icon="mdi:eye" />
                  </button>
                </div>
                <small className="text-muted mt-4 d-block">비워두면 서버 환경변수(.env.local)의 키를 사용합니다.</small>
              </div>
              {/* Fallback Settings */}
              <div className="mt-16 pt-16 border-top">
                <h6 className="fw-semibold mb-12"><Icon icon="mdi:swap-horizontal" className="me-1" />자동 폴백 설정</h6>
                <div className="d-flex align-items-center justify-content-between mb-12">
                  <div>
                    <span className="fw-semibold">자동 폴백</span>
                    <small className="text-muted d-block">Gemini 장애 시 OpenRouter로 자동 전환</small>
                  </div>
                  <div className="form-check form-switch mb-0">
                    <input className="form-check-input" type="checkbox" checked={settings.auto_fallback !== false} onChange={(e) => handleChange("auto_fallback", e.target.checked)} />
                  </div>
                </div>
                <div className="mb-12">
                  <label className="form-label fw-semibold" style={{ fontSize: "13px" }}>폴백 모델</label>
                  <select className="form-select form-select-sm" value={settings.fallback_model || "anthropic/claude-3.5-haiku"} onChange={(e) => handleChange("fallback_model", e.target.value)}>
                    {OPENROUTER_MODELS.map((m) => (
                      <option key={m.id} value={m.id}>{m.name} — {m.desc}</option>
                    ))}
                  </select>
                  <small className="text-muted mt-4 d-block">Gemini 장애 시 사용할 OpenRouter 모델 (Google 모델 제외)</small>
                </div>
              </div>
              <div className="row g-3">
                <div className="col-6">
                  <label className="form-label fw-semibold">최대 토큰</label>
                  <input type="number" className="form-control" value={settings.max_tokens} onChange={(e) => handleChange("max_tokens", parseInt(e.target.value, 10) || 1000)} />
                </div>
                <div className="col-6">
                  <label className="form-label fw-semibold">Temperature</label>
                  <input type="number" className="form-control" min="0" max="2" step="0.1" value={settings.temperature} onChange={(e) => handleChange("temperature", parseFloat(e.target.value) || 0.7)} />
                </div>
              </div>
              <div className="d-flex align-items-center justify-content-between mt-16 pt-16 border-top">
                <div className="d-flex align-items-center gap-8">
                  <span className="fw-semibold">챗봇 활성화</span>
                  <span className={`badge ${settings.is_active ? "bg-success-focus text-success-600" : "bg-danger-focus text-danger-600"}`}>{settings.is_active ? "ON" : "OFF"}</span>
                </div>
                <div className="form-check form-switch mb-0">
                  <input className="form-check-input" type="checkbox" checked={settings.is_active} onChange={(e) => handleChange("is_active", e.target.checked)} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Prompt + Topics */}
        <div className="col-lg-6">
          <div className="card shadow-none border h-100">
            <div className="card-header border-bottom bg-base py-16 px-24">
              <h6 className="text-lg fw-semibold mb-0"><Icon icon="mdi:text-box" className="me-2" />프롬프트 및 주제</h6>
            </div>
            <div className="card-body p-24">
              <div className="mb-16">
                <label className="form-label fw-semibold">시스템 프롬프트</label>
                <textarea className="form-control" rows={4} value={settings.system_prompt} onChange={(e) => handleChange("system_prompt", e.target.value)} />
              </div>
              <div className="mb-16">
                <label className="form-label fw-semibold">허용 주제 (쉼표 구분)</label>
                <input type="text" className="form-control" value={Array.isArray(settings.allowed_topics) ? settings.allowed_topics.join(", ") : ""} onChange={(e) => handleChange("allowed_topics", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />
              </div>
              <div className="mb-16">
                <label className="form-label fw-semibold">차단 주제 (쉼표 구분)</label>
                <input type="text" className="form-control" value={Array.isArray(settings.blocked_topics) ? settings.blocked_topics.join(", ") : ""} onChange={(e) => handleChange("blocked_topics", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} />
              </div>
              <div>
                <label className="form-label fw-semibold">일일 대화 한도</label>
                <input type="number" className="form-control" value={settings.daily_limit} onChange={(e) => handleChange("daily_limit", parseInt(e.target.value, 10) || 1000)} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Health Check & Fallback Logs */}
      <div className="row g-4 mt-0">
        <div className="col-12">
          <div className="card shadow-none border">
            <div
              className="card-header border-bottom bg-base py-16 px-24 d-flex justify-content-between align-items-center"
              style={{ cursor: "pointer" }}
              onClick={loadFallbackLogs}
            >
              <div className="d-flex align-items-center gap-8">
                <h6 className="text-lg fw-semibold mb-0">
                  <Icon icon="mdi:alert-circle-outline" className="me-2" />로그 확인
                </h6>
                {/* 신호등 아이콘 */}
                {healthStatus ? (
                  <span className="d-flex align-items-center gap-4 ms-8">
                    <span style={{
                      width: 12, height: 12, borderRadius: "50%",
                      backgroundColor: healthStatus.status === "ok" ? "#22c55e" : "#ef4444",
                      display: "inline-block",
                      boxShadow: healthStatus.status === "ok" ? "0 0 6px #22c55e" : "0 0 6px #ef4444",
                    }} />
                    <small className={healthStatus.status === "ok" ? "text-success" : "text-danger"}>
                      {healthStatus.status === "ok" ? "정상 작동 중" : "이슈 발생"}
                    </small>
                    <small className="text-muted">
                      마지막 체크: {healthStatus.checked_at ? new Date(healthStatus.checked_at).toLocaleString("ko-KR") : "-"}
                    </small>
                  </span>
                ) : (
                  <small className="text-muted ms-8">체크 이력 없음</small>
                )}
              </div>
              <div className="d-flex align-items-center gap-2">
                <button className="btn btn-sm btn-outline-primary" onClick={(e) => { e.stopPropagation(); runHealthCheck(); }} disabled={healthLoading}>
                  {healthLoading ? "체크 중..." : "지금 체크"}
                </button>
                <Icon icon={logsOpen ? "mdi:chevron-up" : "mdi:chevron-down"} className="text-xl" />
              </div>
            </div>
            {logsOpen && (
              <div className="card-body p-24">
                {logsLoading ? (
                  <div className="text-center py-3"><div className="spinner-border spinner-border-sm text-primary" /></div>
                ) : fallbackLogs.length === 0 ? (
                  <div className="text-center text-muted py-3">
                    <Icon icon="mdi:check-circle-outline" className="text-success text-3xl mb-2 d-block mx-auto" />
                    폴백 이벤트가 없습니다. 정상 운영 중입니다.
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table bordered-table mb-0" style={{ fontSize: "13px" }}>
                      <thead>
                        <tr><th>시간</th><th>상태</th><th>설명</th></tr>
                      </thead>
                      <tbody>
                        {fallbackLogs.map((log) => (
                          <tr key={log.id}>
                            <td className="text-nowrap">{new Date(log.created_at).toLocaleString("ko-KR")}</td>
                            <td>
                              <span className="badge bg-warning-focus text-warning-600">
                                {log.original_provider} → {log.fallback_provider}
                              </span>
                            </td>
                            <td>{log.description || log.error_message || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Example Questions */}
      <div className="row g-4 mt-0">
        <div className="col-12">
          <div className="card shadow-none border">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex justify-content-between align-items-center">
              <h6 className="text-lg fw-semibold mb-0"><Icon icon="mdi:chat-question" className="me-2" />예시 질문 관리</h6>
              <button className="btn btn-sm btn-primary-600" onClick={() => {
                const q = prompt("추가할 예시 질문을 입력하세요:");
                if (q && q.trim()) {
                  const current = Array.isArray(settings.example_questions) ? settings.example_questions : [];
                  handleChange("example_questions", [...current, q.trim()]);
                }
              }}>
                질문 추가
              </button>
            </div>
            <div className="card-body p-24">
              <p className="text-muted mb-16" style={{ fontSize: "13px" }}>메인 페이지 챗봇에 표시되는 추천 질문 목록입니다. 드래그하여 순서를 변경할 수 있습니다.</p>
              {(!settings.example_questions || settings.example_questions.length === 0) ? (
                <div className="text-center text-muted py-4">
                  <Icon icon="mdi:chat-question-outline" className="text-4xl mb-2 d-block mx-auto" />
                  등록된 예시 질문이 없습니다. 기본 질문이 표시됩니다.
                </div>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {settings.example_questions.map((q, idx) => (
                    <div key={idx} className="d-flex align-items-center gap-2 p-12 border radius-8 bg-base">
                      <span className="badge bg-primary-600 text-white d-flex align-items-center justify-content-center" style={{ width: "30px", height: "30px", borderRadius: "6px", fontSize: "14px", padding: 0, flexShrink: 0 }}>{idx + 1}</span>
                      <input
                        type="text"
                        className="form-control form-control-sm border-0 bg-transparent"
                        value={q}
                        onChange={(e) => {
                          const updated = [...settings.example_questions];
                          updated[idx] = e.target.value;
                          handleChange("example_questions", updated);
                        }}
                      />
                      <button className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center" title="위로"
                        style={{ width: "30px", height: "30px", padding: 0, flexShrink: 0 }}
                        disabled={idx === 0}
                        onClick={() => {
                          const updated = [...settings.example_questions];
                          [updated[idx - 1], updated[idx]] = [updated[idx], updated[idx - 1]];
                          handleChange("example_questions", updated);
                        }}>
                        <Icon icon="mdi:arrow-up" style={{ fontSize: "18px" }} />
                      </button>
                      <button className="btn btn-sm btn-outline-secondary d-flex align-items-center justify-content-center" title="아래로"
                        style={{ width: "30px", height: "30px", padding: 0, flexShrink: 0 }}
                        disabled={idx === settings.example_questions.length - 1}
                        onClick={() => {
                          const updated = [...settings.example_questions];
                          [updated[idx], updated[idx + 1]] = [updated[idx + 1], updated[idx]];
                          handleChange("example_questions", updated);
                        }}>
                        <Icon icon="mdi:arrow-down" style={{ fontSize: "18px" }} />
                      </button>
                      <button className="btn btn-sm btn-outline-danger d-flex align-items-center justify-content-center" title="삭제"
                        style={{ width: "30px", height: "30px", padding: 0, flexShrink: 0 }}
                        onClick={() => {
                          const updated = settings.example_questions.filter((_, i) => i !== idx);
                          handleChange("example_questions", updated);
                        }}>
                        <Icon icon="mdi:trash-can-outline" style={{ fontSize: "18px" }} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-24">
        <button className="btn btn-primary-600 px-4 py-12" onClick={handleSave} disabled={saving}>
          {saving ? "저장 중..." : "설정 저장"}
        </button>
      </div>
    </>
  );
}

/* ─── Documents Tab ─── */
function DocumentsTab() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [createTitle, setCreateTitle] = useState("");
  const [createContent, setCreateContent] = useState("");
  const [editingDoc, setEditingDoc] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });

  const fetchDocs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/chatbot/documents");
      if (res.ok) { const data = await res.json(); setDocuments(data.documents || []); }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchDocs(); }, [fetchDocs]);

  const handleCreate = async () => {
    if (!createContent.trim()) return;
    setMessage({ type: "", text: "" });
    try {
      const res = await fetch("/api/admin/chatbot/documents", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: createTitle, content: createContent }),
      });
      if (res.ok) {
        setShowCreate(false); setCreateTitle(""); setCreateContent("");
        setMessage({ type: "success", text: "문서가 추가되었습니다. 임베딩 재생성이 필요합니다." });
        fetchDocs();
      } else { const d = await res.json(); setMessage({ type: "danger", text: d.error }); }
    } catch { setMessage({ type: "danger", text: "네트워크 오류" }); }
  };

  const handleUpdate = async () => {
    if (!editingDoc) return;
    try {
      const res = await fetch("/api/admin/chatbot/documents", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingDoc.id, title: editTitle, content: editContent }),
      });
      if (res.ok) {
        setEditingDoc(null);
        setMessage({ type: "success", text: "문서가 수정되었습니다. 임베딩 재생성이 필요합니다." });
        fetchDocs();
      }
    } catch { setMessage({ type: "danger", text: "네트워크 오류" }); }
  };

  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    // 첫 클릭: 확인 요청, 두 번째 클릭: 실제 삭제
    if (deletingId !== id) {
      setDeletingId(id);
      return;
    }
    setDeletingId(null);
    try {
      const res = await fetch("/api/admin/chatbot/documents", {
        method: "DELETE", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setMessage({ type: "success", text: "문서가 삭제되었습니다." });
        fetchDocs();
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage({ type: "danger", text: data.error || `삭제 실패 (${res.status})` });
      }
    } catch (err) {
      setMessage({ type: "danger", text: "네트워크 오류: " + err.message });
    }
  };

  const startEdit = (doc) => { setEditingDoc(doc); setEditTitle(doc.title || ""); setEditContent(doc.content || ""); };

  return (
    <>
      {message.text && <div className={`alert alert-${message.type} alert-dismissible mb-3`}>{message.text}<button className="btn-close" onClick={() => setMessage({ type: "", text: "" })} /></div>}

      <div className="d-flex justify-content-between align-items-center mb-3">
        <p className="text-muted mb-0">총 {documents.length}개 문서 (챗봇 RAG 검색 대상)</p>
        <button className="btn btn-sm btn-primary-600" onClick={() => setShowCreate(true)}>
          <Icon icon="ri:add-line" className="me-1" />문서 추가
        </button>
      </div>

      {/* Create Card */}
      {showCreate && (
        <div className="card border-success shadow-none mb-4">
          <div className="card-header bg-success-600 text-white d-flex justify-content-between">
            <span>새 RAG 문서 추가</span>
            <button className="btn-close btn-close-white" onClick={() => setShowCreate(false)} />
          </div>
          <div className="card-body p-24">
            <div className="mb-16">
              <label className="form-label fw-semibold">제목</label>
              <input type="text" className="form-control" value={createTitle} onChange={(e) => setCreateTitle(e.target.value)} placeholder="문서 제목" />
            </div>
            <div className="mb-16">
              <label className="form-label fw-semibold">내용 (챗봇이 참조할 텍스트)</label>
              <textarea className="form-control" rows={6} value={createContent} onChange={(e) => setCreateContent(e.target.value)} placeholder="대회 요강 관련 내용을 입력하세요..." />
            </div>
            <button className="btn btn-success-600" onClick={handleCreate} disabled={!createContent.trim()}>추가</button>
          </div>
        </div>
      )}

      {/* Edit Card */}
      {editingDoc && (
        <div className="card border-primary shadow-none mb-4">
          <div className="card-header bg-primary text-white d-flex justify-content-between">
            <span>문서 수정</span>
            <button className="btn-close btn-close-white" onClick={() => setEditingDoc(null)} />
          </div>
          <div className="card-body p-24">
            <div className="mb-16">
              <label className="form-label fw-semibold">제목</label>
              <input type="text" className="form-control" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </div>
            <div className="mb-16">
              <label className="form-label fw-semibold">내용</label>
              <textarea className="form-control" rows={6} value={editContent} onChange={(e) => setEditContent(e.target.value)} />
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-primary" onClick={handleUpdate}>저장</button>
              <button className="btn btn-secondary" onClick={() => setEditingDoc(null)}>취소</button>
            </div>
          </div>
        </div>
      )}

      {/* Documents Table */}
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : documents.length === 0 ? (
        <div className="card shadow-none border"><div className="card-body text-center text-muted py-5">등록된 RAG 문서가 없습니다.</div></div>
      ) : (
        <div className="card shadow-none border">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table bordered-table mb-0">
                <thead>
                  <tr><th>제목</th><th>내용 미리보기</th><th>임베딩</th><th>관리</th></tr>
                </thead>
                <tbody>
                  {documents.map((doc) => (
                    <tr key={doc.id}>
                      <td className="fw-medium">{doc.title || "(제목 없음)"}</td>
                      <td className="text-muted">{(doc.content || "").substring(0, 80)}{doc.content?.length > 80 ? "..." : ""}</td>
                      <td>
                        {doc.has_embedding
                          ? <span className="badge bg-success-focus text-success-600">완료</span>
                          : <span className="badge bg-warning-focus text-warning-600">생성 중</span>
                        }
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => startEdit(doc)}>수정</button>
                          <button
                            className={`btn btn-sm ${deletingId === doc.id ? "btn-danger" : "btn-outline-danger"}`}
                            onClick={() => handleDelete(doc.id)}
                            onBlur={() => setDeletingId(null)}
                          >
                            {deletingId === doc.id ? "삭제하시겠습니까?" : "삭제"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="alert alert-info mt-3 d-flex align-items-center gap-2">
        <Icon icon="mdi:information" className="text-xl" />
        <span>문서를 추가하거나 수정하면 임베딩이 자동으로 생성됩니다. 별도 작업이 필요 없습니다.</span>
      </div>
    </>
  );
}
