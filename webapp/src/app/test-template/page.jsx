"use client";
import { useEffect } from "react";

const CSS_FILES = [
  "/original-template/css/bootstrap.min.css",
  "/original-template/css/fontawesome-all.min.css",
  "/original-template/css/flaticon.css",
  "/original-template/css/aos.css",
  "/original-template/css/carousel.css",
  "/original-template/css/animate.css",
  "/original-template/css/slick.css",
  "/original-template/css/jquery.fancybox.min.css",
  "/original-template/css/meanmenu.css",
  "/original-template/css/all-animations.css",
  "/original-template/css/default.css",
  "/original-template/css/style.css",
  "/original-template/css/responsive.css",
];

const JS_FILES = [
  "/original-template/js/vendor/modernizr-3.5.0.min.js",
  "/original-template/js/vendor/jquery-1.12.4.min.js",
  "/original-template/js/popper.min.js",
  "/original-template/js/bootstrap.min.js",
  "/original-template/js/parallax.js",
  "/original-template/js/carousel.js",
  "/original-template/js/isotope.pkgd.min.js",
  "/original-template/js/image-loaded.min.js",
  "/original-template/js/jquery.fancybox.min.js",
  "/original-template/js/waypoint.js",
  "/original-template/js/counterup-min.js",
  "/original-template/js/slick.min.js",
  "/original-template/js/tilt.jquery.min.js",
  "/original-template/js/aos.js",
  "/original-template/js/plugins.js",
  "/original-template/js/jquery.meanmenu.min.js",
  "/original-template/js/main.js",
];

function loadScriptsSequentially(urls) {
  return urls.reduce((promise, url) => {
    return promise.then(() => {
      return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = url;
        script.dataset.evaloOriginal = "true";
        script.onload = resolve;
        script.onerror = resolve; // continue even if one fails
        document.body.appendChild(script);
      });
    });
  }, Promise.resolve());
}

