"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import Color from "@tiptap/extension-color";
import TextStyle from "@tiptap/extension-text-style";
import { useEffect, useCallback } from "react";
import "./RichTextEditor.css";

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  const addImage = useCallback(() => {
    const url = window.prompt("이미지 URL을 입력하세요:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("링크 URL을 입력하세요:", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const BTN = "rte-btn";
  const ACT = "rte-btn rte-btn--active";

  return (
    <div className="rte-toolbar">
      <div className="rte-group">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? ACT : BTN} title="굵게">
          <b>B</b>
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? ACT : BTN} title="기울임">
          <i>I</i>
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? ACT : BTN} title="밑줄">
          <u>U</u>
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? ACT : BTN} title="취소선">
          <s>S</s>
        </button>
      </div>

      <div className="rte-group">
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive("heading", { level: 2 }) ? ACT : BTN} title="제목 2">
          H2
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive("heading", { level: 3 }) ? ACT : BTN} title="제목 3">
          H3
        </button>
        <button type="button" onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive("paragraph") ? ACT : BTN} title="본문">
          P
        </button>
      </div>

      <div className="rte-group">
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={editor.isActive({ textAlign: "left" }) ? ACT : BTN} title="왼쪽">
          ⫷
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={editor.isActive({ textAlign: "center" }) ? ACT : BTN} title="가운데">
          ⫿
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={editor.isActive({ textAlign: "right" }) ? ACT : BTN} title="오른쪽">
          ⫸
        </button>
      </div>

      <div className="rte-group">
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? ACT : BTN} title="글머리 기호">
          •―
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? ACT : BTN} title="번호 목록">
          1.
        </button>
      </div>

      <div className="rte-group">
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? ACT : BTN} title="인용">
          &ldquo;&rdquo;
        </button>
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={BTN} title="구분선">
          ―
        </button>
      </div>

      <div className="rte-group">
        <button type="button" onClick={setLink}
          className={editor.isActive("link") ? ACT : BTN} title="링크">
          🔗
        </button>
        <button type="button" onClick={addImage} className={BTN} title="이미지">
          🖼️
        </button>
      </div>

      <div className="rte-group">
        <input
          type="color"
          onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
          value={editor.getAttributes("textStyle").color || "#000000"}
          className="rte-color-picker"
          title="글자 색"
        />
      </div>

      <div className="rte-group">
        <button type="button" onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()} className={BTN} title="되돌리기">
          ↩
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()} className={BTN} title="다시 실행">
          ↪
        </button>
      </div>
    </div>
  );
};

export default function RichTextEditor({ value, onChange, placeholder = "내용을 입력하세요...", minHeight = "300px" }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, HTMLAttributes: { target: "_blank", rel: "noopener noreferrer" } }),
      Image.configure({ inline: false, allowBase64: true }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
    editorProps: {
      attributes: {
        class: "rte-content",
        style: `min-height: ${minHeight}`,
      },
    },
  });

  useEffect(() => {
    if (editor && value !== undefined && editor.getHTML() !== value) {
      editor.commands.setContent(value || "", false);
    }
  }, [value, editor]);

  return (
    <div className="rte-wrapper">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
