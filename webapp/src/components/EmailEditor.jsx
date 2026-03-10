"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill-new/dist/quill.snow.css";

/**
 * Rich Text Email Editor
 * Quill WYSIWYG 에디터 (SSR 비활성화)
 * 이메일 템플릿 편집용 — 볼드, 이탤릭, 색상, 정렬, 링크, 이미지 등 지원
 */

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div className="border rounded p-4 text-center text-muted" style={{ minHeight: "200px" }}>
      <div className="spinner-border spinner-border-sm me-2" />에디터 로딩 중...
    </div>
  ),
});

const TOOLBAR_OPTIONS = [
  [{ font: [] }],
  [{ header: [1, 2, 3, 4, false] }],
  [{ size: ["small", false, "large", "huge"] }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  ["blockquote", "code-block"],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ align: [] }],
  [{ direction: "rtl" }],
  ["link", "image", "video"],
  ["clean"],
];

export default function EmailEditor({ value, onChange, placeholder }) {
  const modules = useMemo(() => ({
    toolbar: TOOLBAR_OPTIONS,
  }), []);

  return (
    <div className="email-editor-wrapper">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder || "이메일 내용을 입력하세요..."}
        style={{ minHeight: "250px" }}
      />
      <style jsx global>{`
        .email-editor-wrapper .ql-container {
          min-height: 250px;
          font-family: 'Apple SD Gothic Neo', -apple-system, sans-serif;
          font-size: 14px;
        }
        .email-editor-wrapper .ql-editor {
          min-height: 250px;
        }
        .email-editor-wrapper .ql-toolbar {
          border-radius: 8px 8px 0 0;
          background: #f8f9fa;
        }
        .email-editor-wrapper .ql-container {
          border-radius: 0 0 8px 8px;
        }
      `}</style>
    </div>
  );
}
