"use client";

import { useState, useRef, useEffect } from "react";

/**
 * ChatbotWidget — Floating chat button + panel on all public pages.
 * Bottom-right fixed position. Streaming SSE. Zero inline styles.
 */

function generateSessionId() {
  return "sess_" + Math.random().toString(36).substring(2, 15);
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content: "안녕하세요! 제8회 교육 공공데이터 AI활용대회 안내 챗봇입니다. 대회 관련 궁금한 점을 물어보세요.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(() => generateSessionId());
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
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

      // Check if blocked (non-streaming JSON response)
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

      // Streaming SSE response
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let botMessage = "";

      // Add empty bot message placeholder
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
                    updated[lastIdx] = {
                      ...updated[lastIdx],
                      content: botMessage,
                    };
                  }
                  return updated;
                });
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }
      }

      // Finalize streaming message
      setMessages((prev) => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        if (updated[lastIdx]?.streaming) {
          updated[lastIdx] = {
            ...updated[lastIdx],
            streaming: false,
          };
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          type="button"
          className="chatbot-fab"
          onClick={() => setIsOpen(true)}
          aria-label="대회 안내 챗봇 열기"
        >
          💬
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="chatbot-panel">
          {/* Header */}
          <div className="chatbot-header">
            <span className="chatbot-header-title">🤖 대회 안내 챗봇</span>
            <button
              type="button"
              className="chatbot-close"
              onClick={() => setIsOpen(false)}
              aria-label="챗봇 닫기"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chatbot-msg ${msg.role === "user" ? "chatbot-msg-user" : "chatbot-msg-bot"}`}
              >
                <div className="chatbot-msg-content">{msg.content}</div>
                <div className="chatbot-msg-time">{formatTime(msg.timestamp)}</div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role !== "bot" && (
              <div className="chatbot-msg chatbot-msg-bot">
                <div className="chatbot-msg-content chatbot-typing">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chatbot-input-area">
            <input
              ref={inputRef}
              type="text"
              className="chatbot-input"
              placeholder="대회에 대해 궁금한 점을 물어보세요..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button
              type="button"
              className="chatbot-send"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  );
}
