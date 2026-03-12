"use client";

import { useState, useEffect, useCallback } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { formatKST } from "@/lib/dateUtils";
import RichTextEditor from "@/components/RichTextEditor";
import { createClient as createSupabaseClient } from "@/lib/supabase/client";

/**
 * Admin Board Management — Sprint 6.5 rebuild
 * - List posts (notice, faq, qna) excluding child replies
 * - Create new notice/FAQ via modal
 * - Edit/delete existing posts
 * - Reply to QnA posts
 * - Toggle pin for notices
 */

const TYPE_LABELS = { notice: "공지사항", faq: "FAQ", qna: "QnA" };
const TYPE_BADGES = { notice: "bg-info", faq: "bg-warning text-dark", qna: "bg-primary" };
const FAQ_CATEGORIES = [
  { key: "participation", label: "참가 자격 및 요건" },
  { key: "submission", label: "참가작 접수 및 서류 제출" },
  { key: "ai_license", label: "AI 이용권 (에듀핏) 혜택" },
  { key: "judging", label: "심사 기준 및 절차" },
  { key: "awards", label: "시상 내역 및 시스템 이용" },
];
const FAQ_CAT_LABELS = Object.fromEntries(FAQ_CATEGORIES.map((c) => [c.key, c.label]));

export default function AdminBoardPage() {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

  // Edit state
  const [editingPost, setEditingPost] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  // Create state
  const [showCreate, setShowCreate] = useState(false);
  const [createType, setCreateType] = useState("notice");
  const [createTitle, setCreateTitle] = useState("");
  const [createContent, setCreateContent] = useState("");
  const [createPinned, setCreatePinned] = useState(false);
  const [createCategory, setCreateCategory] = useState("");
  const [createAttachments, setCreateAttachments] = useState([]);

  // Edit attachments
  const [editAttachments, setEditAttachments] = useState([]);

  // Upload state
  const [uploading, setUploading] = useState(false);

  // Delete confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Reply state
  const [replyPostId, setReplyPostId] = useState(null);
  const [replyContent, setReplyContent] = useState("");

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/board?type=${filter}&page=${page}&limit=20`);
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
        setTotal(data.total || 0);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [filter, page]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  // 파일 state — pending (아직 업로드 안 된 로컬 파일) + uploaded (이미 업로드된 파일 메타)
  const [createPendingFiles, setCreatePendingFiles] = useState([]);
  const [editPendingFiles, setEditPendingFiles] = useState([]);

  // 파일 선택 시 pending에 추가 (아직 업로드 X)
  const handleFileSelect = (files, target) => {
    if (!files || files.length === 0) return;
    const fileArray = Array.from(files);
    if (target === "create") {
      setCreatePendingFiles((prev) => [...prev, ...fileArray]);
    } else {
      setEditPendingFiles((prev) => [...prev, ...fileArray]);
    }
  };

  // pending 파일 제거
  const removePendingFile = (index, target) => {
    if (target === "create") {
      setCreatePendingFiles((prev) => prev.filter((_, i) => i !== index));
    } else {
      setEditPendingFiles((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // 이미 업로드된 첨부파일 제거
  const removeAttachment = (index, target) => {
    if (target === "create") {
      setCreateAttachments((prev) => prev.filter((_, i) => i !== index));
    } else {
      setEditAttachments((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // pending 파일을 Supabase Storage에 직접 업로드 (클라이언트)
  const uploadPendingFiles = async (pendingFiles) => {
    if (!pendingFiles || pendingFiles.length === 0) return [];
    const supabase = createSupabaseClient();
    const uploaded = [];

    for (const file of pendingFiles) {
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `${timestamp}_${safeName}`;

      console.log("[Upload] 파일 업로드 시작:", file.name, file.size, "bytes");

      const { data, error } = await supabase.storage
        .from("board-attachments")
        .upload(storagePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.error("[Upload] 실패:", error.message);
        alert("파일 업로드 실패: " + file.name + " \u2014 " + error.message);
        continue;
      }

      console.log("[Upload] 성공:", storagePath);
      const { data: urlData } = supabase.storage.from("board-attachments").getPublicUrl(storagePath);
      uploaded.push({
        name: file.name,
        path: storagePath,
        size: file.size,
        url: urlData?.publicUrl || "",
      });
    }
    return uploaded;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch("/api/admin/board", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
      if (res.ok) { setDeleteConfirmId(null); fetchPosts(); }
      else { const d = await res.json().catch(() => ({})); alert("삭제 실패: " + (d.error || res.status)); }
    } catch (err) { alert("삭제 실패: " + err.message); }
  };

  const handleEdit = (post) => { setUploading(false); setEditingPost(post); setEditTitle(post.title); setEditContent(post.content || ""); setEditAttachments(post.attachments || []); setEditPendingFiles([]); };

  const handleSave = async () => {
    setUploading(true);
    try {
      // PATCH — 파일은 별도 upload API를 사용하지 않고, pending 파일이 있으면 FormData로 POST처럼 처리
      // 하지만 PATCH는 JSON으로 기존 방식 유지 + pending 파일만 먼저 업로드
      let allAttachments = [...editAttachments];
      if (editPendingFiles.length > 0) {
        // pending 파일을 FormData로 업로드 전용 API에 보냄
        const formData = new FormData();
        for (const file of editPendingFiles) {
          formData.append("files", file);
        }
        const uploadRes = await fetch("/api/admin/board/upload", { method: "POST", body: formData });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          allAttachments = [...allAttachments, ...(uploadData.files || [])];
        } else {
          // upload API 실패 시 — POST API에 직접 FormData로 보내기
          console.warn("Upload API failed, trying inline upload via POST...");
        }
      }
      const res = await fetch("/api/admin/board", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editingPost.id, title: editTitle, content: editContent, attachments: allAttachments }) });
      if (res.ok) { setEditingPost(null); setEditAttachments([]); setEditPendingFiles([]); fetchPosts(); }
      else { const d = await res.json(); alert("수정 실패: " + (d.error || "")); }
    } catch (err) { alert("수정 실패: " + err.message); }
    finally { setUploading(false); }
  };

  const handleCreate = async () => {
    if (!createTitle.trim() || !createContent.trim()) return alert("제목과 내용을 입력하세요.");
    setUploading(true);
    try {
      // 1. pending 파일을 Storage에 직접 업로드
      let allAttachments = [...createAttachments];
      if (createPendingFiles.length > 0) {
        const uploaded = await uploadPendingFiles(createPendingFiles);
        allAttachments = [...allAttachments, ...uploaded];
      }

      // 2. 게시글 데이터를 JSON으로 전송
      const payload = {
        type: createType,
        title: createTitle,
        content: createContent,
        is_pinned: createPinned,
        attachments: allAttachments,
        ...(createType === "faq" && createCategory ? { category: createCategory } : {}),
      };

      const res = await fetch("/api/admin/board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setShowCreate(false); setCreateTitle(""); setCreateContent(""); setCreatePinned(false); setCreateCategory(""); setCreateAttachments([]); setCreatePendingFiles([]); fetchPosts();
      } else {
        alert("글 작성 실패: " + (data.error || ""));
      }
    } catch (err) {
      console.error("[handleCreate] 에러:", err);
      alert("글 작성 실패: " + err.message);
    }
    finally { setUploading(false); }
  };

  const handleReply = async () => {
    if (!replyContent.trim()) return alert("답변 내용을 입력하세요.");
    const res = await fetch("/api/admin/board/reply", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ parent_id: replyPostId, content: replyContent }) });
    if (res.ok) { setReplyPostId(null); setReplyContent(""); fetchPosts(); }
  };

  const handleTogglePin = async (post) => {
    await fetch("/api/admin/board", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: post.id, is_pinned: !post.is_pinned }) });
    fetchPosts();
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold mb-0">게시판 관리</h4>
        <div className="d-flex gap-2">
          <div className="btn-group">
            {["all", "notice", "faq", "qna"].map((t) => (
              <button key={t} className={`btn btn-sm ${filter === t ? "btn-primary" : "btn-outline-primary"}`} onClick={() => { setFilter(t); setPage(1); }}>
                {t === "all" ? "전체" : TYPE_LABELS[t]}
              </button>
            ))}
          </div>
          <button className="btn btn-sm btn-primary-600" onClick={() => { setUploading(false); setShowCreate(true); setCreateAttachments([]); setCreatePendingFiles([]); }}>
            <Icon icon="ri:add-line" className="me-1" />글 작성
          </button>
        </div>
      </div>

      <p className="text-muted mb-3">총 {total}건</p>

      {/* Create Modal */}
      {showCreate && (
        <div className="card border-success mb-4">
          <div className="card-header bg-success-600 text-white d-flex justify-content-between">
            <span>새 글 작성</span>
            <button className="btn-close btn-close-white" onClick={() => setShowCreate(false)} />
          </div>
          <div className="card-body">
            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label className="form-label fw-semibold">유형</label>
                <select className="form-select" value={createType} onChange={(e) => setCreateType(e.target.value)}>
                  <option value="notice">공지사항</option>
                  <option value="faq">FAQ</option>
                </select>
              </div>
              <div className="col-md-8">
                <label className="form-label fw-semibold">제목</label>
                <input type="text" className="form-control" value={createTitle} onChange={(e) => setCreateTitle(e.target.value)} placeholder={createType === "faq" ? "질문을 입력하세요" : "제목을 입력하세요"} />
              </div>
            </div>
            {createType === "faq" && (
              <div className="mb-3">
                <label className="form-label fw-semibold">카테고리</label>
                <select className="form-select" value={createCategory} onChange={(e) => setCreateCategory(e.target.value)}>
                  <option value="">카테고리 선택</option>
                  {FAQ_CATEGORIES.map((cat) => (
                    <option key={cat.key} value={cat.key}>{cat.label}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="mb-3">
              <label className="form-label fw-semibold">내용</label>
              <RichTextEditor value={createContent} onChange={setCreateContent} placeholder={createType === "faq" ? "답변을 입력하세요" : "내용을 입력하세요"} />
            </div>
            {createType === "notice" && (
              <div className="form-check form-switch mb-3">
                <input className="form-check-input" type="checkbox" checked={createPinned} onChange={(e) => setCreatePinned(e.target.checked)} id="pinSwitch" />
                <label className="form-check-label" htmlFor="pinSwitch">상단 고정</label>
              </div>
            )}
            {/* 첨부파일 */}
            <div className="mb-3">
              <label className="form-label fw-semibold">첨부파일</label>
              <div className="border rounded p-4" style={{ background: "#f8f9fa" }}>
                <input
                  id="create-file-input"
                  type="file"
                  multiple
                  className="d-none"
                  onChange={(e) => { handleFileSelect(e.target.files, "create"); e.target.value = ""; }}
                />
                <div className="d-flex align-items-center gap-3 mb-2">
                  <button type="button" className="btn btn-outline-primary d-flex align-items-center gap-2"
                    style={{ fontSize: "15px" }}
                    onClick={() => document.getElementById('create-file-input').click()}>
                    <Icon icon="solar:add-circle-outline" /> 파일 추가
                  </button>
                  <span className="text-muted" style={{ fontSize: "14px" }}>
                    {createPendingFiles.length + createAttachments.length > 0
                      ? `${createPendingFiles.length + createAttachments.length}개 파일 선택됨`
                      : '여러 파일을 추가할 수 있습니다'}
                  </span>
                </div>
                {/* pending 파일 (아직 업로드 안 됨) */}
                {createPendingFiles.length > 0 && (
                  <ul className="list-unstyled mb-0 mt-2">
                    {createPendingFiles.map((file, i) => (
                      <li key={`p-${i}`} className="d-flex align-items-center gap-2 mb-1">
                        <Icon icon="solar:file-text-outline" className="text-warning" />
                        <span className="small">{file.name}</span>
                        <span className="text-muted small">({formatFileSize(file.size)})</span>
                        <span className="badge bg-warning-focus text-warning-600" style={{ fontSize: "10px" }}>대기중</span>
                        <button type="button" className="btn btn-sm btn-outline-danger py-0 px-1" onClick={() => removePendingFile(i, "create")}>&times;</button>
                      </li>
                    ))}
                  </ul>
                )}
                {/* 이미 업로드된 파일 */}
                {createAttachments.length > 0 && (
                  <ul className="list-unstyled mb-0 mt-2">
                    {createAttachments.map((file, i) => (
                      <li key={`u-${i}`} className="d-flex align-items-center gap-2 mb-1">
                        <Icon icon="solar:file-text-outline" className="text-success" />
                        <span className="small">{file.name}</span>
                        <span className="text-muted small">({formatFileSize(file.size)})</span>
                        <span className="badge bg-success-focus text-success-600" style={{ fontSize: "10px" }}>업로드됨</span>
                        <button type="button" className="btn btn-sm btn-outline-danger py-0 px-1" onClick={() => removeAttachment(i, "create")}>&times;</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <button className="btn btn-success-600" onClick={handleCreate} disabled={uploading}>
              {uploading ? "업로드 중..." : "등록"}
            </button>
          </div>
        </div>
      )}

      {/* Edit Card */}
      {editingPost && (
        <div className="card border-primary mb-4">
          <div className="card-header bg-primary text-white">게시글 수정</div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label fw-semibold">제목</label>
              <input type="text" className="form-control" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">내용</label>
              <RichTextEditor value={editContent} onChange={setEditContent} />
            </div>
            {/* 첨부파일 */}
            <div className="mb-3">
              <label className="form-label fw-semibold">첨부파일</label>
              <div className="border rounded p-4" style={{ background: "#f8f9fa" }}>
                <input
                  id="edit-file-input"
                  type="file"
                  multiple
                  className="d-none"
                  onChange={(e) => { handleFileSelect(e.target.files, "edit"); e.target.value = ""; }}
                />
                <div className="d-flex align-items-center gap-3 mb-2">
                  <button type="button" className="btn btn-outline-primary d-flex align-items-center gap-2"
                    style={{ fontSize: "15px" }}
                    onClick={() => document.getElementById('edit-file-input').click()}>
                    <Icon icon="solar:add-circle-outline" /> 파일 추가
                  </button>
                  <span className="text-muted" style={{ fontSize: "14px" }}>
                    {editPendingFiles.length + editAttachments.length > 0
                      ? `${editPendingFiles.length + editAttachments.length}개 파일 선택됨`
                      : '여러 파일을 추가할 수 있습니다'}
                  </span>
                </div>
                {/* pending 파일 */}
                {editPendingFiles.length > 0 && (
                  <ul className="list-unstyled mb-0 mt-2">
                    {editPendingFiles.map((file, i) => (
                      <li key={`p-${i}`} className="d-flex align-items-center gap-2 mb-1">
                        <Icon icon="solar:file-text-outline" className="text-warning" />
                        <span className="small">{file.name}</span>
                        <span className="text-muted small">({formatFileSize(file.size)})</span>
                        <span className="badge bg-warning-focus text-warning-600" style={{ fontSize: "10px" }}>대기중</span>
                        <button type="button" className="btn btn-sm btn-outline-danger py-0 px-1" onClick={() => removePendingFile(i, "edit")}>&times;</button>
                      </li>
                    ))}
                  </ul>
                )}
                {/* 이미 업로드된 파일 */}
                {editAttachments.length > 0 && (
                  <ul className="list-unstyled mb-0 mt-2">
                    {editAttachments.map((file, i) => (
                      <li key={`u-${i}`} className="d-flex align-items-center gap-2 mb-1">
                        <Icon icon="solar:file-text-outline" className="text-success" />
                        <a href={file.url} target="_blank" rel="noopener noreferrer" className="small">{file.name}</a>
                        <span className="text-muted small">({formatFileSize(file.size)})</span>
                        <span className="badge bg-success-focus text-success-600" style={{ fontSize: "10px" }}>업로드됨</span>
                        <button type="button" className="btn btn-sm btn-outline-danger py-0 px-1" onClick={() => removeAttachment(i, "edit")}>&times;</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="d-flex gap-2">
              <button className="btn btn-primary" onClick={handleSave} disabled={uploading}>
                {uploading ? "업로드 중..." : "저장"}
              </button>
              <button className="btn btn-secondary" onClick={() => setEditingPost(null)}>취소</button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Card */}
      {replyPostId && (
        <div className="card border-info mb-4">
          <div className="card-header bg-info text-white d-flex justify-content-between">
            <span>관리자 답변 작성</span>
            <button className="btn-close btn-close-white" onClick={() => setReplyPostId(null)} />
          </div>
          <div className="card-body">
            <RichTextEditor value={replyContent} onChange={setReplyContent} placeholder="답변 내용을 입력하세요" height="150px" simple />
            <button className="btn btn-info" onClick={handleReply}>답변 등록</button>
          </div>
        </div>
      )}

      {/* Posts Table */}
      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
      ) : posts.length === 0 ? (
        <p className="text-muted text-center py-3">게시글이 없습니다.</p>
      ) : (
        <div className="table-responsive">
          <table className="table bordered-table">
            <thead className="table-light">
              <tr>
                <th>유형</th><th>제목</th><th>카테고리</th><th>작성자</th><th>작성일</th><th>상태</th><th>조회</th><th>관리</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                <tr key={post.id}>
                  <td><span className={`badge ${TYPE_BADGES[post.type] || "bg-secondary"}`}>{TYPE_LABELS[post.type] || post.type}</span></td>
                  <td className="fw-medium">
                    {post.is_pinned && <Icon icon="mdi:pin" className="text-danger me-1" />}
                    {post.title}
                    {post.is_secret && <span className="ms-1">🔒</span>}
                  </td>
                  <td className="text-muted small">{post.category ? (FAQ_CAT_LABELS[post.category] || post.category) : "-"}</td>
                  <td className="text-muted">{post.author_name}</td>
                  <td className="text-muted">{formatKST(post.created_at, "yyyy-MM-dd")}</td>
                  <td>
                    {post.type === "qna" && (
                      post.has_reply ? <span className="badge bg-success-focus text-success-600">답변완료</span> : <span className="badge bg-danger-focus text-danger-600">미답변</span>
                    )}
                  </td>
                  <td className="text-muted">{post.view_count || 0}</td>
                  <td>
                    <div className="d-flex gap-1 flex-wrap">
                      {post.type === "notice" && (
                        <button className={`btn btn-sm ${post.is_pinned ? "btn-danger" : "btn-outline-secondary"}`} onClick={() => handleTogglePin(post)} title={post.is_pinned ? "고정 해제" : "상단 고정"}>
                          <Icon icon="mdi:pin" />
                        </button>
                      )}
                      {post.type === "qna" && !post.has_reply && (
                        <button className="btn btn-sm btn-outline-info" onClick={() => { setReplyPostId(post.id); setReplyContent(""); }}>답변</button>
                      )}
                      <button className="btn btn-sm btn-outline-primary" onClick={() => handleEdit(post)}>수정</button>
                      {deleteConfirmId === post.id ? (
                        <>
                          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(post.id)}>확인</button>
                          <button className="btn btn-sm btn-secondary" onClick={() => setDeleteConfirmId(null)}>취소</button>
                        </>
                      ) : (
                        <button className="btn btn-sm btn-outline-danger" onClick={() => setDeleteConfirmId(post.id)}>삭제</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {total > 20 && (
        <nav className="mt-3 d-flex justify-content-center">
          <ul className="pagination">
            {Array.from({ length: Math.ceil(total / 20) }, (_, i) => (
              <li className={`page-item ${page === i + 1 ? "active" : ""}`} key={i}>
                <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
