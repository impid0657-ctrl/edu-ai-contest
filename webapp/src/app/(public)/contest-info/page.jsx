export default function ContestInfoPage() {
    return (<>
        <style>{`
      .contest-counter-num { font-size: 35px !important; }
      @media (max-width: 768px) {
        .contest-counter-num { font-size: 30px !important; }
      }
    `}</style>
        {/*[if lte IE 9]>
            <p className="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="https://browsehappy.com/">upgrade your browser</a> to improve your experience and security.</p>
        <![endif]*/}

        {/*  ====== preloader=============================================  */}


        {/*  ====== header-area-start=======================================  */}

        {/*  header-area-end  */}


        {/*  ====== header extra info start================================== */}
        {/* side-mobile-menu start */}




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
                {/* /shape-slider */}

                <div className="single-page page-height d-flex align-items-center">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-12  col-lg-12  col-md-12  col-sm-12 col-12  d-flex align-items-center justify-content-center">
                                <div className="page-title mt-110 text-center">
                                    <span className="theme-color f-700">제8회 교육 공공데이터 AI 활용대회</span>
                                    <h1 className="text-capitalize f-700 mt-10 mb-20">대회안내</h1>
                                    <nav aria-label="breadcrumb">
                                        <ol className="breadcrumb justify-content-center bg-transparent">
                                            <li className="breadcrumb-item"><a className="secondary-color3" href="/">홈</a></li>
                                            <li className="breadcrumb-item active text-capitalize secondary-color3" aria-current="page">대회안내</li>
                                        </ol>
                                    </nav>
                                </div>{/* /page title */}
                            </div>{/* /col */}
                        </div>{/* /row */}
                    </div>{/* /container */}
                    {/* </div> */}
                </div>
            </div>
            {/* slider-area-end  */}


            {/* ====== about-area-start=========================================== */}
            <div className="about-us-about-area pt-200 pb-30 over-hidden">
                <div className="container">
                    <div className="row align-items-start justify-content-center">
                        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                            <div className="about-us-left-content mb-65">
                                <div className="title">
                                    <span className="theme-color f-700">대회 소개</span>
                                    <h3 className="f-700 mb-30">교육의 미래를 AI와 함께 만들어갑니다</h3>
                                    <p className="pb-10">교육부·17개 시도교육청 주최, 한국교육학술정보원(KERIS) 주관의 제8회 교육 공공데이터 AI 활용대회는 교육 분야 최대 규모의 AI 공모전입니다.</p>
                                    <p>교육 공공데이터와 AI 기술의 융합을 통해 국민의 참여와 관심을 확대하고, AI 활용 아이디어 기획 및 영상제작을 통한 미래형 인재를 양성합니다.</p>
                                </div>
                                <div className="my-btn mt-47" data-aos="fade-up" data-aos-duration="2000">
                                    <a href="/submit" className="btn theme-bg text-capitalize f-18 f-700">참가 신청</a>
                                </div>{/* /my-btn */}
                            </div>{/* /about-left-content */}
                        </div>{/* /col */}
                        <div className="col-xl-5 offset-lg-1 col-lg-5 col-md-9 col-sm-12 col-12">
                            <div className="about-us-img-wrapper mt-18 mb-100 d-flex justify-content-end ml-100">
                                <div className="home3-about-img bg-transparent position-relative z-index11 tilt">
                                    <img className="about-us-img1 d-inline-block z-index-1" src="/original-template/images/about/about-us-img1.jpg" alt="image" />
                                    <img className="about-us-img2 position-absolute d-inline-block z-index1" src="/original-template/images/about/about-us-img2.jpg" alt="image" />
                                    <div className="about-us-marker white-bg text-center position-absolute z-index11">
                                        <div className="about-us-marker-text">
                                            <h3 className="f-700 text-center">8회 역사</h3>
                                        </div>
                                    </div>{/* /about-us-marker */}
                                    <div className="about-us-about-icon theme-bg position-absolute z-index11 text-center" data-aos="zoom-in" data-aos-duration="2000">
                                        <span className="white-color d-block pt-20 pb-20"><i className="fal fa-rocket-launch"></i></span>
                                    </div>
                                </div>{/* /about-img */}
                            </div>{/* /home3-about-img-wrapper */}
                        </div>{/* /col */}
                    </div>{/* /row */}
                </div>{/* /container */}
            </div>
            {/* about-area-end */}


            {/* ====== facts-area-start=========================================== */}
            <div className="home3-facts-area about-us-fact-area about-us-fact-bg">
                <div className="about-us-fact-bg bg-no-repeat pt-150 pb-140" data-aos="fade-up" data-aos-duration="2000" data-background="images/bg/about-us-fact-bg.png">
                    <div className="container">
                        <div className="row align-items-center justify-content-center flex-column-reverse flex-lg-row">
                            <div className="col-xl-6  col-lg-7  col-md-9  col-sm-12 col-12">
                                <div className="row home3-facts-wrapper">
                                    <div className="col-xl-6  col-lg-6  col-md-6  col-sm-6 col-12">
                                        <div className="home3-single-facts about-us-fact-wrapper white-bg text-center pt-45 pb-60 pl-40 pr-40 mb-30">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <span className="theme-color f-700 d-inline-block counter contest-counter-num">10,264</span>
                                                <span className="per theme-color d-inline-block f-700 contest-counter-num">만원</span>
                                            </div>
                                            <p className="black-color text-center f-700 mb-0">상금·상품</p>
                                        </div>  {/* /home3-single-facts */}

                                        <div className="home3-single-facts about-us-fact-wrapper white-bg text-center pt-45 pb-60 pl-40 pr-40 mb-30">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <span className="theme-color f-700 d-inline-block counter contest-counter-num">154</span>
                                                <span className="theme-color d-inline-block f-700 contest-counter-num">팀</span>
                                            </div>
                                            <p className="black-color text-center f-700 mb-0">시상 규모</p>
                                        </div> {/* /home3-single-facts */}
                                    </div>{/* /col */}
                                    <div className="col-xl-6  col-lg-6  col-md-6  col-sm-6 col-12 ">
                                        <div className="home3-single-facts about-us-fact-wrapper home3-single-facts-margin white-bg text-center pt-45 pb-60 pl-40 pr-40 mb-30 mt-60">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <span className="theme-color f-700 d-inline-block counter contest-counter-num">500</span>
                                                <span className="per theme-color d-inline-block f-700 contest-counter-num">개</span>
                                            </div>
                                            <p className="black-color text-center f-700 mb-0">AI 이용권</p>
                                        </div>  {/* /home3-single-facts */}
                                        <div className="home3-single-facts about-us-fact-wrapper white-bg text-center pt-45 pb-60 pl-40 pr-40 mb-30">
                                            <div className="d-flex align-items-center justify-content-center">
                                                <span className="theme-color f-700 d-inline-block counter contest-counter-num">3</span>
                                                <span className="per theme-color d-inline-block f-700 contest-counter-num">개 분야</span>
                                            </div>
                                            <p className="black-color text-center f-700 mb-0">공모 분야</p>
                                        </div>  {/* /home3-single-facts */}
                                    </div>{/* /col */}
                                </div>{/* /row */}
                            </div>{/* /col */}
                            <div className="col-xl-5 offset-xl-1 col-lg-5 col-md-12 col-sm-12 col-12">
                                <div className="title">
                                    <span className="theme-color f-700">대회 규모</span>
                                    <h3 className="f-700 mb-30">숫자로 보는 제8회 대회</h3>
                                    <p className="pb-10">교육 공공데이터와 AI 기술의 융합으로 교육 현장의 혁신을 이끕니다.</p>
                                </div>
                            </div>{/* /col */}
                        </div>{/* /row */}
                    </div>{/* /container */}
                </div>{/* /about-us-fact-bg */}
            </div>
            {/* home3-facts-area about-us-fact-bg -end */}


            {/* ====== specialty-area-start=========================================== */}
            <div className="speciality-area about-page pt-155 pb-105 over-hidden">
                <div className="container">
                    <div className="row align-items-start">
                        <div className="col-xl-5 col-lg-5 col-md-12 col-sm-12 col-12">
                            <div className="Speciality-left-content mb-20">
                                <div className="title">
                                    <span className="theme-color f-700">참가자 지원</span>
                                    <h3 className="f-700 mb-30">이 대회가 특별한 이유</h3>
                                    <p className="pb-10">에듀핋 AI 이용권, 맞춤형 교육 프로그램, 디지털 배지 인증서, 창업경진대회 추천 등 다양한 혜택을 제공합니다.</p>
                                </div>
                            </div>{/* /Speciality-left-content */}
                        </div>{/* /col */}
                        <div className="col-xl-6 offset-xl-1 col-lg-7 col-md-12 col-sm-12 col-12">
                            <div className="Speciality-right-content mt-15">
                                <div className="row">
                                    <div className="col-xl-6  col-lg-6  col-md-6  col-sm-6 col-12">
                                        <div className="single-service-content transition3 mb-55">
                                            <div className="ser-icon d-inline-block text-center mb-22 transition5">
                                                <img className="h-100" src="/original-template/images/icon/about-us-web.png" alt="image" />
                                            </div>{/* /ser-icon */}
                                            <div className="service-text">
                                                <h6 className="f-700 mb-15">에듀핋 AI 이용권</h6>
                                                <p>선착순 500개 생성형 AI 플랫폼 이용권을 무료 지원합니다 (학생 400개, 일반 100개)</p>
                                            </div>
                                        </div>{/* /single-service-content */}
                                    </div>{/* /col */}
                                    <div className="col-xl-6  col-lg-6  col-md-6  col-sm-6 col-12">
                                        <div className="single-service-content transition3 mb-55">
                                            <div className="ser-icon d-inline-block text-center mb-22 transition5">
                                                <img className="h-100" src="/original-template/images/icon/about-us-code.png" alt="image" />
                                            </div>{/* /ser-icon */}
                                            <div className="service-text">
                                                <h6 className="f-700 mb-15">교육 프로그램</h6>
                                                <p>AI 활용 방법, 데이터 활용 절차, 대회 참여 가이드 등 온라인 교육을 전원에게 제공합니다</p>
                                            </div>
                                        </div>{/* /single-service-content */}
                                    </div>{/* /col */}
                                    <div className="col-xl-6  col-lg-6  col-md-6  col-sm-6 col-12">
                                        <div className="single-service-content transition3 mb-55">
                                            <div className="ser-icon d-inline-block text-center mb-22 transition5">

                                                <img className="h-100" src="/original-template/images/icon/about-us-folder.png" alt="image" />
                                            </div>{/* /ser-icon */}
                                            <div className="service-text">
                                                <h6 className="f-700 mb-15">교육부장관상</h6>
                                                <p>대상 수상팀에는 교육부장관상과 함께 일반부 최대 500만원(현금) 또는 학생부 300만원(상품권)이 수여됩니다</p>
                                            </div>
                                        </div>{/* /single-service-content */}
                                    </div>{/* /col */}
                                    <div className="col-xl-6  col-lg-6  col-md-6  col-sm-6 col-12">
                                        <div className="single-service-content transition3 mb-55">
                                            <div className="ser-icon d-inline-block text-center mb-22 transition5">
                                                <img className="h-100" src="/original-template/images/icon/about-us-user.png" alt="image" />
                                            </div>{/* /ser-icon */}
                                            <div className="service-text">
                                                <h6 className="f-700 mb-15">창업대회 추천</h6>
                                                <p>일반부 대상팀은 행정안전부 주관 범정부 공공데이터 AI 창업경진대회 추천 대상입니다</p>
                                            </div>
                                        </div>{/* /single-service-content */}
                                    </div>{/* /col */}
                                </div>{/* /row */}
                            </div>{/* /Speciality-right-content */}
                        </div>{/* /col */}
                    </div>{/* /row */}
                </div>{/* /container */}
            </div>
            {/* Speciality-area-end */}





            {/* ====== banner-area-start ========================================= */}
            <div className="banner-area banner-margin-bottom position-relative" data-aos="fade-up" data-aos-duration="1500">
                <div className="container">
                    <div className="banner-wrapper banner-border white-bg pl-70 pr-70 pt-55 pb-75 transition3">
                        <div className="row align-items-center justify-content-between">
                            <div className="col-xl-9 col-lg-9  col-md-12 col-sm-12 col-12">
                                <div className="banner-content">
                                    <h4 className="f-700 mb-18">지금 바로 참가 신청하세요!</h4>
                                    <p className="mb-0">작품 접수: 2026년 5월 1일(금) ~ 5월 31일(일) / AI 이용권 신청: 3월 16일 ~ 4월 15일</p>
                                </div>{/* /work-banner-content */}
                            </div>{/* /col */}
                            <div className="col-xl-3 col-lg-3  col-md-12 col-sm-12 col-12">
                                <div className="banner-btn float-left float-lg-right">
                                    <div className="my-btn">
                                        <a href="/submit" className="btn theme-bg text-capitalize f-18 f-700">참가 신청</a>
                                    </div>{/* /my-btn */}
                                </div>{/* /work-banner-content */}
                            </div>{/* /col */}
                        </div>{/* /row */}
                    </div>{/* /banner-wrapper */}
                </div>{/* /container */}
            </div>
            {/* banner-area-end  */}


        </main>

        {/* ====== footer-area-start ============================================ */}


        {/* back top */}

        {/* back to top end */}


        {/* All js here */}
    </>);
}
