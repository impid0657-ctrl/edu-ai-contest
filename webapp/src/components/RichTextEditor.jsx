"use client";

import dynamic from "next/dynamic";
import { useMemo, useState, useEffect } from "react";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "200px", border: "1px solid #ccc", borderRadius: "0 0 8px 8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
      에디터 로딩 중...
    </div>
  ),
});

/**
 * Rich Text Editor — wraps react-quill-new
 * Props:
 *   value, onChange, placeholder, height, simple
 */
export default function RichTextEditor({
  value,
  onChange,
  placeholder = "내용을 입력하세요",
  height = "200px",
  simple = false,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const modules = useMemo(() => ({
    toolbar: simple
      ? [
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link"],
          ["clean"],
        ]
      : [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ align: [] }],
          ["link", "image"],
          ["blockquote", "code-block"],
          ["clean"],
        ],
  }), [simple]);

  const formats = simple
    ? ["bold", "italic", "underline", "list", "link"]
    : [
        "header", "bold", "italic", "underline", "strike",
        "color", "background", "list", "indent", "align",
        "link", "image", "blockquote", "code-block",
      ];

  if (!mounted) {
    return (
      <div style={{ height, border: "1px solid #ccc", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#999" }}>
        에디터 로딩 중...
      </div>
    );
  }

  return (
    <div className="rich-editor-wrapper">
      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={onChange}
        modules={modules}
        formats={formats}
        placeholder={placeholder}
        style={{ height }}
      />
      <style jsx global>{`
        .rich-editor-wrapper { margin-bottom: 50px; }
        .rich-editor-wrapper .ql-container { font-size: 15px; }
        .rich-editor-wrapper .ql-editor { min-height: ${height}; }
        .rich-editor-wrapper .ql-toolbar { border-radius: 8px 8px 0 0; background: #f8f9fa; }
        .rich-editor-wrapper .ql-container { border-radius: 0 0 8px 8px; }
      `}</style>
    </div>
  );
}
