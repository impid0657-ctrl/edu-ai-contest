import ChatbotEmbed from "@/components/ChatbotEmbed";

export default function HomePage() {
    return (<>
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
            <div className="slider-area position-relative over-hidden">
                <div id="scene" className="position-absolute w-100 h-100">
                    <img data-depth="0.20" className="shape shape-1 d-none d-lg-inline-block" src="/original-template/images/slider/shape/shape1.png" alt="#" />
                    <img data-depth="0.20" className="shape shape-2 d-none d-lg-inline-block" src="/original-template/images/slider/shape/shape2.png" alt="#" />
                    <img data-depth="0.20" className="shape shape-3 d-none d-lg-inline-block r-shape" src="/original-template/images/slider/shape/shape3.png" alt="#" />
                    <img data-depth="0.20" className="shape shape-4 d-none d-lg-inline-block flash-infinite" src="/original-template/images/slider/shape/shape4.png" alt="#" />
                    <img data-depth="0.20" className="shape shape-5 d-none d-lg-inline-block r-shape" src="/original-template/images/slider/shape/shape3.png" alt="#" />
                    <img data-depth="0.20" className="shape shape-6 d-none d-lg-inline-block" src="/original-template/images/slider/shape/shape5.png" alt="#" />
                    <img data-depth="0.20" className="shape shape-7 d-none d-lg-inline-block" src="/original-template/images/slider/shape/shape6.png" alt="#" />
                    <img data-depth="0.20" className="shape shape-8 d-none d-lg-inline-block" src="/original-template/images/slider/shape/shape7.png" alt="#" />
                    <img data-depth="0.20" className="shape shape-9 d-none d-lg-inline-block" src="/original-template/images/slider/shape/shape8.png" alt="#" />
                    <img data-depth="0.20" className="shape shape-10 d-none d-lg-inline-block" src="/original-template/images/slider/shape/shape9.png" alt="#" />
                    <img data-depth="0.20" className="shape shape-11 d-none d-lg-inline-block" src="/original-template/images/slider/shape/shape2.png" alt="#" />
                    <img data-depth="0.20" className="shape shape-12 d-none d-lg-inline-block" src="/original-template/images/slider/shape/shape10.png" alt="#" />
                    <img data-depth="0.20" className="shape shape-13 d-none d-lg-inline-block r-shape" src="/original-template/images/slider/shape/shape3.png" alt="#" />
                    <img data-depth="0.20" className="shape shape-14 d-none d-lg-inline-block r-shape" src="/original-template/images/slider/shape/shape3.png" alt="#" />
                    <img data-depth="0.20" className="shape shape-15 d-none d-lg-inline-block" src="/original-template/images/slider/shape/shape1.png" alt="#" />
                    <img data-depth="0.20" className="shape shape-16 d-none d-lg-inline-block" src="/original-template/images/slider/shape/shape11.png" alt="#" />
                    <img data-depth="0.20" className="shape shape-17 d-none d-lg-inline-block r-shape" src="/original-template/images/slider/shape/shape3.png" alt="#" />
                    <img data-depth="0.20" className="shape shape-18 d-none d-lg-inline-block" src="/original-template/images/slider/shape/shape12.png" alt="#" />
                    <img data-depth="0.20" className="shape shape-19 d-none d-lg-inline-block r-shape" src="/original-template/images/slider/shape/shape3.png" alt="#" />
                </div>
                {/* /shape-slider */}
                <div className="single-slider slider-height1 container-wrapper d-flex align-items-center z-index1" data-background="/original-template/images/slider/home1-slider-bg.png">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-xl-6  col-lg-6  col-md-6  col-sm-12 col-12  d-flex align-items-center">
                                <div className="slider-content mt--30 position-relative">
                                    <span className="f-700 theme-color d-block pb-1" data-aos="fade-right" data-aos-duration="2000" data-aos-delay="40">교육 분야의 공공데이터와 생성형 AI의 만남!</span>
                                    <h1 className="f-700 pb-22" data-aos="fade-right" data-aos-duration="2000" data-aos-delay="150">제8회 교육 공공데이터<br />AI 활용대회</h1>
                                    <p data-aos="fade-right" data-aos-duration="2000">공공데이터를 활용해 창의적인 교육 서비스 아이디어를 발굴하고,<br />AI 기술과의 융합을 통해 교육 현장의 문제를 해결합니다.<br />당신의 아이디어로 혁신을 꿈꾸세요!</p>
                                    <div className="video-player-btn d-flex align-items-center z-index11 mt-45" >
                                        <a data-fancybox="" href="https://youtu.be/nqye02H_H6I" className="d-flex align-items-center">
                                            <div className="video-play-wrap position-relative d-inline-block">
                                                <div className="video-mark">
                                                    <div className="wave-pulse wave-pulse-1"></div>
                                                    <div className="wave-pulse wave-pulse-2"></div>
                                                </div>
                                                <div className="video-play position-relative text-center theme-bg d-inline-block white-color">
                                                    <i className="fas fa-play"></i>
                                                </div>
                                            </div>
                                            <span className="d-inline-block f-700 black-color pl-22">대회 안내</span>
                                        </a>
                                    </div>{/* /video-player-btn */}
                                </div>
                            </div>{/* /col */}
                            <div className="col-xl-6 col-lg-6  col-md-6  col-sm-12 col-12  d-flex align-items-center ">
                                <div className="slider-img1 mt-25 pl-65 z-index1 position-relative">
                                    <img className="bounce-animate" src="/original-template/images/slider/home1-slider-img.png" alt="image" />
                                    <div className="slider-right-dotted s-dotted position-absolute d-none d-md-block z-index-1">
                                        <img className="bounce-animate2" src="/original-template/images/slider/shape/slider-right-dotted.png" alt="image" />
                                    </div>{/* /slider-right-dotted */}
                                </div>
                            </div>{/* /col */}
                        </div>{/* /row */}
                    </div>{/* /container */}
                    <div className="slider-left-dotted s-dotted position-absolute d-none d-md-block z-index1">
                        <img className="rotate-animation" src="/original-template/images/slider/shape/slider-left-dotted.png" alt="image" />
                    </div>{/* /slider-left-dotted */}
                </div>
            </div>
            {/* slider-area-end  */}

            {/* ====== AI 챗봇 섹션 (OpenAI 스타일) ====== */}
            <ChatbotEmbed />
            {/* chatbot-area-end */}


            {/* ====== about-area-start=========================================== */}
            <div className="about-area over-hidden mt-75 mb-80">
                <div className="container">
                    <div className="row align-items-center  flex-column-reverse flex-lg-row">
                        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                            <div className="about-img img-left-margin text-center" data-aos="fade-right" data-aos-duration="2000">
                                <img className="d-block bounce-animate2" src="/original-template/images/about/home1-about-img.jpg" alt="image" />
                            </div>{/* /about-img */}
                        </div>{/* /col */}
                        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                            <div className="about-content mb-50 mt-10" data-aos="fade-left" data-aos-duration="2000">
                                <div className="title">
                                    <span className="theme-color f-700">대회 소개</span>
                                    <h3 className="f-700">AI를 활용한<br />교육 공공데이터 활용대회</h3>
                                </div>
                                <div className="about-text mt-55 ">
                                    <h6 className="f-400 mb-30">교육부와 한국지능정보사회진흥원 등이 주관하는 이번 대회는 교육 AI 분야 최대 규모의 공모전입니다.</h6>
                                    <p>공공데이터를 활용해 창의적인 교육 서비스 아이디어를 발굴하고, AI 기술과의 융합을 통해 교육 현장의 문제를 해결하고자 개최되었습니다.</p>
                                    <div className="my-btn mt-47">
                                        <a href="about-us.html" className="btn theme-bg text-capitalize f-18 f-700">참가 신청</a>
                                    </div>{/* /my-btn */}
                                </div>
                            </div>{/* /about-content */}
                        </div>{/* /col */}
                    </div>{/* /row */}
                </div>{/* /container */}
            </div>
            {/* about-area-end */}

            {/* ====== service-area-start ==================================== */}
            <div className="service-area over-hidden">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-4  col-lg-4  col-md-4  col-sm-12 col-12">
                            <div className="single-service-content transition5 mt-10 secondary-border01 pl-50 pt-55 pb-35 pr-50 mb-35 mt-30 tilt" data-aos="fade-up">
                                <div className="ser-icon d-inline-block text-center mb-20 transition5">
                                    <img src="/original-template/images/icon/writing-2.png" alt="image" />
                                </div>{/* /ser-icon */}
                                <div className="service-text">
                                    <h6 className="f-700 mb-22">부총리 겸 교육부장관상</h6>
                                    <p>대상 수상팀에게 부총리 겸 교육부장관상과 함께 최대 500만원의 상금이 수여됩니다</p>
                                </div>
                            </div>{/* /single-service-content */}
                        </div>{/* /col */}
                        <div className="col-xl-4  col-lg-4  col-md-4  col-sm-12 col-12">
                            <div className="single-service-content transition5 mt-10 secondary-border01 pl-50 pt-55 pb-35 pr-50 mb-35 mt-30 tilt" data-aos="fade-up" data-aos-duration="1200" data-aos-delay="200">
                                <div className="ser-icon d-inline-block text-center mb-20  transition5">
                                    <img src="/original-template/images/icon/diagram.png" alt="image" />
                                </div>{/* /ser-icon */}
                                <div className="service-text">
                                    <h6 className="f-700 mb-22">총 24팀 시상</h6>
                                    <p>학생 부문과 일반 부문으로 나누어 총 24팀 내외를 선정하여 시상합니다</p>
                                </div>
                            </div>{/* /single-service-content */}
                        </div>{/* /col */}
                        <div className="col-xl-4  col-lg-4  col-md-4  col-sm-12 col-12">
                            <div className="single-service-content transition5 mt-10 secondary-border01 pl-50 pt-55 pb-35 pr-50 mb-35 mt-30 tilt" data-aos="fade-up" data-aos-duration="1200" data-aos-delay="500">
                                <div className="ser-icon d-inline-block text-center mb-20  transition5">
                                    <img src="/original-template/images/icon/gear-1.png" alt="image" />
                                </div>{/* /ser-icon */}
                                <div className="service-text">
                                    <h6 className="f-700 mb-22">누구나 참가 가능</h6>
                                    <p>학생 부문(초·중·고·대학생)과 일반 부문(일반인, 대학원생, 교원, 학부모 등) 누구나 참가 가능합니다</p>
                                </div>
                            </div>{/* /single-service-content */}
                        </div>{/* /col */}
                    </div>{/* /row */}
                </div>{/* /container */}
            </div>
            {/* service-area-end  */}

            {/* ====== feature-area-start=========================================== */}
            <div className="feature-area mt-60 over-hidden">
                <div className="feature-bg bg-no-repeat" data-aos="fade-up" data-aos-duration="1800" data-background="images/feature/home1-feature-bg.png">
                    <div className="container">
                        <div className="row align-items-center mt-10 flex-column-reverse flex-lg-row">
                            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 pr-10">
                                <div className="feature-img img-left-margin mt-35 text-center" data-aos="fade-right" data-aos-duration="2000">
                                    <img className="d-block bounce-animate2" src="/original-template/images/feature/home1-feature-img.png" alt="image" />
                                </div>{/* /feature-img */}
                            </div>{/* /col */}
                            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12 pl-lg-0 pl-xl-3">
                                <div className="feature-content mb-10" data-aos="fade-left" data-aos-duration="2000">
                                    <div className="title">
                                        <span className="theme-color f-700">참가 혜택</span>
                                        <h3 className="f-700 pb-30">다양한 참가 혜택을 확인하세요</h3>
                                        <p>수상과 함께 포트폴리오 인증, 교육 분야 네트워킹 기회를 제공합니다.</p>
                                    </div>
                                    <div className="feature-text mt-30">
                                        <div className="row">
                                            <div className="col-xl-6  col-lg-6 col-md-6  col-sm-6 col-12">
                                                <div className="single-feature-service mb-22">
                                                    <div className="feature-ser-heading d-flex align-items-center mb-1">
                                                        <div className="feature-ser-icon d-inline-block text-center mr-30">
                                                            <span className="theme-color d-block">
                                                                <span className="flat-family flat-family flaticon-012-edit"></span>
                                                            </span>
                                                        </div>{/* /ser-icon */}
                                                        <h6 className="f-700 mb-0">포트폴리오 인증서</h6>
                                                    </div>{/* /feature-ser-heading */}
                                                    <p>수상 시 공식 인증서 발급으로 경력 증빙에 활용 가능</p>
                                                </div>{/* /single-feature-service */}
                                            </div>{/* /col */}
                                            <div className="col-xl-6  col-lg-6 col-md-6  col-sm-6 col-12">
                                                <div className="single-feature-service mb-22">
                                                    <div className="feature-ser-heading d-flex align-items-center mb-1">
                                                        <div className="feature-ser-icon d-inline-block text-center mr-30">
                                                            <span className="theme-color d-block">
                                                                <span className="flat-family flat-family flaticon-012-edit"></span>
                                                            </span>
                                                        </div>{/* /ser-icon */}
                                                        <h6 className="f-700 mb-0">전문가 멘토링</h6>
                                                    </div>{/* /feature-ser-heading */}
                                                    <p>AI 및 교육 분야 전문가의 피드백과 멘토링 제공</p>
                                                </div>{/* /single-feature-service */}
                                            </div>{/* /col */}
                                            <div className="col-xl-6  col-lg-6 col-md-6  col-sm-6 col-12">
                                                <div className="single-feature-service mb-22">
                                                    <div className="feature-ser-heading d-flex align-items-center mb-1">
                                                        <div className="feature-ser-icon d-inline-block text-center mr-30">
                                                            <span className="theme-color d-block">
                                                                <span className="flat-family flat-family flaticon-012-edit"></span>
                                                            </span>
                                                        </div>{/* /ser-icon */}
                                                        <h6 className="f-700 mb-0">네트워킹 기회</h6>
                                                    </div>{/* /feature-ser-heading */}
                                                    <p>교육 AI 분야 전문가 및 참가자들과의 네트워킹</p>
                                                </div>{/* /single-feature-service */}
                                            </div>{/* /col */}
                                            <div className="col-xl-6  col-lg-6 col-md-6  col-sm-6 col-12">
                                                <div className="single-feature-service mb-22">
                                                    <div className="feature-ser-heading d-flex align-items-center mb-1">
                                                        <div className="feature-ser-icon d-inline-block text-center mr-30">
                                                            <span className="theme-color d-block">
                                                                <span className="flat-family flat-family flaticon-012-edit"></span>
                                                            </span>
                                                        </div>{/* /ser-icon */}
                                                        <h6 className="f-700 mb-0">사업화 지원</h6>
                                                    </div>{/* /feature-ser-heading */}
                                                    <p>우수 작품에 대한 사업화 및 후속 연구 지원 기회</p>
                                                </div>{/* /single-feature-service */}
                                            </div>{/* /col */}
                                        </div>{/* /row */}
                                    </div>
                                </div>{/* /feature-content */}
                            </div>{/* /col */}
                        </div>{/* /row */}
                    </div>{/* /container */}
                </div>
            </div>
            {/* feature-area-end */}

            {/* ====== sp-feature-area-start================================================= */}
            <div className="sp-feature-area over-hidden mt--50">
                <div className="sp-feature-bg feature-bg bg-no-repeat pt-220 pb-95" data-aos="fade-up" data-aos-duration="1800" data-background="images/feature/home1-sp-feature-bg.png">
                    <div className="container">
                        <div className="row align-items-center mt-10">
                            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                                <div className="sp-feature-content pr-xl-2 mb-10 mt-45" data-aos="fade-right" data-aos-duration="2000">
                                    <div className="title">
                                        <span className="theme-color f-700">참가 안내</span>
                                        <h3 className="f-700 pb-30">공모전 참가 방법을 확인하세요</h3>
                                        <p>홈페이지를 통한 온라인 접수로 간편하게 참가 신청이 가능합니다.</p>
                                    </div>{/* /title */}
                                    <ul className="sp-feature-text mt-30">
                                        <li className="d-flex">
                                            <span className="sp-feature-icon theme-color d-inline-block mr-20"><i className="fal fa-check"></i></span>
                                            <p>학생 부문: 아이디어 기획, 데이터 분석 / 일반 부문: 서비스 개발</p>
                                        </li>
                                        <li className="d-flex">
                                            <span className="sp-feature-icon theme-color d-inline-block mr-20"><i className="fal fa-check"></i></span>
                                            <p>학생 부문은 개인 또는 3인 이내 팀, 일반 부문은 인원 제한 없음</p>
                                        </li>
                                        <li className="d-flex">
                                            <span className="sp-feature-icon theme-color d-inline-block mr-20"><i className="fal fa-check"></i></span>
                                            <p>서류 접수: 3. 16.(월) ~ 4. 15.(수), 온라인 접수</p>
                                        </li>
                                    </ul>
                                    <div className="my-btn pt-32">
                                        <a href="/contest-info" className="btn theme-bg text-capitalize">공모 요강 보기</a>
                                    </div>{/* /my-btn */}
                                </div>{/* /feature-content */}
                            </div>{/* /col */}
                            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                                <div className="feature-img img-right-margin mt-35 d-flex justify-content-center" data-aos="fade-left" data-aos-duration="2000">
                                    <img className="d-block ml-lg-auto bounce-animate2" src="/original-template/images/feature/home1-sp-feature-img.png" alt="image" />
                                </div>{/* /feature-img */}
                            </div>{/* /col */}
                        </div>{/* /row */}
                    </div>{/* /container */}
                </div>
            </div>
            {/* sp-feature-area-end */}

            {/* ====== facts-area-start=========================================== */}
            <div className="facts-area pb-200">
                <div className="container">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-xl-9  col-lg-10  col-md-11  col-sm-12 col-12">
                            <div className="title text-center">
                                <span className="theme-color f-700">역대 성과</span>
                                <h3 className="f-700 pb-30">숫자로 보는 대회</h3>
                                <p>교육 공공데이터를 활용하여 교육 현장의 문제를 해결하는 AI 솔루션을 개발하고 공유합니다</p>
                            </div>{/* /title */}
                        </div>{/* /col */}
                    </div>{/* /row */}
                    <div className="row">
                        <div className="col-xl-12  col-lg-  col-md-  col-sm- col-">
                            <ul className="facts-wrapper mt-75">
                                <li className="d-inline-block facts1">
                                    <div className="single-facts  white-bg text-center pt-46 pb-50 mb-30">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <span className="f-700 d-inline-block counter">8</span>
                                            <span className="per d-inline-block f-700">+</span>
                                        </div>
                                        <p className="black-color text-center f-700 mb-0 mt-1">역대 횟수</p>
                                    </div>
                                </li>
                                <li className="d-inline-block facts2 theme-bg-fact single-facts-margin-left position-relative">
                                    <div className="single-facts  theme-bg text-center pt-46 pb-50 mb-30">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <span className="white-color f-700 d-inline-block counter">0,000</span>
                                            <span className="white-color d-inline-block f-700">+</span>
                                        </div>
                                        <p className="white-color text-center f-700 mb-0 mt-1">누적 참가자</p>
                                    </div>
                                </li>
                                <li className="d-inline-block facts3 single-facts-margin-left  position-relative">
                                    <div className="single-facts  white-bg text-center pt-46 pb-50 mb-30">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <span className="f-700 d-inline-block counter">0,000</span>
                                            <span className="d-inline-block f-700">+</span>
                                        </div>
                                        <p className="black-color text-center f-700 mb-0 mt-1">누적 출품작</p>
                                    </div>
                                </li>
                                <li className="d-inline-block facts4 theme-bg-fact single-facts-margin-left position-relative">
                                    <div className="single-facts  theme-bg text-center pt-46 pb-50 mb-30">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <span className="white-color f-700 d-inline-block counter">00</span>
                                            <span className="white-color d-inline-block f-700">+</span>
                                        </div>
                                        <p className="white-color text-center f-700 mb-0 mt-1">수상 작품</p>
                                    </div>
                                </li>
                                <li className="d-inline-block facts5 single-facts-margin-left position-relative clear-both">
                                    <div className="single-facts  white-bg text-center pt-46 pb-50 mb-30">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <span className="f-700 d-inline-block counter">3,000</span>
                                            <span className="per d-inline-block f-700">만원</span>
                                        </div>
                                        <p className="black-color text-center f-700 mb-0 mt-1">대회 상금</p>
                                    </div>
                                </li>
                            </ul>{/* /facts-wrapper */}
                        </div>{/* /col */}
                    </div>{/* /row */}
                </div>{/* /container */}
            </div>
            {/* facts-area-end */}

            {/* ====== screenshot-area-start================================================== */}
            <div className="screenshot-area primary-bg mb-200 mt-30 pt-155">
                <div className="container">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-xl-9  col-lg-10 col-md-11  col-sm-12 col-12">
                            <div className="title text-center">
                                <span className="theme-color f-700">역대 수상작</span>
                                <h3 className="f-700 pb-30">우수 작품을 살펴보세요</h3>
                                <p>교육 공공데이터를 활용하여 교육 현장의 문제를 해결하는 AI 솔루션을 개발하고 공유합니다</p>
                            </div>{/* /title */}
                        </div>{/* /col */}
                    </div>{/* /row */}
                    <div className="row">
                        <div className="col-xl-12  col-lg-  col-md-  col-sm- col-">
                            <div className="screenshot-wrapper w-100 mt-180">
                                <div className="gallery position-relative pt-200">
                                    <div className="gallery-controls position-absolute"></div>{/* /gallery-controls */}
                                    <div className="gallery-container w-100">
                                        <img className="gallery-item gallery-item-1" src="/original-template/images/screenshots/home1-screenshots3.jpg" alt="image" data-index="1" />
                                        <img className="gallery-item gallery-item-2" src="/original-template/images/screenshots/home1-screenshots1.jpg" alt="image" data-index="2" />
                                        <img className="gallery-item gallery-item-3" src="/original-template/images/screenshots/home1-screenshots2.jpg" alt="image" data-index="3" />
                                        <img className="gallery-item gallery-item-4" src="/original-template/images/screenshots/home1-screenshots3.jpg" alt="image" data-index="4" />
                                        <img className="gallery-item gallery-item-5" src="/original-template/images/screenshots/home1-screenshots1.jpg" alt="image" data-index="5" />
                                        <img className="gallery-item gallery-item-5" src="/original-template/images/screenshots/home1-screenshots2.jpg" alt="image" data-index="1" />
                                    </div>
                                </div>
                            </div>{/* /screenshot-wrapper */}
                        </div>{/* /col */}
                    </div>{/* /row */}
                </div>{/* /container */}
            </div>
            {/* screenshot-area-end */}

            {/* ====== faq-area-start============================================ */}
            <div className="faq-area pt-130 mb-70 over-hidden">
                <div className="container">
                    <div className="row mt-10">
                        <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12 col-12">
                            <div className="faq-content mt-55 mb-50" data-aos="fade-right" data-aos-duration="2000">
                                <div className="title">
                                    <span className="theme-color f-700">자주 묻는 질문</span>
                                    <h3 className="f-700 pb-30">FAQ</h3>
                                    <p>참가자들이 자주 문의하는 내용을 정리했습니다.</p>
                                </div>
                                <div className="faq-wrapper mt-40">
                                    <div className="accordion" id="accordionExample">
                                        <div className="card border-0">
                                            <div className="card-header card-header-top rounded-0 bg-transparent p-0" id="headingOne">
                                                <h6 className="mb-0">
                                                    <a href="#" className="btn btn-link black-color f-700 border-0 d-block text-left rounded-0 position-relative" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                        참가 자격은 어떻게 되나요?
                                                    </a>
                                                </h6>
                                            </div>{/* /card-header */}
                                            <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                                                <div className="card-body">
                                                    <p className="m-0">학생 부문은 초·중·고교생 및 대학생(개인 또는 3인 이내 팀)이 참가 가능하며, 일반 부문은 일반인, 대학원생, 교원, 학부모, 예비 창업자 등 제한 없이 참가할 수 있습니다.</p>
                                                </div>
                                            </div>{/* /collapseOne */}
                                        </div>{/* /card1 */}

                                        <div className="card border-0">
                                            <div className="card-header bg-transparent p-0" id="headingTwo">
                                                <h6 className="mb-0">
                                                    <a href="#" className="btn btn-link black-color f-700 border-0 d-block text-left rounded-0 position-relative collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                        공모 분야는 무엇인가요?
                                                    </a>
                                                </h6>
                                            </div>{/* /card-header */}

                                            <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                                                <div className="card-body">
                                                    <p className="m-0">학생 부문은 아이디어 기획과 데이터 분석, 일반 부문은 교육 공공데이터 및 AI 기술을 활용한 웹/앱 서비스 개발(프로토타입 포함)입니다.</p>
                                                </div>
                                            </div>
                                        </div>{/* /card2 */}

                                        <div className="card card-header-end border-0">
                                            <div className="card-header bg-transparent p-0" id="headingThree">
                                                <h6 className="mb-0">
                                                    <a href="#" className="btn btn-link black-color f-700 border-0 d-block text-left rounded-0 position-relative collapsed" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                        시상 규모는 어떻게 되나요?
                                                    </a>
                                                </h6>
                                            </div>

                                            <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
                                                <div className="card-body">
                                                    <p className="m-0">총 24팀 내외를 선정합니다. 학생 부문 대상 300만원, 일반 부문 대상 500만원이며, 최우수상·우수상 등 상장과 상금이 수여됩니다.</p>
                                                </div>
                                            </div>
                                        </div>{/* /card */}
                                    </div>{/* /accordion */}
                                </div>{/* /faq-wrapper */}
                            </div>{/* /faq-content */}
                        </div>{/* /col */}
                        <div className="col-xl-6 col-lg-6 offset-lg-0 col-md-10 offset-md-1 col-sm-12 col-12 pr-10">
                            <div className="faq-img img-right-margin text-center" data-aos="fade-left" data-aos-duration="2000">
                                <img className="d-block bounce-animate2" src="/original-template/images/bg/home1-faq-img.png" alt="image" />
                            </div>{/* /faq-img */}
                        </div>{/* /col */}
                    </div>{/* /row */}
                </div>{/* /container */}
            </div>
            {/* faq-area-end */}

            {/* ====== work-area-start ==================================== */}
            <div className="work-area over-hidden">
                <div className="work-bg bg-no-repeat bg-cover pt-200" data-background="/original-template/images/bg/home1-process-bg.png">
                    <div className="container">
                        <div className="row align-items-center justify-content-center">
                            <div className="col-xl-9  col-lg-10  col-md-11  col-sm-12 col-12">
                                <div className="title text-center mt-15">
                                    <span className="theme-color f-700">참가 방법</span>
                                    <h3 className="f-700 pb-30">참가 절차</h3>
                                    <p>교육 공공데이터를 활용하여 교육 현장의 문제를 해결하는 AI 솔루션을 개발하고 공유합니다</p>
                                </div>{/* /title */}
                            </div>{/* /col */}
                        </div>{/* /row */}
                        <div className="work-wrapper pt-105 pb-85">
                            <div className="row">
                                <div className="col-xl-6  col-lg-6  col-md-6  col-sm-12 col-12">
                                    <div className="single-work-content position-relative transition5 white-bg mb-80" data-aos="fade-up" data-aos-duration="2000" data-aos-delay="10">
                                        <div className="item-tag-wrapper rounded-circle text-center transition5">
                                            <div className="item-tag theme-bg d-inline-block text-center rounded-circle position-relative z-index11">
                                                <span className="text-white f-700">01</span>
                                            </div>{/* /item-tag */}
                                        </div>{/* /item-tag-wrapper */}
                                        <div className="d-lg-flex">
                                            <div className="work-icon d-inline-block text-center mr-30">
                                                <span className="d-inline-block">
                                                    <img src="/original-template/images/icon/user.png" alt="image" />
                                                </span>
                                            </div>{/* /work-icon */}
                                            <div className="work-text">
                                                <h5 className="f-700 mb-22">참가 신청</h5>
                                                <p className="m-0">홈페이지에서 참가 신청서를 작성하고 팀 정보를 등록합니다</p>
                                            </div>
                                        </div>
                                    </div>{/* /single-work-content */}
                                </div>{/* /col */}
                                <div className="col-xl-6  col-lg-6  col-md-6  col-sm-12 col-12">
                                    <div className="single-work-content position-relative white-bg mb-80" data-aos="fade-up" data-aos-duration="2000" data-aos-delay="100">
                                        <div className="item-tag-wrapper rounded-circle text-center transition3">
                                            <div className="item-tag theme-bg d-inline-block text-center rounded-circle position-relative z-index11">
                                                <span className="text-white f-700">02</span>
                                            </div>{/* /item-tag */}
                                        </div>{/* /item-tag-wrapper */}
                                        <div className="d-lg-flex">
                                            <div className="work-icon d-inline-block text-center mr-30">
                                                <span className="d-inline-block">
                                                    <img src="/original-template/images/icon/bar.png" alt="image" />
                                                </span>
                                            </div>{/* /work-icon */}
                                            <div className="work-text">
                                                <h5 className="f-700 mb-22">작품 개발</h5>
                                                <p className="m-0">교육 공공데이터를 활용하여 AI 솔루션을 개발합니다</p>
                                            </div>
                                        </div>
                                    </div>{/* /single-work-content */}
                                </div>{/* /col */}
                                <div className="col-xl-6  col-lg-6  col-md-6  col-sm-12 col-12">
                                    <div className="single-work-content position-relative white-bg mb-80" data-aos="fade-up" data-aos-duration="2000" data-aos-delay="10">
                                        <div className="item-tag-wrapper rounded-circle text-center transition3">
                                            <div className="item-tag theme-bg d-inline-block text-center rounded-circle position-relative z-index11">
                                                <span className="text-white f-700">03</span>
                                            </div>{/* /item-tag */}
                                        </div>{/* /item-tag-wrapper */}
                                        <div className="d-lg-flex">
                                            <div className="work-icon d-inline-block text-center mr-30">
                                                <span className="d-inline-block">
                                                    <img src="/original-template/images/icon/shopping-cart-1.png" alt="image" />
                                                </span>
                                            </div>{/* /work-icon */}
                                            <div className="work-text">
                                                <h5 className="f-700 mb-22">작품 제출</h5>
                                                <p className="m-0">완성된 작품과 발표 자료를 온라인으로 제출합니다</p>
                                            </div>
                                        </div>
                                    </div>{/* /single-work-content */}
                                </div>{/* /col */}
                                <div className="col-xl-6  col-lg-6  col-md-6  col-sm-12 col-12">
                                    <div className="single-work-content  position-relative white-bg mb-80" data-aos="fade-up" data-aos-duration="2000" data-aos-delay="100">
                                        <div className="item-tag-wrapper rounded-circle text-center transition3">
                                            <div className="item-tag theme-bg d-inline-block text-center rounded-circle position-relative z-index11">
                                                <span className="text-white f-700">04</span>
                                            </div>{/* /item-tag */}
                                        </div>{/* /item-tag-wrapper */}
                                        <div className="d-lg-flex">
                                            <div className="work-icon d-inline-block text-center mr-30">
                                                <span className="d-inline-block">
                                                    <img src="/original-template/images/icon/briefcase.png" alt="image" />
                                                </span>
                                            </div>{/* /work-icon */}
                                            <div className="work-text">
                                                <h5 className="f-700 mb-22">심사 및 시상</h5>
                                                <p className="m-0">전문 심사위원단의 심사를 거쳐 우수 작품을 시상합니다</p>
                                            </div>
                                        </div>
                                    </div>{/* /single-work-content */}
                                </div>{/* /col */}
                            </div>{/* /row */}
                        </div>{/* /work-wrapper */}
                    </div>{/* /container */}
                </div>{/* /work-bg */}
            </div>
            {/* work-area-end  */}

            {/* ====== testimonial-area-start ==================================== */}
            <div className="testimonial-area mt-130 mb-20 over-hidden">
                <div className="container">
                    <div className="row align-items-center justify-content-center">
                        <div className="col-xl-8  col-lg-10  col-md-11  col-sm-12 col-12">
                            <div className="title text-center mt-20">
                                <span className="theme-color f-700">참가자 후기</span>
                                <h3 className="f-700 pb-30">참가자 후기</h3>
                                <p className="mb-1">교육 공공데이터를 활용하여 교육 현장의 문제를 해결하는 AI 솔루션을 개발하고 공유합니다</p>
                            </div>{/* /title */}
                        </div>{/* /col */}
                    </div>{/* /row */}
                    <div className="testimonial-wrapper1 mt-60">
                        <div className="row align-items-center justify-content-center">
                            <div className="col-xl-4  col-lg-5 col-md-8 col-sm-8 col-10">
                                <div className="testimonial-img">
                                    <img data-aos="zoom-in" data-aos-duration="2000" src="/original-template/images/testimonial/home1-testi-img.png" alt="image" />
                                </div>{/* /testimonial-persons */}
                            </div>{/* /col */}
                            <div className="col-xl-7 offset-xl-1  col-lg-7 col-md-12  col-sm-12 col-12">
                                <div className="testimonial-content position-relative mt-1" data-aos="fade-left" data-aos-duration="2000">
                                    <div className="quit d-inline-block position-absolute left-0 z-index11">
                                        <span className="black-color d-inline-block"><i className="fas fa-quote-left"></i></span>
                                    </div>
                                    <div className="testimonial-active">
                                        <div className="testimonial-text pb-25">
                                            <p className="font-italic secondary-color3">교육 공공데이터를 활용해 학교 현장의 실제 문제를 해결하는 경험이 정말 값졌습니다. 전문가 심사위원단의 피드백도 큰 도움이 되었고, 수상 후 포트폴리오로도 활용하고 있습니다.</p>
                                            <div className="testi-info d-flex mt-50">
                                                <div className="testi-avatar mr-20 rounded-circle">
                                                    <img className="rounded-circle" src="/original-template/images/testimonial/home1-testi-author-img.jpg" alt="image" />
                                                </div>{/* /testi-avatar */}
                                                <div className="avatar-info">
                                                    <h6 className="f-700">김수진</h6>
                                                    <p className="">제7회 대상 수상자</p>
                                                </div>
                                            </div>
                                        </div>{/* /testimonial-text */}
                                        <div className="testimonial-text pb-25">
                                            <p className="font-italic secondary-color3">팀원들과 함께 교육 데이터 분석 프로젝트를 진행하면서 실무 역량을 크게 키울 수 있었습니다. 대회를 통해 얻은 네트워크가 취업에도 큰 도움이 되었습니다.</p>
                                            <div className="testi-info d-flex mt-50">
                                                <div className="testi-avatar mr-20 rounded-circle">
                                                    <img className="rounded-circle" src="/original-template/images/testimonial/home1-testi-author-img.jpg" alt="image" />
                                                </div>{/* /testi-avatar */}
                                                <div className="avatar-info">
                                                    <h6 className="f-700">이현우</h6>
                                                    <p className="">제6회 최우수상 수상자</p>
                                                </div>
                                            </div>
                                        </div>{/* /testimonial-text */}
                                        <div className="testimonial-text pb-25">
                                            <p className="font-italic secondary-color3">현직 교사로서 교육 데이터를 활용한 AI 수업 도구를 개발하여 실제 교실에서 활용하고 있습니다. 이 대회가 교육 혁신의 출발점이 되었습니다.</p>
                                            <div className="testi-info d-flex mt-50">
                                                <div className="testi-avatar mr-20 rounded-circle">
                                                    <img className="rounded-circle" src="/original-template/images/testimonial/home1-testi-author-img.jpg" alt="image" />
                                                </div>{/* /testi-avatar */}
                                                <div className="avatar-info">
                                                    <h6 className="f-700">박지영</h6>
                                                    <p className="">제5회 우수상 수상자 (교원부)</p>
                                                </div>
                                            </div>
                                        </div>{/* /testimonial-text */}
                                    </div>
                                </div>
                            </div>{/* /col */}
                        </div>{/* /row */}
                    </div>{/* /testimonial-wrapper */}
                </div>{/* /container */}
            </div>
            {/* testimonial-area-end  */}

            {/* ====== banner-area-start ========================================= */}
            <div className="banner-area banner-margin-bottom position-relative" data-aos="fade-up" data-aos-duration="1500">
                <div className="container">
                    <div className="banner-wrapper banner-border white-bg pl-70 pr-70 pt-55 pb-75 transition3">
                        <div className="row align-items-center justify-content-between">
                            <div className="col-xl-9 col-lg-9  col-md-12 col-sm-12 col-12">
                                <div className="banner-content">
                                    <h4 className="f-700 mb-18">지금 바로 참가 신청하세요!</h4>
                                    <p className="mb-0">서류 접수 기간: 2026년 3월 16일(월) ~ 4월 15일(수), 온라인 접수</p>
                                </div>{/* /work-banner-content */}
                            </div>{/* /col */}
                            <div className="col-xl-3 col-lg-3  col-md-12 col-sm-12 col-12">
                                <div className="banner-btn float-left float-lg-right">
                                    <div className="my-btn">
                                        <a href="service.html" className="btn theme-bg text-capitalize f-18 f-700">참가 신청</a>
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


        {/* All js here */}
    </>);
}