export default function TestTemplatePage() {
  useEffect(() => {
    // CSS link 태그 삽입
    const links = CSS_FILES.map((href) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.dataset.evaloOriginal = "true";
      document.head.appendChild(link);
      return link;
    });
    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap";
    fontLink.dataset.evaloOriginal = "true";
    document.head.appendChild(fontLink);
    links.push(fontLink);

    // JS 순차 로드 (jQuery → Bootstrap → 나머지 순서 보장)
    loadScriptsSequentially(JS_FILES);

    return () => {
      links.forEach((l) => l.remove());
      document.querySelectorAll("[data-evalo-original]").forEach((el) => el.remove());
    };
  }, []);

  return (<>
{/*[if lte IE 9]>
            <p className="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="https://browsehappy.com/">upgrade your browser</a> to improve your experience and security.</p>
        <![endif]*/}
        
        {/*  ====== preloader=============================================  */}
        
     
        {/*  ====== header-area-start=======================================  */}
        <header>
            <div id="header-sticky" className="transparent-header header-area">
                <div className="header">
                    <div className="container">
                        <div className="row align-items-center justify-content-between position-relative">
                            <div className="col-xl-2 col-lg-2 col-md-3 col-sm-5 col-6">
                                <div className="logo">
                                    <a href="index.html" className="d-block"><img src="/original-template/images/logo/logo.png" alt="Evalo" /></a>
                                </div>
                            </div>{/* /col */}
                            <div className="col-xl-7 col-lg-7 col-md-1 col-sm-1 col-1 d-none d-lg-flex justify-content-end position-static">
                                <div className="main-menu">
                                    <nav id="mobile-menu">
                                        <ul className="d-block">
                                            <li className="full-mega-menu-position"><a className="active" href="index.html">Home</a>
                                                <ul className="mega-menu full-mega-menu full-mega-menu1 pt-35 pb-10 pl-30 pr-0 theme-bg">
                                                    <li className="pl-05 pr-05  pb-20">
                                                        <a href="index.html">
                                                            <img className="w100" src="/original-template/images/menu/mega-menu-img1.jpg" alt="image" />
                                                            <span className="d-block black text-md-center f-700 mt-10">Saas 1</span>
                                                        </a>
                                                    </li>
                                                    <li className="pl-05 pr-05 pb-20">
                                                        <a href="index2-sass.html">
                                                            <img className="w100" src="/original-template/images/menu/mega-menu-img2.jpg" alt="image" />
                                                            <span className="d-block black text-md-center f-700 mt-10">Saas 2</span>
                                                        </a>
                                                    </li>
                                                    <li className="pl-05 pr-05 pb-20">
                                                        <a href="index3-digital-agency.html">
                                                            <img className="w100" src="/original-template/images/menu/mega-menu-img3.jpg" alt="image" />
                                                            <span className="d-block black text-md-center f-700 mt-10">Digital Agency</span>
                                                        </a>
                                                    </li>
                                                    <li className="pl-05 pr-05 pb-20">
                                                        <a href="index4-startup.html">
                                                            <img className="w100" src="/original-template/images/menu/mega-menu-img4.jpg" alt="image" />
                                                            <span className="d-block black text-md-center f-700 mt-10">Startup</span>
                                                        </a>
                                                    </li>
                                                    <li className="pl-05 pr-05 pb-20">
                                                        <a href="index5-app-landing-page.html">
                                                            <img className="w100" src="/original-template/images/menu/mega-menu-img5.jpg" alt="image" />
                                                            <span className="d-block black text-md-center f-700 mt-10">App Landing Page</span>
                                                        </a>
                                                    </li>
                                                    <li className="pl-05 pr-05 pb-20">
                                                        <a href="index6-agency.html">
                                                            <img className="w100" src="/original-template/images/menu/mega-menu-img6.jpg" alt="image" />
                                                            <span className="d-block black text-md-center f-700 mt-10">Agency 2</span>
                                                        </a>
                                                    </li>
                                                    <li className="pl-05 pr-05 pb-20">
                                                        <a href="index7-portfolio-minimal.html">
                                                            <img className="w100" src="/original-template/images/menu/mega-menu-img5.jpg" alt="image" />
                                                            <span className="d-block black text-md-center f-700 mt-10">Minimal portfolio</span>
                                                        </a>
                                                    </li>
                                                    <li className="pl-05 pr-05 pb-20">
                                                        <a href="index8-portfolio.html">
                                                            <img className="w100" src="/original-template/images/menu/mega-menu-img1.jpg" alt="image" />
                                                            <span className="d-block black text-md-center f-700 mt-10">Portfolio</span>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li><a href="about-us.html">About</a></li>
                                            <li><a href="service.html">Service</a>
                                                <ul className="mega-menu mega-dropdown-menu white-bg ml-0">
                                                    <li><a href="service.html">Service</a></li>
                                                    <li><a href="login.html">Login</a></li>
                                                </ul>
                                            </li>
                                            <li className="full-mega-menu-position"><a href="#">pages</a>
                                                <ul className="mega-menu full-mega-menu full-mega-menu2 d-lg-flex white-bg pl-35 pt-30 pr-25 pb-20">
                                                    <li>
                                                        <a className="mega-title mb-15" href="#">Home</a>
 
                                                        <ul>
                                                            <li><a href="index.html">Saas</a></li>
                                                            <li><a href="index2-sass.html">Saas 2</a></li>
                                                            <li><a href="index3-digital-agency.html">Digital Agency 1</a></li>
                                                            <li><a href="index4-startup.html">Startup</a></li>
                                                            <li><a href="index5-app-landing-page.html">App Landing</a></li>
                                                            <li><a href="index6-agency.html">Digital Agency 2</a></li>
                                                            <li><a href="index7-portfolio-minimal.html">Minimal Portfolio</a></li>
                                                            <li><a href="index8-portfolio.html">Portfolio</a></li>
                                                        </ul>
                                                    </li>
                                                    <li>
                                                        <a className="mega-title mb-15" href="#">Pages</a>
                                                        <ul>
                                                            <li><a href="about-us.html">About us</a></li>
                                                            <li><a href="service.html">Service</a></li>
                                                            <li><a href="blog-details.html">Service</a></li>
                                                            <li><a href="team.html">Team</a></li>
                                                            <li><a href="contact-us.html">Contact us</a></li>
                                                            <li><a href="faq.html">Faq page</a></li>
                                                            <li><a href="404-error.html">404-error</a></li>
                                                            <li><a href="login.html">Login</a></li>
                                                        </ul>
                                                    </li>
                                                    <li>
                                                        <a className="mega-title mb-15" href="#">Blog</a>
                                                        <ul>
                                                            <li><a href="blog.html">Main Blog Page</a></li>
                                                            <li><a href="blog2.html">Blog Page v2</a></li>
                                                            <li><a href="blog3.html">Blog Page v3</a></li>
                                                            <li><a href="blog-details.html">Blog details 1</a></li>
                                                            <li><a href="blog-details2.html">Blog details 2</a></li>
                                                            <li><a href="blog-details3.html">blog-details 3</a></li>
                                                            <li><a href="blog-details-gallery.html">Blog details gallery</a></li>
                                                            <li><a href="blog-details-quote.html">Blog details quote</a></li>
                                                        </ul>
                                                    </li>
                                                    <li>
                                                        <a className="mega-title mb-25" href="#">Recent Blog</a>
                                                        <ul>
                                                            <li>
                                                                <div className="recent-blog-menu d-flex justify-content-between pb-22">
                                                                    <div className="rbm-img pr-15">
                                                                        <a href="blog-details.html" className="d-inline-block">
                                                                            <img className="w-100 h-100" src="/original-template/images/menu/blog-menu-img1.jpg" alt="image" />
                                                                        </a>
                                                                    </div>
                                                                    <div className="rbm-text">
                                                                        <a href="blog-details.html" className="d-block">
                                                                            <h6 className="mt--5">Lorem ipsum doloram etceio nse</h6>
                                                                        </a>
                                                                        <span className="d-block secondary-color2">Sept 28, 2020</span>
                                                                    </div>
                                                                </div>{/* /recent-blog-menu */}
                                                                <div className="recent-blog-menu d-flex justify-content-between">
                                                                    <div className="rbm-img pr-15">
                                                                        <a href="blog-details.html" className="d-inline-block">
                                                                            <img className="w-100 h-100" src="/original-template/images/menu/blog-menu-img1.jpg" alt="image" />
                                                                        </a>
                                                                    </div>
                                                                    <div className="rbm-text">
                                                                        <a href="blog-details.html" className="d-inline-block">
                                                                            <h6 className="mt--4">Lorem ipsum doloram etceio nse</h6>
                                                                        </a>
                                                                        <span className="d-block secondary-color2">Sept 28, 2020</span>
                                                                    </div>
                                                                </div>{/* /recent-blog-menu */}
                                                            </li>
                                                        </ul>
                                                    </li>
                                                </ul>{/* /mega-menu 2 */}
                                            </li>
                                            <li><a href="blog.html">blog</a>
                                                <ul className="mega-menu mega-dropdown-menu white-bg ml-0">
                                                    <li><a href="blog.html">Blog v1</a></li>
                                                    <li><a href="blog2.html">Blog v2</a></li>
                                                    <li><a href="blog3.html">Blog v3</a></li>
                                                    <li><a href="blog4.html">Blog v4</a></li>
                                                    <li><a href="blog5.html">Blog v5</a></li>
                                                    <li><a href="blog6.html">Blog v6</a></li>
                                                    <li className="position-relative">
                                                        <a href="#">Blog details <span className="pr-20 float-right"><i className="fas fa-angle-right"></i></span></a>
                                                        <div className="mega-menu mega-sub-menu bg-white">
                                                            <ul>
                                                                <li><a href="blog-details.html">Blog details 1</a></li>
                                                                <li><a href="blog-details2.html">Blog details 2</a></li>
                                                                <li><a href="blog-details3.html">blog-details 3</a></li>
                                                                <li><a href="blog-details-gallery.html">Blog details gallery</a></li>
                                                                <li><a href="blog-details-quote.html">Blog details quote</a></li>
                                                            </ul>
                                                        </div>{/* /mega-sub-menu */}
                                                    </li>
                                                </ul>
                                            </li>
                                            <li><a href="contact-us.html">Contact</a>
                                            </li>
                                         </ul>
                                    </nav>
                                </div>{/* /main-menu */}
                            </div>{/* /col */}
                            <div className="col-xl-3  col-lg-3 col-md-6 col-sm-6 col-4 pl-lg-0 pl-xl-3">
                                <div className="header-right d-flex align-items-center justify-content-lg-between justify-content-end">
                                    <ul className="header-login d-none d-lg-block">
                                        <li>
                                            <a className="black-color f-700 black-color" href="login.html" data-toggle="tooltip" data-selector="true" data-placement="bottom" title="Login / Register">
                                            Login</a>
                                        </li>
                                    </ul>
                                    <div className="my-btn ml-20 d-none d-sm-block">
                                        <a href="login.html" className="btn theme-bg text-capitalize">Sign Up</a>
                                    </div>{/* /my-btn */}
                                    <div className="d-block d-lg-none pl-20">
                                        <a className="mobile-menubar theme-color" href="javascript:void(0);"><i className="far fa-bars"></i></a>
                                    </div>
                                    {/* <div className="mobile-menu"></div> */}
                                </div>{/* /header-right */}
                            </div>{/* /col */}
                        </div>{/* /row */}
                    </div>{/* /container */}
                </div>
            </div>{/* /header-bottom */}
        </header>
        {/*  header-area-end  */}


        {/*  ====== header extra info start================================== */}
        {/* side-mobile-menu start */}
        <div className="side-mobile-menu white-bg pt-10 pb-30 pl-35 pr-30 pb-100">
            <div className="d-fle justify-content-between w-100">
                <div className="close-icon d-inline-block float-right clear-both mt-15 mb-10">
                    <a href="javascript:void(0);"><span className="icon-clear theme-color"><i className="fa fa-times"></i></span></a>
                </div>
            </div>
            <div className="mobile-menu mt-10 w-100"></div>
            <ul className="social-link pt-50 clear-both">
                <li className="d-inline-block">
                    <a className="facebook-color text-center pr-15 d-inline-block transition-3" href="#"><i className="fab fa-facebook-f"></i></a>
                </li>
                <li className="d-inline-block">
                    <a className="twitter-color text-center pr-15 d-inline-block transition-3" href="#"><i className="fab fa-twitter"></i></a>
                </li>
                <li className="d-inline-block">
                    <a className="google-plus-color text-center pr-15 d-inline-block transition-3" href="#"><i className="fab fa-google-plus-g"></i></a>
                </li>
                <li className="d-inline-block">
                    <a className="linked-in-color text-center d-inline-block transition-3" href="#"><i className="fab fa-linkedin-in"></i></a>
                </li>
            </ul>{/* social-link */}

            {/* mobile phone area */}
            <div className="mobile-phone-contact phone-contact mt-150 mb-25">
                <h6 className="f-700 mb-0">Call Us</h6>
                <a className="theme-color f-700" href="tell:+8801234567890">+8801234567890</a>
            </div>{/* /mobile phone area */}
            
            {/* mobile subscribe area */}
            <div className="mobile-subscribe pb-125">
                <h6 className="f-700 mb-1">Subscribe to Our Newsletter</h6>
                <form action="#">
                    <div className="subscribe-info mt-10 position-relative">
                        <input className="sub-name form-control border-0 pl-20 pt-15 pb-15 pr-10 primary-bg secondary-color rounded-0" type="email" name="email" id="m-email" placeholder="Submit email" />
                        <span className="secondary-color d-inline-block position-absolute pointer"><i className="far fa-envelope"></i></span>
                    </div>
                </form>
            </div>{/* /mobile subscribe area */}

        </div>{/* /side-mobile-menu */}
        <div className="body-overlay"></div>
        {/* header extra info end  */}
   

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
                <div className="single-slider slider-height1 container-wrapper d-flex align-items-center z-index1" data-background="images/slider/home1-slider-bg.png">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-xl-6  col-lg-6  col-md-6  col-sm-12 col-12  d-flex align-items-center">
                                <div className="slider-content mt--30 position-relative">
                                    <span className="f-700 theme-color d-block pb-1" data-aos="fade-right" data-aos-duration="2000" data-aos-delay="40">Evalo Softweare</span>
                                    <h1 className="f-700 pb-22" data-aos="fade-right" data-aos-duration="2000" data-aos-delay="150">Quality solution to make your tech life easier</h1>
                                    <p data-aos="fade-right" data-aos-duration="2000">Pore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exerction</p>
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
                                            <span className="d-inline-block f-700 black-color pl-22">Play Video</span>
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

            {/* ====== brand-area-start=============================================== */}
            <div className="brand-area brand-height mt-30 over-hidden">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-12  col-lg-12  col-md-12  col-sm-12 col-12">
                            <div className="row align-items-center justify-content-center">
                                <div className="col-xl-2  col-lg-2  col-md-4  col-sm-4 col-6 text-center">
                                    <div className="single-brand mb-40 d-block text-center">
                                        <img className="d-inline-block" src="/original-template/images/brand/brand-logo1.png" alt="image" />
                                    </div>
                                </div>{/* /col */}
                                <div className="col-xl-2  col-lg-2  col-md-4  col-sm-4 col-6 text-center">
                                    <div className="single-brand mb-40 d-block text-center">
                                        <img className="d-inline-block" src="/original-template/images/brand/brand-logo2.png" alt="image" />
                                    </div>
                                </div>{/* /col */}
                                <div className="col-xl-2  col-lg-2  col-md-4  col-sm-4 col-6 text-center">
                                    <div className="single-brand mb-40 d-block text-center">
                                        <img className="d-inline-block" src="/original-template/images/brand/brand-logo3.png" alt="image" />
                                    </div>
                                </div>{/* /col */}
                                <div className="col-xl-2  col-lg-2  col-md-4  col-sm-4 col-6 text-center">
                                    <div className="single-brand mb-40 d-block text-center">
                                        <img className="d-inline-block" src="/original-template/images/brand/brand-logo4.png" alt="image" />
                                    </div>
                                </div>{/* /col */}
                                <div className="col-xl-2  col-lg-2  col-md-4  col-sm-4 col-6 text-center">
                                    <div className="single-brand mb-40 d-block text-center">
                                        <img className="d-inline-block" src="/original-template/images/brand/brand-logo5.png" alt="image" />
                                    </div>
                                </div>{/* /col */}
                                <div className="col-xl-2  col-lg-2  col-md-4  col-sm-4 col-6 text-center">
                                    <div className="single-brand mb-40 d-block text-center">
                                        <img className="d-inline-block" src="/original-template/images/brand/brand-logo6.png" alt="image" />
                                    </div>
                                </div>{/* /col */}
                            </div>{/* /row */}
                        </div>{/* /col */}
                    </div>{/* /row */}
                </div>{/* /container */}
            </div>
            {/* brand-area-end  */}


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
                                    <span className="theme-color f-700">Learn more about us</span>
                                    <h3 className="f-700">Innovative application with easy access</h3>
                                </div>
                                <div className="about-text mt-55 ">
                                    <h6 className="f-400 mb-30">Phasellus seiusmod tempor incididunt ut labore et dolore magna aliqud minim veniam</h6>
                                    <p>Bole nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nua.</p>
                                    <div className="my-btn mt-47">
                                        <a href="about-us.html" className="btn theme-bg text-capitalize f-18 f-700">Get Started</a>
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
                                    <h6 className="f-700 mb-22">Big Data Analysis</h6>
                                    <p>Ovitae purus soda duis eu ers auctor augue ultricie conse ctetur adipisicing elit</p>
                                </div>
                            </div>{/* /single-service-content */}
                        </div>{/* /col */}
                        <div className="col-xl-4  col-lg-4  col-md-4  col-sm-12 col-12">
                            <div className="single-service-content transition5 mt-10 secondary-border01 pl-50 pt-55 pb-35 pr-50 mb-35 mt-30 tilt" data-aos="fade-up" data-aos-duration="1200" data-aos-delay="200">
                                <div className="ser-icon d-inline-block text-center mb-20  transition5">
                                    <img src="/original-template/images/icon/diagram.png" alt="image" />
                                </div>{/* /ser-icon */}
                                <div className="service-text">
                                    <h6 className="f-700 mb-22">Big Data Analysis</h6>
                                    <p>Ovitae purus soda duis eu ers auctor augue ultricie conse ctetur adipisicing elit</p>
                                </div>
                            </div>{/* /single-service-content */}
                        </div>{/* /col */}
                        <div className="col-xl-4  col-lg-4  col-md-4  col-sm-12 col-12">
                            <div className="single-service-content transition5 mt-10 secondary-border01 pl-50 pt-55 pb-35 pr-50 mb-35 mt-30 tilt" data-aos="fade-up" data-aos-duration="1200" data-aos-delay="500">
                                <div className="ser-icon d-inline-block text-center mb-20  transition5">
                                    <img src="/original-template/images/icon/gear-1.png" alt="image" />
                                </div>{/* /ser-icon */}
                                <div className="service-text">
                                    <h6 className="f-700 mb-22">Big Data Analysis</h6>
                                    <p>Ovitae purus soda duis eu ers auctor augue ultricie conse ctetur adipisicing elit</p>
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
                                        <span className="theme-color f-700">Learn more about us</span>
                                        <h3 className="f-700 pb-30">Generate sales and manage earning</h3>
                                        <p>Bole nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
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
                                                        <h6 className="f-700 mb-0">Easy Control Panel</h6>
                                                    </div>{/* /feature-ser-heading */}
                                                    <p>Bommodo dolor sit amet otire conse ctetur adipisic</p>
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
                                                        <h6 className="f-700 mb-0">Details Reporting</h6>
                                                    </div>{/* /feature-ser-heading */}
                                                    <p>Bommodo dolor sit amet otire conse ctetur adipisic</p>
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
                                                        <h6 className="f-700 mb-0">Sales Comparison</h6>
                                                    </div>{/* /feature-ser-heading */}
                                                    <p>Bommodo dolor sit amet otire conse ctetur adipisic</p>
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
                                                        <h6 className="f-700 mb-0">Manage Earning</h6>
                                                    </div>{/* /feature-ser-heading */}
                                                    <p>Bommodo dolor sit amet otire conse ctetur adipisic</p>
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
                                        <span className="theme-color f-700">Learn more about us</span>
                                        <h3 className="f-700 pb-30">Online reporting to get best of business</h3>
                                        <p>Bole nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                    </div>{/* /title */}
                                    <ul className="sp-feature-text mt-30">
                                        <li className="d-flex">
                                            <span className="sp-feature-icon theme-color d-inline-block mr-20"><i className="fal fa-check"></i></span>
                                            <p>Bommodo dolor sit amet, conse ctetur adipisic ing elit, sed do eiusmod tempor</p>
                                        </li>
                                        <li className="d-flex">
                                            <span className="sp-feature-icon theme-color d-inline-block mr-20"><i className="fal fa-check"></i></span>
                                            <p>Ladipisic ing elit, sed do eiusmod tempor kotore bolis</p>
                                        </li>
                                        <li className="d-flex">
                                            <span className="sp-feature-icon theme-color d-inline-block mr-20"><i className="fal fa-check"></i></span>
                                            <p>Sit amet, conse ctetur adipisic ing elit sed do</p>
                                        </li>
                                    </ul>
                                    <div className="my-btn pt-32">
                                        <a href="about-us.html" className="btn theme-bg text-capitalize">More Details</a>
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
                                <span className="theme-color f-700">Learn more about us</span>
                                <h3 className="f-700 pb-30">Numbers Never Tell A Lie</h3>
                                <p>Bole nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo conididunt ut labore et dolore magna aliqua ut enim ad minim veniam</p>
                            </div>{/* /title */}
                        </div>{/* /col */}
                    </div>{/* /row */}
                    <div className="row">
                        <div className="col-xl-12  col-lg-  col-md-  col-sm- col-">
                            <ul className="facts-wrapper mt-75">
                                <li className="d-inline-block facts1">
                                    <div className="single-facts  white-bg text-center pt-46 pb-50 mb-30">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <span className="f-700 d-inline-block counter">20</span>
                                            <span className="per d-inline-block f-700">+</span>
                                        </div>
                                        <p className="black-color text-center f-700 mb-0 mt-1">Moudle</p>
                                    </div>    
                                </li>
                                <li className="d-inline-block facts2 theme-bg-fact single-facts-margin-left position-relative">
                                    <div className="single-facts  theme-bg text-center pt-46 pb-50 mb-30">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <span className="white-color f-700 d-inline-block counter">100</span>
                                            <span className="white-color d-inline-block f-700">K</span>
                                        </div>
                                        <p className="white-color text-center f-700 mb-0 mt-1">Lines of Code</p>
                                    </div>    
                                </li>
                                <li className="d-inline-block facts3 single-facts-margin-left  position-relative">
                                    <div className="single-facts  white-bg text-center pt-46 pb-50 mb-30">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <span className="f-700 d-inline-block counter">10</span>
                                            <span className="d-inline-block f-700">+</span>
                                        </div>
                                        <p className="black-color text-center f-700 mb-0 mt-1">Report Modeling</p>
                                    </div>    
                                </li>
                                <li className="d-inline-block facts4 theme-bg-fact single-facts-margin-left position-relative">
                                    <div className="single-facts  theme-bg text-center pt-46 pb-50 mb-30">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <span className="white-color f-700 d-inline-block counter">50</span>
                                            <span className="white-color d-inline-block f-700">+</span>
                                        </div>
                                        <p className="white-color text-center f-700 mb-0 mt-1">Color Sceme</p>
                                    </div>    
                                </li>
                                <li className="d-inline-block facts5 single-facts-margin-left position-relative clear-both">
                                    <div className="single-facts  white-bg text-center pt-46 pb-50 mb-30">
                                        <div className="d-flex align-items-center justify-content-center">
                                            <span className="f-700 d-inline-block counter">500</span>
                                            <span className="per d-inline-block f-700">K</span>
                                        </div>
                                        <p className="black-color text-center f-700 mb-0 mt-1">Active user</p>
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
                                <span className="theme-color f-700">Screenshots</span>
                                <h3 className="f-700 pb-30">Have A Close Look</h3>
                                <p>Bole nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo conididunt ut labore et dolore magna aliqua ut enim ad minim veniam</p>
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
                                    <span className="theme-color f-700">What people want to know</span>
                                    <h3 className="f-700 pb-30">Frequently Asked Questions</h3>
                                    <p>Bole nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                                </div>
                                <div className="faq-wrapper mt-40">
                                    <div className="accordion" id="accordionExample">
                                        <div className="card border-0">
                                            <div className="card-header card-header-top rounded-0 bg-transparent p-0" id="headingOne">
                                                <h6 className="mb-0">
                                                    <a href="#" className="btn btn-link black-color f-700 border-0 d-block text-left rounded-0 position-relative" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                                        How can I install this application?
                                                    </a>
                                                </h6>
                                            </div>{/* /card-header */}
                                            <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordionExample">
                                                <div className="card-body">
                                                    <p className="m-0">Ovitae purus soda duis eu ers auctor augue ultricie conse ctetur adipisicing nisi ut aliquip ex ea commodo quat Duis aute irure dolor in reprehenderit in volupta</p>
                                                </div>
                                            </div>{/* /collapseOne */}
                                        </div>{/* /card1 */}
        
                                        <div className="card border-0">
                                            <div className="card-header bg-transparent p-0" id="headingTwo">
                                                <h6 className="mb-0">
                                                    <a href="#" className="btn btn-link black-color f-700 border-0 d-block text-left rounded-0 position-relative collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                                                        How to update the features of Evalo?
                                                    </a>
                                                </h6>
                                            </div>{/* /card-header */}
        
                                            <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
                                                <div className="card-body">
                                                    <p className="m-0">Ovitae purus soda duis eu ers auctor augue ultricie conse ctetur adipisicing nisi ut aliquip ex ea commodo quat Duis aute irure dolor in reprehenderit in volupta </p>
                                                </div>
                                            </div>
                                        </div>{/* /card2 */}
        
                                        <div className="card card-header-end border-0">
                                            <div className="card-header bg-transparent p-0" id="headingThree">
                                                <h6 className="mb-0">
                                                    <a href="#" className="btn btn-link black-color f-700 border-0 d-block text-left rounded-0 position-relative collapsed" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                                                        Why Evalo is a great startup template?
                                                    </a>
                                                </h6>
                                            </div>
        
                                            <div id="collapseThree" className="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
                                                <div className="card-body">
                                                    <p className="m-0">Ovitae purus soda duis eu ers auctor augue ultricie conse ctetur adipisicing nisi ut aliquip ex ea commodo quat Duis aute irure dolor in reprehenderit in volupta </p>
                                                </div>
                                            </div>
                                        </div>{/* /card */}
                                    </div>{/* /accordion */}
                                </div>{/* /faq-wrapper */}
                            </div>{/* /faq-content */}
                        </div>{/* /col */}
                        <div className="col-xl-6 col-lg-6 offset-lg-0 col-md-10 offset-md-1 col-sm-12 col-12 pr-10">
                            <div className="faq-img img-right-margin text-center"  data-aos="fade-left" data-aos-duration="2000">
                                <img className="d-block bounce-animate2" src="/original-template/images/bg/home1-faq-img.png" alt="image" />
                            </div>{/* /faq-img */}
                        </div>{/* /col */}
                    </div>{/* /row */}
                </div>{/* /container */}
            </div>
            {/* faq-area-end */}

            {/* ====== work-area-start ==================================== */}
            <div className="work-area over-hidden">
                <div className="work-bg bg-no-repeat bg-cover pt-200" data-background="images/bg/home1-process-bg.png">
                    <div className="container">
                        <div className="row align-items-center justify-content-center">
                            <div className="col-xl-9  col-lg-10  col-md-11  col-sm-12 col-12">
                                <div className="title text-center mt-15">
                                    <span className="theme-color f-700">Process</span>
                                    <h3 className="f-700 pb-30">How It Works</h3>
                                    <p>Bole nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo conididunt ut labore et dolore magna aliqua ut enim ad minim veniam</p>
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
                                                <h5 className="f-700 mb-22">Signup for Service</h5>
                                                <p className="m-0">Ovitae purus soda duis eu ers auctor augue ultrici cing elit, sed do eius emod tempor incid</p>
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
                                                <h5 className="f-700 mb-22">Research & Development</h5>
                                                <p className="m-0">Ovitae purus soda duis eu ers auctor augue ultrici cing elit, sed do eius emod tempor incid</p>
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
                                                <h5 className="f-700 mb-22">Sales & Earning</h5>
                                                <p className="m-0">Ovitae purus soda duis eu ers auctor augue ultrici cing elit, sed do eius emod tempor incid</p>
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
                                                <h5 className="f-700 mb-22">Transfer Funds to Bank</h5>
                                                <p className="m-0">Ovitae purus soda duis eu ers auctor augue ultrici cing elit, sed do eius emod tempor incid</p>
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
                                <span className="theme-color f-700">Testimonial</span>
                                <h3 className="f-700 pb-30">What People Say</h3>
                                <p className="mb-1">Bole nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo conididunt ut labore et dolore magna aliqua ut enim ad minim veniam</p>
                            </div>{/* /title */}
                        </div>{/* /col */}
                    </div>{/* /row */}
                    <div className="testimonial-wrapper1 mt-60">
                        <div className="row align-items-center justify-content-center">
                            <div className="col-xl-4  col-lg-5 col-md-8 col-sm-8 col-10">
                                <div className="testimonial-img">
                                    <img  data-aos="zoom-in" data-aos-duration="2000" src="/original-template/images/testimonial/home1-testi-img.png" alt="image" />
                                </div>{/* /testimonial-persons */}
                            </div>{/* /col */}
                            <div className="col-xl-7 offset-xl-1  col-lg-7 col-md-12  col-sm-12 col-12">
                                <div className="testimonial-content position-relative mt-1" data-aos="fade-left" data-aos-duration="2000">
                                    <div className="quit d-inline-block position-absolute left-0 z-index11">
                                        <span className="black-color d-inline-block"><i className="fas fa-quote-left"></i></span>
                                    </div>
                                    <div className="testimonial-active">
                                        <div className="testimonial-text pb-25">
                                            <p className="font-italic secondary-color3">Olireipum dolor sit amet, consectetur adipisicing elit, sed do eius mod tempor incididunt ut labore et dolore magna aliqu Lor em ipsum dolor sit amet, consecte tur adipisicing elit, sed do eiusmod tempor</p>
                                            <div className="testi-info d-flex mt-50">
                                                <div className="testi-avatar mr-20 rounded-circle">
                                                    <img className="rounded-circle" src="/original-template/images/testimonial/home1-testi-author-img.jpg" alt="image" />
                                                </div>{/* /testi-avatar */}
                                                <div className="avatar-info">
                                                    <h6 className="f-700">Nayna Eva</h6>
                                                    <p className="">Web Designer</p>
                                                </div>
                                            </div>
                                        </div>{/* /testimonial-text */}
                                        <div className="testimonial-text pb-25">
                                            <p className="font-italic secondary-color3">Olireipum dolor sit amet, consectetur adipisicing elit, sed do eius mod tempor incididunt ut labore et dolore magna aliqu Lor em ipsum dolor sit amet, consecte tur adipisicing elit, sed do eiusmod tempor</p>
                                            <div className="testi-info d-flex mt-50">
                                                <div className="testi-avatar mr-20 rounded-circle">
                                                    <img className="rounded-circle" src="/original-template/images/testimonial/home1-testi-author-img.jpg" alt="image" />
                                                </div>{/* /testi-avatar */}
                                                <div className="avatar-info">
                                                    <h6 className="f-700">Nayna Eva</h6>
                                                    <p className="">Web Designer</p>
                                                </div>
                                            </div>
                                        </div>{/* /testimonial-text */}
                                        <div className="testimonial-text pb-25">
                                            <p className="font-italic secondary-color3">Olireipum dolor sit amet, consectetur adipisicing elit, sed do eius mod tempor incididunt ut labore et dolore magna aliqu Lor em ipsum dolor sit amet, consecte tur adipisicing elit, sed do eiusmod tempor</p>
                                            <div className="testi-info d-flex mt-50">
                                                <div className="testi-avatar mr-20 rounded-circle">
                                                    <img className="rounded-circle" src="/original-template/images/testimonial/home1-testi-author-img.jpg" alt="image" />
                                                </div>{/* /testi-avatar */}
                                                <div className="avatar-info">
                                                    <h6 className="f-700">Nayna Eva</h6>
                                                    <p className="">Web Designer</p>
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
                                    <h4 className="f-700 mb-18">Starts a 30 days free trial</h4>
                                    <p className="mb-0">Bole nostrud exercim ipsum dolor sit amet, consectetur adipisicing </p>
                                </div>{/* /work-banner-content */}
                            </div>{/* /col */}
                            <div className="col-xl-3 col-lg-3  col-md-12 col-sm-12 col-12">
                                <div className="banner-btn float-left float-lg-right">
                                    <div className="my-btn">
                                        <a href="service.html" className="btn theme-bg text-capitalize f-18 f-700">Get Started</a>
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
        <footer> 
            <div className="footer-area primary-bg pt-200">
                <div className="footer-top pb-55">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-3  col-lg-4  col-md-12  col-sm-12 col-12">
                                <div className="footer-widget f-subscriber-area pb-30 mt-25">
                                    <h6 className="text-capitalize f-700 mb-22">Subscribe Us</h6>
                                    <div className="footer-subscribe">
                                        <p>Fectetur adipisicing elit, sed do eius mod tempor</p>
                                        <form action="#">
                                            <div className="subscribe-info mt-22 position-relative">
                                                <input className="sub-name form-control border-0 pl-20 pt-15 pb-15 pr-10 white-bg secondary-color rounded-0" type="email" name="email" id="email" placeholder="Submit email" />
                                                <span className="secondary-color d-inline-block position-absolute pointer"><i className="far fa-envelope"></i></span>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>{/* /col */}
                            <div className="col-xl-2 offset-xl-1  col-lg-2  col-md-3  col-sm-6 col-12">
                                <div className="footer-widget f-info pb-30 ml-40 pr-20 mt-25">
                                    <h6 className="text-capitalize f-700 mb-22">Service</h6>
                                    <ul className="footer-info">
                                        <li>
                                            <a href="about-us.html" className="position-relative d-inline-block mb-2">Development</a>
                                        </li>
                                        <li>
                                            <a href="about-us.html" className="position-relative d-inline-block mb-2">Maintanance</a>
                                        </li>
                                        <li>
                                            <a href="about-us.html" className="position-relative d-inline-block mb-2">Consultancy</a>
                                        </li>
                                        <li>
                                            <a href="about-us.html" className="position-relative d-inline-block mb-2">Design</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>{/* /col */}
                            <div className="col-xl-2  col-lg-2  col-md-3  col-sm-6 col-12">
                                <div className="footer-widget f-info pb-30 ml-40 pr-20 mt-25">
                                    <h6 className="text-capitalize f-700 mb-22">Help</h6>
                                    <ul className="footer-info">
                                        <li>
                                            <a href="about-us.html" className="position-relative d-inline-block mb-2">Documentation</a>
                                        </li>
                                        <li>
                                            <a href="about-us.html" className="position-relative d-inline-block mb-2">Sitemap</a>
                                        </li>
                                        <li>
                                            <a href="about-us.html" className="position-relative d-inline-block mb-2">Legal Advice</a>
                                        </li>
                                        <li>
                                            <a href="about-us.html" className="position-relative d-inline-block mb-2">Support</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>{/* /col */}
                            <div className="col-xl-3  col-lg-4  col-md-6  col-sm-12 col-12 pr-xl-0">
                                <div className="footer-widget f-adress pb-40 mt-25">
                                    <h6 className="text-capitalize f-700 mb-22">Get in Touch</h6>
                                    <ul className="footer-address">
                                        <li className="d-flex align-items-start">
                                            <span className="f-icon mr-20 mt-1"><i className="fas fa-map-marker-alt"></i></span> 
                                            <div className="">
                                                22/1 Bardeshi, Amin Bazar <br />Dhaka 1348 <br />
                                            </div>  
                                        </li>
                                        <li>
                                            <span className="f-icon mr-20 mt-1"><i className="far fa-envelope"></i></span>
                                            hello@startico.com
                                        </li>
                                    </ul>
                                    <ul className="social-link mt-15">
                                        <li className="d-inline-block">
                                            <a className="facebook-color text-center pr-15 d-inline-block transition-3" href="#"><i className="fab fa-facebook-f"></i></a>
                                        </li>
                                        <li className="d-inline-block">
                                            <a className="twitter-color text-center pr-15 d-inline-block transition-3" href="#"><i className="fab fa-twitter"></i></a>
                                        </li>
                                        <li className="d-inline-block">
                                            <a className="youtube-color text-center pr-15 d-inline-block transition-3" href="#"><i className="fab fa-youtube"></i></a>
                                        </li>
                                        <li className="d-inline-block">
                                            <a className="instagram-color text-center d-inline-block transition-3" href="#"><i className="fab fa-instagram"></i></a>
                                        </li>
                                    </ul>{/* social-link */}
                                </div>
                            </div>{/* /col */}
                        </div>{/* /row */}
                    </div>{/* /container */}
                </div>
                <div className="footer-bottom">
                    <div className="container">
                        <div className="copyright-area mt-20 pb-50">
                            <div className="row align-items-center">
                                <div className="col-xl-6  col-lg-6  col-md-6  col-sm-12 col-12 mb-10">
                                    <div className="f-logo text-center text-md-left">
                                        <img src="/original-template/images/logo/logo.png" alt="image" />
                                    </div>{/* /f-logo */}
                                </div>{/* /col */}
                                <div className="col-xl-6  col-lg-6  col-md-6  col-sm-12 col-12 mb-10">
                                    <div className="phone-contact text-center text-md-right">
                                        <a className="theme-color f-700" href="tell:+8801234567890"><span className="pr-1"><span className="d-inline-block"><i className="fas fa-phone-alt"></i></span></span> +880 1234 567 890</a>
                                    </div>
                                </div>{/* /col */}
                            </div>{/* /row */}
                            <div className="row align-items-center justify-content-between">
                                <div className="col-xl-6  col-lg-5  col-md-12  col-sm-12 col-12">
                                    <div className="copyright-text text-center text-lg-left mt-20 mb-20">
                                        <p className="mb-0 secondary-color2">All rights reserved 
                                            <a href="https://themeforest.net/user/ethemestudio/portfolio" className="c-theme f-700 black-color">eThemeStudio</a>  ©  2022
                                        </p>
                                    </div>
                                </div>{/* /col */}
                                <div className="col-xl-6  col-lg-7  col-md-12  col-sm-12 col-12">
                                    <ul className="useful-link text-center text-lg-right mt-20">
                                        <li className="d-inline-block mb-20">
                                            <a href="#" className="secondary-color d-inline-block">Terms &amp; Condition</a>
                                        </li>
                                        <li className="d-inline-block pl-45 mb-20">
                                            <a href="#" className="secondary-color d-inline-block">Privacy</a>
                                        </li>
                                        <li className="d-inline-block pl-45 mb-20">
                                            <a href="#" className="secondary-color d-inline-block">Cookes</a>
                                        </li>                                    
                                    </ul>{/* social */}
                                </div>{/* /col */}
                            </div>
                        </div>{/* /copyright-area */}
                    </div>{/* /container */}
                </div>
            </div>
        </footer>

        {/* back top */}
        <div id="scroll" className="scroll-up position-relative z-index11">
            <div className="top text-center"><span className="white-color theme-bg"><i className="fa fa-arrow-alt-up"></i></span></div>
        </div>

        {/* All js here */}
  </>);
}
