"use client";

import { useState, useEffect } from "react";

/**
 * FAQ 페이지 — DB에서 동적 로드 (카테고리별 아코디언)
 * 관리자에서 등록한 FAQ를 /api/faq에서 불러와 표시
 */

export default function FaqPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    async function fetchFaq() {
      try {
        const res = await fetch("/api/faq");
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
        }
      } catch (err) {
        console.error("FAQ fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchFaq();
  }, []);

  // 아코디언 토글 핸들러
  const [openAccordion, setOpenAccordion] = useState({});
  const toggleAccordion = (tabIdx, itemIdx) => {
    const key = `${tabIdx}-${itemIdx}`;
    setOpenAccordion((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (<>

        <main>
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
                            <div className="col-xl-12  col-lg-12  col-md-12  col-sm-12 col-12  d-flex align-items-center justify-content-center">
                                <div className="page-title mt-110 text-center">
                                    <span className="theme-color f-700">제8회 교육 공공데이터 AI활용 경진대회</span>
                                    <h1 className="text-capitalize f-700 mt-10 mb-20">자주묻는 질문</h1>
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb justify-content-center bg-transparent">
                                        <li className="breadcrumb-item"><a className="secondary-color3" href="/">홈</a></li>
                                        <li className="breadcrumb-item active text-capitalize secondary-color3" aria-current="page">자주묻는 질문</li>
                                        </ol>
                                    </nav>
                                </div>{/* /page title */}
                            </div>{/* /col */}
                        </div>{/* /row */}
                    </div>{/* /container */}
                </div>
            </div>
            {/* slider-area-end  */}


            {/* ====== faq-page-area-start============================================ */}
            <div className="faq-page-area pt-135 mb-140 over-hidden">
                <div className="container">

                    {loading ? (
                        <div className="text-center py-5">
                            <div className="spinner-border" style={{ color: "var(--public-primary)" }} role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : categories.length === 0 ? (
                        <div className="text-center py-5">
                            <div className="display-4 mb-3">❓</div>
                            <p className="text-muted fs-5 mb-0">등록된 FAQ가 없습니다.</p>
                        </div>
                    ) : (
                        <div className="row">
                            <div className="col-xl-4 col-lg-5 col-md-12 col-sm-12 col-12">
                                <div className="faq-content mt-35 mb-60">
                                    <div className="nav nav-pills flex-column faq-nav primary-border" role="tablist" aria-orientation="vertical">
                                        {categories.map((cat, idx) => (
                                            <a
                                                key={cat.key}
                                                href="#"
                                                className={`nav-link${idx === activeTab ? " active" : ""}${idx === categories.length - 1 ? " border-bottom-0" : ""}`}
                                                role="tab"
                                                onClick={(e) => { e.preventDefault(); setActiveTab(idx); setOpenAccordion({}); }}
                                            >
                                                {cat.label}
                                            </a>
                                        ))}
                                    </div>
                                </div>{/* /faq-content */}
                            </div>{/* /col */}
                            <div className="col-xl-8 col-lg-7 col-md-12 col-sm-12 col-12">
                                <div className="faq-wrapper pl-xl-4">
                                    {categories.map((cat, tabIdx) => (
                                        <div
                                            key={cat.key}
                                            style={{ display: tabIdx === activeTab ? "block" : "none" }}
                                        >
                                            <div className="accordion">
                                                {cat.items.map((item, itemIdx) => {
                                                    const isOpen = openAccordion[`${tabIdx}-${itemIdx}`] || (itemIdx === 0 && !Object.keys(openAccordion).some(k => k.startsWith(`${tabIdx}-`)));
                                                    return (
                                                        <div className="card border-0" key={item.id}>
                                                            <div className="card-header bg-transparent border-bottom-0 p-0">
                                                                <h6 className="mb-0">
                                                                    <a
                                                                        href="#"
                                                                        className={`btn btn-link black-color f-700 d-block text-left rounded-0 position-relative${!isOpen ? " collapsed" : ""}`}
                                                                        onClick={(e) => { e.preventDefault(); toggleAccordion(tabIdx, itemIdx); }}
                                                                        aria-expanded={isOpen}
                                                                    >
                                                                        {item.question}
                                                                    </a>
                                                                </h6>
                                                            </div>
                                                            <div className={`collapse${isOpen ? " show" : ""}`}>
                                                                <div className="card-body">
                                                                    <div dangerouslySetInnerHTML={{ __html: item.answer }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>{/* /faq-wrapper */}
                            </div>{/* /col */}
                        </div>
                    )}
                </div>{/* /container */}
            </div>
            {/* faq-page-area-end  */}

            {/* ====== banner-area-start ========================================= */}
            <div className="banner-area banner-margin-bottom position-relative" data-aos="fade-up" data-aos-duration="1500">
                <div className="container">
                    <div className="banner-wrapper banner-border white-bg pl-70 pr-70 pt-55 pb-75 transition3">
                        <div className="row align-items-center justify-content-between">
                            <div className="col-xl-9 col-lg-9  col-md-12 col-sm-12 col-12">
                                <div className="banner-content">
                                    <h4 className="f-700 mb-18">질문이 해결되지 않았나요?</h4>
                                    <p className="mb-0">문의하기 게시판에서 직접 질문을 남겨주세요. 관리자가 답변드립니다.</p>
                                </div>
                            </div>{/* /col */}
                            <div className="col-xl-3 col-lg-3  col-md-12 col-sm-12 col-12">
                                <div className="banner-btn float-left float-lg-right">
                                    <div className="my-btn">
                                        <a href="/contact/write" className="btn theme-bg text-capitalize f-18 f-700">문의하기</a>
                                    </div>{/* /my-btn */}
                                </div>
                            </div>{/* /col */}
                        </div>{/* /row */}
                    </div>{/* /banner-wrapper */}
                </div>{/* /container */}
            </div>
            {/* banner-area-end  */}
        </main>

  </>);
}
