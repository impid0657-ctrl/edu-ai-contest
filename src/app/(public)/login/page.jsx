"use client";

import { createClient } from "@/lib/supabase/client";

/**
 * Login Page — Kakao and Naver OAuth buttons.
 * Uses Supabase Auth signInWithOAuth().
 */
export default function LoginPage() {
  const supabase = createClient();

  const handleOAuthLogin = async (provider) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/callback`,
      },
    });
    if (error) {
      console.error(`OAuth login error (${provider}):`, error.message);
    }
  };

  return (
    <section className="py-5" style={{ minHeight: "calc(100vh - 160px)" }}>
      <div className="container">
        <div className="row justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
          <div className="col-md-5">
            <div className="card border-0 shadow-lg rounded-4 p-4">
              <div className="card-body text-center">
                <h2 className="fw-bold mb-2">로그인</h2>
                <p className="text-muted mb-4">
                  소셜 계정으로 간편하게 시작하세요
                </p>

                {/* Kakao Login Button */}
                <button
                  type="button"
                  className="btn btn-lg w-100 mb-3 fw-bold rounded-pill"
                  id="btn-kakao-login"
                  style={{
                    backgroundColor: "#FEE500",
                    color: "#191919",
                    border: "none",
                  }}
                  onClick={() => handleOAuthLogin("kakao")}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="me-2"
                    style={{ verticalAlign: "text-bottom" }}
                  >
                    <path
                      d="M10 3C5.58 3 2 5.76 2 9.15C2 11.36 3.56 13.27 5.88 14.32L5.1 17.17C5.06 17.31 5.19 17.44 5.33 17.37L8.74 15.21C9.15 15.26 9.57 15.29 10 15.29C14.42 15.29 18 12.53 18 9.15C18 5.76 14.42 3 10 3Z"
                      fill="#191919"
                    />
                  </svg>
                  카카오로 시작하기
                </button>

                {/* Naver Login Button */}
                <button
                  type="button"
                  className="btn btn-lg w-100 mb-4 fw-bold rounded-pill text-white"
                  id="btn-naver-login"
                  style={{
                    backgroundColor: "#03C75A",
                    border: "none",
                  }}
                  onClick={() => handleOAuthLogin("naver")}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="me-2"
                    style={{ verticalAlign: "text-bottom" }}
                  >
                    <path
                      d="M13.36 10.57L6.36 3H3V17H6.64V9.43L13.64 17H17V3H13.36V10.57Z"
                      fill="white"
                    />
                  </svg>
                  네이버로 시작하기
                </button>

                <hr />
                <p className="text-muted small mb-0">
                  로그인 시{" "}
                  <a href="#" className="text-decoration-none">
                    이용약관
                  </a>
                  {" "}및{" "}
                  <a href="#" className="text-decoration-none">
                    개인정보처리방침
                  </a>
                  에 동의합니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
