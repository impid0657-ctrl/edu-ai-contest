"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react/dist/iconify.js";

/**
 * Custom admin sidebar for contest management.
 * Follows WowDash sidebar pattern but with contest-specific menu items.
 * Do NOT modify the original MasterLayout.jsx (doc 12.1).
 */
const ADMIN_MENU = [
  {
    label: "대시보드",
    path: "/admin",
    icon: "solar:home-smile-angle-outline",
  },
  {
    label: "이용권 관리",
    path: "/admin/license",
    icon: "solar:ticket-outline",
  },
  {
    label: "이용권 학생 직접 신청",
    path: "/admin/verifications",
    icon: "solar:shield-check-outline",
  },
  {
    label: "작품 관리",
    path: "/admin/submissions",
    icon: "solar:document-text-outline",
  },
  {
    label: "심사 결과",
    path: "/admin/review-results",
    icon: "mdi:chart-bar",
  },
  {
    label: "게시판 관리",
    path: "/admin/board",
    icon: "solar:chat-round-dots-outline",
  },
  {
    label: "챗봇 설정",
    path: "/admin/chatbot",
    icon: "mdi:robot-outline",
    exact: true,
  },
  {
    label: "대화 로그",
    path: "/admin/chatbot/logs",
    icon: "mdi:message-text-clock-outline",
  },
  {
    label: "메뉴 관리",
    path: "/admin/pages",
    icon: "solar:hamburger-menu-outline",
  },
  {
    label: "설정",
    path: "/admin/settings",
    icon: "solar:settings-outline",
  },
];

export default function AdminSidebar({ sidebarActive, mobileMenu, onMobileMenuClose }) {
  const pathname = usePathname();

  return (
    <aside
      className={
        sidebarActive
          ? "sidebar active"
          : mobileMenu
          ? "sidebar sidebar-open"
          : "sidebar"
      }
    >
      <button onClick={onMobileMenuClose} type="button" className="sidebar-close-btn">
        <Icon icon="radix-icons:cross-2" />
      </button>
      <div>
        <Link href="/admin" className="sidebar-logo">
          <span className="fw-bold fs-5 text-primary">관리자페이지</span>
        </Link>
      </div>
      <div className="sidebar-menu-area">
        <ul className="sidebar-menu" id="sidebar-menu">
          <li className="sidebar-menu-group-title">대회 관리</li>
          {ADMIN_MENU.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={
                  item.path === "/admin" || item.exact
                    ? pathname === item.path ? "active-page" : ""
                    : pathname.startsWith(item.path) ? "active-page" : ""
                }
              >
                <Icon icon={item.icon} className="menu-icon" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}

          <li className="sidebar-menu-group-title" style={{ marginTop: "16px" }}>계정</li>
          <li>
            <Link href="/admin/logout" className="text-danger-main">
              <Icon icon="solar:logout-2-outline" className="menu-icon" />
              <span>로그아웃</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
