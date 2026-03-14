"use client";

import { useState, useRef, useEffect } from "react";
import { flushSync } from "react-dom";

/**
 * ChatbotWidget — Floating chat button + panel on all public pages.
 * Bottom-right fixed position. JSON response + flushSync typing effect.
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
        return;
      }

      const data = await res.json();
      const fullText = data.response || data.error || "응답을 받지 못했습니다.";

      // 빈 봇 메시지 추가
      flushSync(() => {
        setMessages((prev) => [
          ...prev,
          { role: "bot", content: "", timestamp: new Date() },
        ]);
      });

      // flushSync 기반 타이핑 효과 — React 18 배칭 강제 해제
      const codePoints = Array.from(fullText);
      for (let i = 0; i < codePoints.length; i += 3) {
        const displayed = codePoints.slice(0, i + 3).join("");
        flushSync(() => {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { ...updated[updated.length - 1], content: displayed };
            return updated;
          });
        });
        await new Promise((r) => setTimeout(r, 15));
      }

      // 최종 전체 텍스트 확정
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { ...updated[updated.length - 1], content: fullText };
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

  // 마크다운 링크 [텍스트](URL)를 클릭 가능한 <a> 태그로 변환
  const renderMessageContent = (text) => {
    const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      parts.push(
        <a
          key={match.index}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#1a6dd4",
            fontWeight: 700,
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          {match[1]}
        </a>
      );
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }
    return parts.length > 0 ? parts : text;
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
                <div className="chatbot-msg-content">{renderMessageContent(msg.content)}</div>
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
