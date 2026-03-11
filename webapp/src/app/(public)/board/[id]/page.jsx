"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatKST } from "@/lib/dateUtils";
import RichTextEditor from "@/components/RichTextEditor";

/**
 * Post Detail ??Evalo original template design
 * Secret post: POST password verify
 * QnA: admin replies + edit/delete with password modal
 */

export default function PostDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [requiresPassword, setRequiresPassword] = useState(false);
  const [secretPassword, setSecretPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [verifying, setVerifying] = useState(false);

  const [showActionModal, setShowActionModal] = useState(null);
  const [actionPassword, setActionPassword] = useState("");
  const [actionError, setActionError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const fetchPost = async () => {
    try {
      const res = await fetch(`/api/board/${id}`);
      if (!res.ok) { setError("Í≤åÏãúÍ∏Ä??Î∂àÎü¨?????ÜÏäµ?àÎã§."); return; }
      const data = await res.json();
      if (data.requires_password) { setPost(data.post); setRequiresPassword(true); return; }
      setPost(data.post); setRequiresPassword(false);
      if (data.post?.type === "qna") {
        const rr = await fetch(`/api/board?parent_id=${id}`);
        if (rr.ok) { const rd = await rr.json(); setReplies(rd.posts || []); }
      }
    } catch { setError("?§Ìä∏?åÌÅ¨ ?§Î•òÍ∞Ä Î∞úÏÉù?àÏäµ?àÎã§."); }
  };

  useEffect(() => { (async () => { await fetchPost(); setLoading(false); })(); }, [id]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!secretPassword.trim()) return;
    setVerifying(true); setPasswordError("");
    try {
      const res = await fetch(`/api/board/${id}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: secretPassword }),
      });
      const data = await res.json();
      if (res.status === 403) { setPasswordError(data.error || "ÎπÑÎ?Î≤àÌò∏Í∞Ä ?ºÏπò?òÏ? ?äÏäµ?àÎã§."); }
      else if (res.ok) {
        setPost(data.post); setRequiresPassword(false);
        if (data.post?.type === "qna") {
          const rr = await fetch(`/api/board?parent_id=${id}`);
          if (rr.ok) { const rd = await rr.json(); setReplies(rd.posts || []); }
        }
      }
    } catch { setPasswordError("?§Ìä∏?åÌÅ¨ ?§Î•ò"); }
    setVerifying(false);
  };

  const handleEdit = async () => {
    if (!actionPassword.trim()) return;
    setActionLoading(true); setActionError("");
    try {
      const res = await fetch(`/api/board/${id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: actionPassword, title: editTitle, content: editContent }),
      });
      if (res.status === 403) { setActionError("ÎπÑÎ?Î≤àÌò∏Í∞Ä ?ºÏπò?òÏ? ?äÏäµ?àÎã§."); }
      else if (res.ok) { setShowActionModal(null); setActionPassword(""); await fetchPost(); setLoading(false); }
      else { const d = await res.json(); setActionError(d.error || "?òÏ†ï ?§Ìå®"); }
    } catch { setActionError("?§Ìä∏?åÌÅ¨ ?§Î•ò"); }
    setActionLoading(false);
  };

  const handleDelete = async () => {
    if (!actionPassword.trim()) return;
    setActionLoading(true); setActionError("");
    try {
      const res = await fetch(`/api/board/${id}`, {
        method: "DELETE", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: actionPassword }),
      });
      if (res.status === 403) { setActionError("ÎπÑÎ?Î≤àÌò∏Í∞Ä ?ºÏπò?òÏ? ?äÏäµ?àÎã§."); }
      else if (res.ok) { router.push(post?.type === "qna" ? "/contact" : "/board"); }
      else { const d = await res.json(); setActionError(d.error || "??†ú ?§Ìå®"); }
    } catch { setActionError("?§Ìä∏?åÌÅ¨ ?§Î•ò"); }
    setActionLoading(false);
  };

  const TYPE_LABELS = { notice: "Í≥µÏ??¨Ìï≠", faq: "FAQ", qna: "Î¨∏Ïùò" };
  const backUrl = post?.type === "qna" ? "/contact" : "/board";
  const backLabel = post?.type === "qna" ? "Î¨∏Ïùò?òÍ∏∞" : "Í≥µÏ??¨Ìï≠";

  if (loading) return (
    <div className="pt-200 pb-200 text-center">
      <div className="spinner-border" style={{ color: "var(--public-primary, #2161a6)" }}></div>
    </div>
  );

  if (error || !post) return (
    <div className="pt-200 pb-200 text-center">
      <p className="text-danger f-700 mb-30">{error || "Í≤åÏãúÍ∏Ä??Ï∞æÏùÑ ???ÜÏäµ?àÎã§."}</p>
      <div className="my-btn d-inline-block">
        <Link href="/board" className="btn theme-bg text-capitalize f-18 f-700">Í≤åÏãú?êÏúºÎ°??åÏïÑÍ∞ÄÍ∏?/Link>
      </div>
    </div>
  );

  // Password required
  if (requiresPassword) return (
    <>
      {/* ======slider-area=========================================== */}
      <div className="slider-area position-relative primary-bg">
          <div id="scene" className="position-absolute w-100 h-100">
              <img data-depth="0.20" className="shape page-shape-1 d-none d-lg-inline-block s-shape" src="/original-template/images/slider/page-shape/page-shape1.png" alt="#" />
              <img data-depth="0.20" className="shape page-shape-2 d-none d-lg-inline-block s-shape" src="/original-template/images/slider/page-shape/page-shape2.png" alt="#" />
              <img data-depth="0.20" className="shape page-shape-3 d-none d-lg-inline-block" src="/original-template/images/slider/page-shape/page-shape3.png" alt="#" />
              <img data-depth="0.20" className="shape page-shape-4 d-none d-lg-inline-block" src="/original-template/images/slider/page-shape/page-shape4.png" alt="#" />
              <img data-depth="0.20" className="shape page-shape-5 d-none d-lg-inline-block bounce-animate2" src="/original-template/images/slider/page-shape/page-shape5.png" alt="#" />
              <img data-depth="0.20" className="shape page-shape-6 d-none d-lg-inline-block bounce-animate" src="/original-template/images/slider/page-shape/page-shape6.png" alt="#" />
              <img data-depth="0.20" className="shape page-shape-7 d-none d-lg-inline-block s-shape" src="/original-template/images/slider/page-shape/page-shape1.png" alt="#" />
          </div>
          <div className="single-page page-height d-flex align-items-center">
              <div className="container">
                  <div className="row">
                      <div className="col-12 d-flex align-items-center justify-content-center">
                          <div className="page-title mt-110 text-center">
                              <span className="theme-color f-700">?îí ÎπÑÎ?Í∏Ä</span>
                              <h1 className="text-capitalize f-700 mt-10 mb-20">{post.title}</h1>
                              <nav aria-label="breadcrumb">
                                  <ol className="breadcrumb justify-content-center bg-transparent">
                                  <li className="breadcrumb-item"><a className="secondary-color3" href="/">??/a></li>
                                  <li className="breadcrumb-item"><a className="secondary-color3" href={backUrl}>{backLabel}</a></li>
                                  <li className="breadcrumb-item active secondary-color3" aria-current="page">ÎπÑÎ?Í∏Ä</li>
                                  </ol>
                              </nav>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      <div className="contact-area pt-135 pb-120 over-hidden">
          <div className="container">
              <div className="row justify-content-center">
                  <div className="col-xl-5 col-lg-6 col-md-8 col-sm-10 col-12">
                      <div className="contact-form-wrapper secondary-border01 pt-60 pb-60 pl-60 pr-60 text-center">
                          <div className="display-3 mb-20">?îí</div>
                          <h4 className="f-700 mb-10">ÎπÑÎ?Í∏Ä?ÖÎãà??/h4>
                          <p className="mb-5 secondary-color">?ëÏÑ±?? {post.author_name}</p>
                          {passwordError && <div className="alert alert-danger py-2 mb-20">{passwordError}</div>}
                          <form onSubmit={handlePasswordSubmit}>
                              <input type="password" className="form-control secondary-border01 text-center mb-20"
                                placeholder="ÎπÑÎ?Î≤àÌò∏Î•??ÖÎ†•?òÏÑ∏?? value={secretPassword}
                                onChange={(e) => setSecretPassword(e.target.value)} autoFocus
                                style={{ height: "55px", fontSize: "16px" }} />
                              <div className="my-btn">
                                <button type="submit" className="btn theme-bg text-capitalize f-18 f-700 w-100" disabled={verifying}
                                  style={{ height: "55px" }}>
                                  {verifying ? "?ïÏù∏ Ï§?.." : "?ïÏù∏"}
                                </button>
                              </div>
                          </form>
                      </div>
                      <div className="text-center mt-30">
                          <Link href={backUrl} className="secondary-color">{`??${backLabel}?ºÎ°ú ?åÏïÑÍ∞ÄÍ∏?}</Link>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    </>
  );

  // Full post view
  return (
    <>
      {/* ======slider-area=========================================== */}
      <div className="slider-area position-relative primary-bg">
          <div id="scene" className="position-absolute w-100 h-100">
              <img data-depth="0.20" className="shape page-shape-1 d-none d-lg-inline-block s-shape" src="/original-template/images/slider/page-shape/page-shape1.png" alt="#" />
              <img data-depth="0.20" className="shape page-shape-2 d-none d-lg-inline-block s-shape" src="/original-template/images/slider/page-shape/page-shape2.png" alt="#" />
              <img data-depth="0.20" className="shape page-shape-3 d-none d-lg-inline-block" src="/original-template/images/slider/page-shape/page-shape3.png" alt="#" />
              <img data-depth="0.20" className="shape page-shape-4 d-none d-lg-inline-block" src="/original-template/images/slider/page-shape/page-shape4.png" alt="#" />
              <img data-depth="0.20" className="shape page-shape-5 d-none d-lg-inline-block bounce-animate2" src="/original-template/images/slider/page-shape/page-shape5.png" alt="#" />
              <img data-depth="0.20" className="shape page-shape-6 d-none d-lg-inline-block bounce-animate" src="/original-template/images/slider/page-shape/page-shape6.png" alt="#" />
              <img data-depth="0.20" className="shape page-shape-7 d-none d-lg-inline-block s-shape" src="/original-template/images/slider/page-shape/page-shape1.png" alt="#" />
          </div>
          <div className="single-page page-height d-flex align-items-center">
              <div className="container">
                  <div className="row">
                      <div className="col-12 d-flex align-items-center justify-content-center">
                          <div className="page-title mt-110 text-center">
                              <span className="theme-color f-700">{TYPE_LABELS[post.type] || post.type}</span>
                              <h1 className="text-capitalize f-700 mt-10 mb-20">{post.title}</h1>
                              <nav aria-label="breadcrumb">
                                  <ol className="breadcrumb justify-content-center bg-transparent">
                                  <li className="breadcrumb-item"><a className="secondary-color3" href="/">??/a></li>
                                  <li className="breadcrumb-item"><a className="secondary-color3" href={backUrl}>{backLabel}</a></li>
                                  <li className="breadcrumb-item active secondary-color3" aria-current="page">?ÅÏÑ∏Î≥¥Í∏∞</li>
                                  </ol>
                              </nav>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* Post Content */}
      <div className="pt-135 pb-120 over-hidden">
          <div className="container">
              <div className="row justify-content-center">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">

                      {/* Í≤åÏãúÍ∏Ä Î©îÌ? ?ïÎ≥¥ */}
                      <div className="secondary-border01 pt-30 pb-30 pl-40 pr-40 mb-30">
                          <div className="d-flex justify-content-between align-items-center flex-wrap">
                              <div>
                                  <span className="d-inline-block theme-bg text-white f-700 mr-10" style={{ borderRadius: "4px", fontSize: "12px", padding: "3px 12px" }}>
                                    {TYPE_LABELS[post.type] || post.type}
                                  </span>
                                  <span className="secondary-color f-700">{post.author_name}</span>
                              </div>
                              <div className="secondary-color" style={{ fontSize: "14px" }}>
                                  <span className="mr-20">?ìÖ {post.created_at ? formatKST(post.created_at, "yyyy-MM-dd HH:mm") : "-"}</span>
                                  <span>?ëÅ Ï°∞Ìöå {post.view_count || 0}</span>
                              </div>
                          </div>
                      </div>

                      {/* Í≤åÏãúÍ∏Ä Î≥∏Î¨∏ */}
                      <div className="secondary-border01 pt-40 pb-40 pl-40 pr-40 mb-30">
                          <div className="ql-editor" style={{ minHeight: 200, padding: 0 }}
                            dangerouslySetInnerHTML={{ __html: post.content }}
                          />

                          {/* QnA ?òÏ†ï/??†ú Î≤ÑÌäº */}
                          {post.type === "qna" && (
                            <div className="border-top pt-20 mt-30 d-flex gap-2">
                                <div className="my-btn">
                                  <button className="btn theme-bg text-capitalize f-700"
                                    style={{ padding: "8px 24px" }}
                                    onClick={() => { setEditTitle(post.title); setEditContent(post.content); setShowActionModal("edit"); setActionError(""); setActionPassword(""); }}>
                                    ?òÏ†ï
                                  </button>
                                </div>
                                <button className="btn btn-outline-danger f-700"
                                  style={{ padding: "8px 24px", borderRadius: "4px" }}
                                  onClick={() => { setShowActionModal("delete"); setActionError(""); setActionPassword(""); }}>
                                  ??†ú
                                </button>
                            </div>
                          )}
                      </div>

                      {/* Í¥ÄÎ¶¨Ïûê ?µÎ? */}
                      {replies.length > 0 && replies.map((reply) => (
                          <div key={reply.id} className="secondary-border01 pt-30 pb-30 pl-40 pr-40 mb-20"
                            style={{ borderLeft: "4px solid var(--public-primary, #2161a6)" }}>
                              <div className="d-flex align-items-center mb-15">
                                  <span className="d-inline-block theme-bg text-white f-700" style={{ borderRadius: "4px", fontSize: "12px", padding: "3px 12px" }}>Í¥ÄÎ¶¨Ïûê ?µÎ?</span>
                                  <small className="secondary-color ml-15">{reply.created_at ? formatKST(reply.created_at, "yyyy-MM-dd HH:mm") : ""}</small>
                              </div>
                              <div className="ql-editor" style={{ padding: 0 }}
                                dangerouslySetInnerHTML={{ __html: reply.content }}
                              />
                          </div>
                      ))}

                      {/* Î™©Î°ù?ºÎ°ú ?åÏïÑÍ∞ÄÍ∏?*/}
                      <div className="text-center mt-50">
                          <div className="my-btn d-inline-block">
                            <Link href={backUrl} className="btn secondary-border01 text-capitalize f-18 f-700" style={{ padding: "12px 40px" }}>
                              ??{backLabel}?ºÎ°ú ?åÏïÑÍ∞ÄÍ∏?                            </Link>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* Edit/Delete Modal */}
      {showActionModal && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 99999 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content" style={{ borderRadius: 8 }}>
              <div className="modal-header">
                <h5 className="modal-title f-700">
                  {showActionModal === "edit" ? "Í≤åÏãúÍ∏Ä ?òÏ†ï" : "Í≤åÏãúÍ∏Ä ??†ú"}
                </h5>
                <button className="btn-close" onClick={() => setShowActionModal(null)} />
              </div>
              <div className="modal-body">
                {actionError && <div className="alert alert-danger py-2">{actionError}</div>}
                {showActionModal === "edit" && (
                  <>
                    <div className="mb-20">
                      <label className="f-700 mb-10 d-block">?úÎ™©</label>
                      <input type="text" className="form-control secondary-border01" value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        style={{ height: "50px", paddingLeft: "20px", fontSize: "16px" }} />
                    </div>
                    <div className="mb-20">
                      <label className="f-700 mb-10 d-block">?¥Ïö©</label>
                      <RichTextEditor value={editContent} onChange={setEditContent} height="200px" />
                    </div>
                  </>
                )}
                {showActionModal === "delete" && (
                  <p className="text-danger f-700">??Í≤åÏãúÍ∏Ä????†ú?òÏãúÍ≤†Ïäµ?àÍπå? ???ëÏóÖ?Ä ?òÎèåÎ¶????ÜÏäµ?àÎã§.</p>
                )}
                <div className="mb-10">
                  <label className="f-700 mb-10 d-block">ÎπÑÎ?Î≤àÌò∏ ?ïÏù∏</label>
                  <input type="password" className="form-control secondary-border01" placeholder="Í≤åÏãúÍ∏Ä ?ëÏÑ± ???§Ï†ï??ÎπÑÎ?Î≤àÌò∏"
                    value={actionPassword} onChange={(e) => setActionPassword(e.target.value)}
                    style={{ height: "50px", paddingLeft: "20px", fontSize: "16px" }} />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn secondary-border01 f-700" onClick={() => setShowActionModal(null)}>Ï∑®ÏÜå</button>
                <div className="my-btn">
                  <button className={`btn f-700 ${showActionModal === "delete" ? "btn-danger" : "theme-bg text-capitalize"}`}
                    onClick={showActionModal === "edit" ? handleEdit : handleDelete}
                    disabled={actionLoading || !actionPassword.trim()}>
                    {actionLoading ? "Ï≤òÎ¶¨ Ï§?.." : showActionModal === "edit" ? "?òÏ†ï" : "??†ú"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
