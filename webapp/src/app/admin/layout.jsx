"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import AdminSidebar from "@/components/AdminSidebar";
import ThemeToggleButton from "@/helper/ThemeToggleButton";
import PluginInit from "@/helper/PluginInit";
import "@/app/admin-globals.css";
import "@/app/font.css";
// public-site.css removed — public/admin CSS must be separate (Bootstrap 4 vs 5 conflict)

/**
 * Admin Layout — wraps admin pages with AdminSidebar.
 * Follows WowDash MasterLayout pattern (doc 12.1).
 * Includes client-side auth guard: if not logged in as admin → redirect to /login.
 */
export default function AdminLayout({ children }) {
  const [sidebarActive, setSidebarActive] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          // 풀 리로드로 이동 — 클라이언트 라우팅 시 admin CSS가 유지되어 login 깨지는 문제 방지
          window.location.href = "/login?redirect=" + encodeURIComponent(window.location.pathname);
          return;
        }
        const data = await res.json();
        if (!data.user || data.user.role !== "admin") {
          window.location.href = "/access-denied";
          return;
        }
        setAuthorized(true);
      } catch {
        window.location.href = "/login?error=auth_unavailable";
      } finally {
        setAuthChecked(true);
      }
    })();
  }, []);

  // Show loading while checking auth
  if (!authChecked || !authorized) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f4f6f9",
        fontFamily: "'Segoe UI', -apple-system, sans-serif",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 40, height: 40, border: "4px solid #e0e0e0",
            borderTop: "4px solid #487FFF", borderRadius: "50%",
            animation: "spin 0.8s linear infinite", margin: "0 auto 16px",
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: "#888", fontSize: "14px" }}>관리자 인증 확인 중...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <PluginInit />
    <section className={mobileMenu ? "overlay active" : "overlay"}>
      <AdminSidebar
        sidebarActive={sidebarActive}
        mobileMenu={mobileMenu}
        onMobileMenuClose={() => setMobileMenu(false)}
      />

      <main
        className={sidebarActive ? "dashboard-main active" : "dashboard-main"}
      >
        {/* Top Navbar */}
        <div className="navbar-header">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto">
              <div className="d-flex flex-wrap align-items-center gap-4">
                <button
                  type="button"
                  className="sidebar-toggle"
                  onClick={() => {
                    setSidebarActive(!sidebarActive);
                    setMobileMenu(false);
                  }}
                >
                  <Icon
                    icon="heroicons:bars-3-solid"
                    className="icon text-2xl non-active"
                  />
                  <Icon
                    icon="iconoir:arrow-right"
                    className="icon text-2xl active"
                  />
                </button>
                <button
                  type="button"
                  className="sidebar-mobile-toggle"
                  onClick={() => setMobileMenu(!mobileMenu)}
                >
                  <Icon icon="heroicons:bars-3-solid" className="icon" />
                </button>
              </div>
            </div>
            <div className="col-auto">
              <div className="d-flex flex-wrap align-items-center gap-3">
                <ThemeToggleButton />
              </div>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="dashboard-main-body">{children}</div>

        {/* Footer */}
        <footer className="d-footer">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto">
              <p className="mb-0">
                © 2026 제8회 교육 공공데이터 AI활용대회. All Rights Reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </section>
    </>
  );
}
