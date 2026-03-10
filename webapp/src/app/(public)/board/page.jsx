"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatKST } from "@/lib/dateUtils";

/**
 * Board Landing Page — 공지사항 전용
 */

export default function BoardPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const res = await fetch(`/api/board?type=notice&page=${page}&limit=20`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data.posts || []);
          setTotal(data.total || 0);
        }
      } catch (err) { console.error("Board fetch error:", err); }
      finally { setLoading(false); }
    }
    fetchPosts();
  }, [page]);

  const totalPages = Math.ceil(total / 20);

  return (
    <>
      {/* ======slider-area-start=========================================== */}
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
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12 d-flex align-items-center justify-content-center">
                          <div className="page-title mt-110 text-center">
                              <span className="theme-color f-700">제8회 교육 공공데이터 AI활용 경진대회</span>
                              <h1 className="text-capitalize f-700 mt-10 mb-20">공지사항</h1>
                              <nav aria-label="breadcrumb">
                                  <ol className="breadcrumb justify-content-center bg-transparent">
                                  <li className="breadcrumb-item"><a className="secondary-color3" href="/">홈</a></li>
                                  <li className="breadcrumb-item active text-capitalize secondary-color3" aria-current="page">공지사항</li>
                                  </ol>
                              </nav>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      {/* slider-area-end */}

      <div className="pt-135 pb-120 over-hidden">
        <div className="container">

          {/* Content */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border" style={{ color: "var(--public-primary)" }} role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-5">
              <div className="display-4 mb-3">📭</div>
              <p className="text-muted fs-5 mb-0">등록된 공지사항이 없습니다.</p>
            </div>
          ) : (
            <div className="row g-3">
              {posts.map((post) => (
                <div className="col-12" key={post.id}>
                  <Link href={`/board/${post.id}`} className="text-decoration-none">
                    <div className="secondary-border01 d-flex justify-content-between align-items-center py-3 px-4 transition3">
                      <div>
                        <h6 className="f-700 mb-1 black-color">
                          {post.title}
                        </h6>
                        <small className="text-muted">
                          {post.author_name} · {post.created_at ? formatKST(post.created_at, "yyyy-MM-dd") : "-"}
                        </small>
                      </div>
                      <div className="text-muted small d-none d-md-block">
                        조회 {post.view_count || 0}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-50 d-flex justify-content-center">
              <div className="d-flex gap-2">
                {page > 1 && (
                  <button className="btn btn-sm secondary-border01" style={{ borderRadius: 20 }}
                    onClick={() => setPage(page - 1)}>이전</button>
                )}
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                  <button key={i}
                    className={`btn btn-sm ${page === i + 1 ? "theme-bg text-white f-700" : "secondary-border01"}`}
                    style={{ borderRadius: 20, minWidth: 36 }}
                    onClick={() => setPage(i + 1)}>
                    {i + 1}
                  </button>
                ))}
                {page < totalPages && (
                  <button className="btn btn-sm secondary-border01" style={{ borderRadius: 20 }}
                    onClick={() => setPage(page + 1)}>다음</button>
                )}
              </div>
            </nav>
          )}
        </div>
      </div>
    </>
  );
}
