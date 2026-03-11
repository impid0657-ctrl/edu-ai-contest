"use client";

import { useState, useRef, useEffect } from "react";

/**
 * ChatbotEmbed — OpenAI-style inline chatbot section.
 * Evalo design tokens + clean modern UI.
 * SSE streaming via /api/chat.
 */

function generateSessionId() {
  return "embed_" + Math.random().toString(36).substring(2, 15);
}

const DEFAULT_QUESTIONS = [
  "참가 자격은 어떻게 되나요?",
  "AI 이용권은 어떻게 받나요?",
  "작품 접수 마감일은 언제인가요?",
  "팀으로 참가할 수 있나요?",
];

export default function ChatbotEmbed() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => generateSessionId());
  const [exampleQuestions, setExampleQuestions] = useState(DEFAULT_QUESTIONS);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);

  // 자주 묻는 질문 동적 로드
  useEffect(() => {
    fetch("/api/settings/chatbot-questions")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.questions) && data.questions.length > 0) {
          setExampleQuestions(data.questions);
        }
      })
      .catch(() => { /* 실패 시 기본값 유지 */ });
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const MAX_INPUT_LENGTH = 300;

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = text.trim();
    if (userMessage.length > MAX_INPUT_LENGTH) {
      setMessages((prev) => [...prev, { role: "assistant", content: `입력 글자수가 ${MAX_INPUT_LENGTH}자를 초과했습니다. 질문을 간결하게 줄여주세요.` }]);
      return;
    }
    setInput("");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage, timestamp: new Date() },
    ]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, session_id: sessionId }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: errData.error || "오류가 발생했습니다.", timestamp: new Date() },
        ]);
        setIsLoading(false);
        return;
      }

      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: data.response || data.error, timestamp: new Date() },
        ]);
        setIsLoading(false);
        return;
      }

      // SSE Streaming
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let botMessage = "";

      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "", timestamp: new Date(), streaming: true },
      ]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                botMessage += parsed.content;
                setMessages((prev) => {
                  const updated = [...prev];
                  const lastIdx = updated.length - 1;
                  if (updated[lastIdx]?.streaming) {
                    updated[lastIdx] = { ...updated[lastIdx], content: botMessage };
                  }
                  return updated;
                });
              }
            } catch { /* skip malformed */ }
          }
        }
      }

      setMessages((prev) => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        if (updated[lastIdx]?.streaming) {
          updated[lastIdx] = { ...updated[lastIdx], streaming: false };
        }
        return updated;
      });
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "네트워크 오류가 발생했습니다.", timestamp: new Date() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => sendMessage(input);
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };
  const handleExampleClick = (q) => sendMessage(q);

  const hasConversation = messages.length > 0;

  return (
    <div className="chatbot-embed-section over-hidden mt-75 mb-80" style={{
      background: "#ffffff",
      padding: "80px 0",
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-10 col-md-12">

            {/* Title */}
            <div className="text-center mb-40">
              <span className="theme-color f-700 d-block mb-10">AI 상담 챗봇</span>
              <h3 className="f-700 mb-15">대회에 대해 궁금한 점을 물어보세요</h3>
              <p className="text-muted">참가 자격, 일정, 접수 방법 등 대회 요강 관련 질문에 24시간 답변해 드립니다</p>
            </div>

            {/* Chat Area — 대화가 있을 때만 표시 */}
            {hasConversation && (
              <div ref={chatContainerRef} className="secondary-border01 mb-25" style={{
                borderRadius: "16px",
                maxHeight: "600px",
                overflowY: "auto",
                padding: "24px",
                background: "#fff",
              }}>
                {messages.map((msg, idx) => (
                  <div key={idx} style={{
                    display: "flex",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                    marginBottom: "16px",
                  }}>
                    {msg.role === "bot" && (
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "50%",
                        background: "var(--theme-color, #2161a6)", color: "#fff",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "14px", fontWeight: 700, marginRight: "12px", flexShrink: 0,
                        marginTop: "2px",
                      }}>AI</div>
                    )}
                    <div style={{
                      maxWidth: "75%",
                      padding: "12px 18px",
                      borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      background: msg.role === "user" ? "var(--theme-color, #2161a6)" : "#f1f1f5",
                      color: msg.role === "user" ? "#fff" : "#333",
                      fontSize: "15px", lineHeight: "1.6",
                      whiteSpace: "pre-wrap", wordBreak: "break-word",
                    }}>
                      {msg.content}
                      {msg.streaming && (
                        <span style={{
                          display: "inline-block", width: "8px", height: "16px",
                          background: "var(--theme-color, #2161a6)", marginLeft: "2px",
                          animation: "chatbotCursorBlink 1s infinite",
                          verticalAlign: "text-bottom", borderRadius: "1px",
                        }}></span>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isLoading && messages[messages.length - 1]?.role !== "bot" && (
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "50%",
                      background: "var(--theme-color, #2161a6)", color: "#fff",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "14px", fontWeight: 700, flexShrink: 0,
                    }}>AI</div>
                    <div style={{ display: "flex", gap: "4px", padding: "12px 18px", background: "#f1f1f5", borderRadius: "18px" }}>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#999", animation: "chatbotDot 1.4s infinite ease-in-out both" }}></span>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#999", animation: "chatbotDot 1.4s infinite ease-in-out both", animationDelay: "0.2s" }}></span>
                      <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#999", animation: "chatbotDot 1.4s infinite ease-in-out both", animationDelay: "0.4s" }}></span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Input Area — OpenAI style */}
            <div className="secondary-border01" style={{
              borderRadius: "28px",
              padding: "6px 6px 6px 24px",
              background: "#fff",
              display: "flex",
              alignItems: "center",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            }}>
              <input
                ref={inputRef}
                type="text"
                placeholder="무엇이든 물어보세요..."
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, MAX_INPUT_LENGTH))}
                onKeyDown={handleKeyDown}
                maxLength={MAX_INPUT_LENGTH}
                disabled={isLoading}
                style={{
                  flex: 1, border: "none", outline: "none", fontSize: "16px",
                  background: "transparent", padding: "12px 0", color: "#333",
                }}
              />
              {input.length > 0 && (
                <span style={{ fontSize: "12px", color: input.length >= MAX_INPUT_LENGTH ? "#ef4444" : "#999", whiteSpace: "nowrap", marginRight: "8px" }}>
                  {input.length}/{MAX_INPUT_LENGTH}
                </span>
              )}
              <button
                type="button"
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="theme-bg"
                style={{
                  width: "48px", height: "48px", borderRadius: "50%",
                  border: "none", color: "#fff", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  opacity: (!input.trim() || isLoading) ? 0.5 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>

            {/* 자주 묻는 질문 — 대화 전에만 표시 */}
            {!hasConversation && (
              <div className="d-flex flex-wrap justify-content-center" style={{ marginTop: "40px", gap: "12px" }}>
                {exampleQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleExampleClick(q)}
                    disabled={isLoading}
                    className="secondary-border01 transition3"
                    style={{
                      padding: "10px 20px",
                      borderRadius: "24px",
                      background: "#fff",
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#555",
                      cursor: "pointer",
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes chatbotCursorBlink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes chatbotDot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div >
  );
}
