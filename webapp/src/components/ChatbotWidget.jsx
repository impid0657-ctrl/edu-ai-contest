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

  // 타이핑 효과: typing 플래그가 있는 메시지를 setInterval로 점진적 표시
  useEffect(() => {
    const lastMsg = messages[messages.length - 1];
    if (!lastMsg?.typing || !lastMsg.fullContent) return;

    const codePoints = Array.from(lastMsg.fullContent);
    let idx = 0;

    const timer = setInterval(() => {
      idx += 2;
      if (idx >= codePoints.length) {
        clearInterval(timer);
        setMessages((prev) => {
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          updated[lastIdx] = { ...updated[lastIdx], content: lastMsg.fullContent, typing: false };
          return updated;
        });
        setIsLoading(false);
      } else {
        const displayed = codePoints.slice(0, idx).join("");
        setMessages((prev) => {
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          updated[lastIdx] = { ...updated[lastIdx], content: displayed };
          return updated;
        });
      }
    }, 20);

    return () => clearInterval(timer);
  }, [messages.length]);

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

      // fullText를 저장하면 useEffect가 타이핑 효과 처리
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "", fullContent: fullText, timestamp: new Date(), typing: true },
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "네트워크 오류가 발생했습니다.", timestamp: new Date() },
      ]);
    } finally {
      // 타이핑 효과 중이면 useEffect에서 isLoading 해제
      const lastMsg = messages[messages.length - 1];
      if (!lastMsg?.typing) {
        setIsLoading(false);
      }
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
      // 링크 앞 텍스트
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }
      // 링크
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
    // 남은 텍스트
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
