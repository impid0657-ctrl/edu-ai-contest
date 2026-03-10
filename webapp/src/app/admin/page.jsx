"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

/**
 * Admin Dashboard — Full rebuild
 * Row 1: 핵심 숫자 카드 5개
 * Row 2: 작품 접수 현황 차트 + 이용권 신청 현황 차트
 * Row 3: 최근 접수 목록 + 최근 이용권 신청 목록
 * Row 4: 운영 알림 (미답변 QnA, 학생인증 대기, 챗봇)
 */

const CATEGORY_LABELS = { elementary: "초등부", secondary: "중·고등부", general: "일반부" };
const STATUS_LABELS = { submitted: "접수됨", under_review: "심사중", accepted: "합격", rejected: "불합격" };
const LICENSE_STATUS = { pending: "대기", approved: "승인", rejected: "반려" };

function statusBadge(status, map, colors) {
  return (
    <span className={`bg-${colors[status] || "secondary"}-focus text-${colors[status] || "secondary"}-main px-12 py-4 rounded-pill fw-medium text-sm`}>
      {map[status] || status}
    </span>
  );
}

const SUB_COLORS = { submitted: "warning", under_review: "info", accepted: "success", rejected: "danger" };
const LIC_COLORS = { pending: "warning", approved: "success", rejected: "danger" };

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/dashboard");
        if (res.ok) {
          setStats(await res.json());
        } else {
          const body = await res.json().catch(() => ({}));
          if (res.status === 401) setErrorMsg("관리자 로그인이 필요합니다. /login 페이지에서 로그인해주세요.");
          else if (res.status === 403) setErrorMsg("관리자 권한이 없습니다. Supabase에서 role='admin' 설정이 필요합니다.");
          else setErrorMsg(body.error || `API 오류 (${res.status})`);
          console.error("Dashboard API error:", res.status, body);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setErrorMsg("네트워크 오류: " + err.message);
      }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
        <div className="spinner-border text-primary-600" role="status" />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="card">
        <div className="card-body text-center py-5">
          <Icon icon="mdi:alert-circle-outline" className="text-warning-main text-4xl mb-3" />
          <p className="text-muted mb-2">대시보드 데이터를 불러올 수 없습니다.</p>
          {errorMsg && (
            <div className="alert alert-warning d-inline-block text-sm mt-2" role="alert">
              {errorMsg}
            </div>
          )}
          <div className="mt-3 d-flex gap-2 justify-content-center">
            <button className="btn btn-primary-600" onClick={() => window.location.reload()}>
              다시 시도
            </button>
            {errorMsg.includes("로그인") && (
              <a href="/login" className="btn btn-outline-primary-600">
                로그인 페이지로
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  const remainingSeats = 500 - (stats.license.approved || 0);

  // ── Charts ──
  const categoryChartOpts = {
    chart: { type: "donut" },
    labels: ["초등부", "중·고등부", "일반부"],
    colors: ["#487FFF", "#FF9F29", "#28A745"],
    legend: { position: "bottom", fontSize: "13px" },
    dataLabels: { enabled: true, formatter: (val) => val.toFixed(0) + "%" },
    responsive: [{ breakpoint: 480, options: { chart: { width: 260 } } }],
  };
  const categorySeries = [
    stats.submissions_by_category.elementary,
    stats.submissions_by_category.secondary,
    stats.submissions_by_category.general,
  ];

  const licenseChartOpts = {
    chart: { type: "donut" },
    labels: ["대기", "승인", "반려"],
    colors: ["#FF9F29", "#28A745", "#DC3545"],
    legend: { position: "bottom", fontSize: "13px" },
    dataLabels: { enabled: true, formatter: (val) => val.toFixed(0) + "%" },
    responsive: [{ breakpoint: 480, options: { chart: { width: 260 } } }],
  };
  const licenseSeries = [
    stats.license.pending,
    stats.license.approved,
    stats.license.rejected,
  ];

  const trendChartOpts = {
    chart: { type: "area", toolbar: { show: false }, sparkline: { enabled: false } },
    stroke: { curve: "smooth", width: 2 },
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.05 } },
    colors: ["#487FFF"],
    xaxis: { categories: (stats.daily_trend || []).map((d) => d.date), labels: { style: { fontSize: "11px" } } },
    yaxis: { labels: { style: { fontSize: "11px" } }, min: 0 },
    dataLabels: { enabled: false },
    tooltip: { y: { formatter: (val) => val + "건" } },
  };
  const trendSeries = [{ name: "접수 건수", data: (stats.daily_trend || []).map((d) => d.count) }];

  return (
    <>
      {/* ══ Page Title ══ */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <h6 className="fw-semibold mb-0">대시보드</h6>
        <span className="text-sm text-primary-light">제8회 교육 공공데이터 AI활용대회 관리</span>
      </div>

      {/* ══ Row 1: Stat Cards ══ */}
      <div className="row row-cols-xxxl-5 row-cols-lg-3 row-cols-sm-2 row-cols-1 gy-4">
        <StatCard title="전체 작품 접수" value={stats.submissions.total} icon="mdi:file-document-multiple" bg="cyan" gradient="1" sub={`오늘 +${stats.submissions_today}`} subType="success" />
        <StatCard title="이번 주 접수" value={stats.submissions_this_week} icon="mdi:calendar-week" bg="purple" gradient="2" sub={`금주 누적`} subType="info" />
        <StatCard title="이용권 신청 대기" value={stats.license.pending} icon="mdi:clock-outline" bg="warning-main" gradient="3" sub={`전체 ${stats.license.total}건`} subType="neutral" />
        <StatCard title="이용권 잔여석" value={remainingSeats} icon="mdi:ticket-confirmation-outline" bg="success-main" gradient="4" sub={`${stats.license.approved} / 500 승인`} subType={remainingSeats <= 50 ? "danger" : "success"} />
        <StatCard title="미답변 QnA" value={stats.board.unanswered_qna} icon="mdi:comment-question-outline" bg="red" gradient="5" sub="답변 필요" subType={stats.board.unanswered_qna > 0 ? "danger" : "success"} />
      </div>

      {/* ══ Row 2: Charts ══ */}
      <section className="row gy-4 mt-1">
        {/* 일별 접수 추이 */}
        <div className="col-xxl-8 col-xl-7">
          <div className="card h-100">
            <div className="card-body">
              <div className="d-flex flex-wrap align-items-center justify-content-between mb-3">
                <h6 className="text-lg mb-0">일별 접수 추이 (최근 7일)</h6>
                <span className="text-sm text-primary-light">총 {stats.submissions.total}건</span>
              </div>
              {(stats.daily_trend || []).length > 0 ? (
                <ReactApexChart options={trendChartOpts} series={trendSeries} type="area" height={260} />
              ) : (
                <p className="text-muted text-center py-5">데이터가 없습니다</p>
              )}
            </div>
          </div>
        </div>

        {/* 부문별 접수 */}
        <div className="col-xxl-4 col-xl-5">
          <div className="card h-100">
            <div className="card-header border-bottom bg-base py-16 px-24">
              <h6 className="text-lg mb-0">부문별 접수 현황</h6>
            </div>
            <div className="card-body d-flex justify-content-center align-items-center py-3">
              {categorySeries.some(Boolean) ? (
                <ReactApexChart options={categoryChartOpts} series={categorySeries} type="donut" height={280} />
              ) : (
                <p className="text-muted">접수 데이터 없음</p>
              )}
            </div>
          </div>
        </div>

        {/* 이용권 현황 차트 + 잔여석 */}
        <div className="col-xxl-4 col-xl-5">
          <div className="card h-100">
            <div className="card-header border-bottom bg-base py-16 px-24">
              <h6 className="text-lg mb-0">이용권 신청 현황</h6>
            </div>
            <div className="card-body">
              {licenseSeries.some(Boolean) ? (
                <ReactApexChart options={licenseChartOpts} series={licenseSeries} type="donut" height={220} />
              ) : (
                <p className="text-muted text-center">신청 데이터 없음</p>
              )}
              <div className="mt-16">
                <div className="d-flex justify-content-between text-sm mb-1">
                  <span className="text-primary-light">잔여석</span>
                  <span className="fw-semibold">{stats.license.approved} / 500</span>
                </div>
                <div className="progress" style={{ height: "10px" }}>
                  <div
                    className={`progress-bar ${remainingSeats <= 50 ? "bg-danger-main" : "bg-success-main"}`}
                    style={{ width: `${Math.min((stats.license.approved / 500) * 100, 100)}%` }}
                  />
                </div>
                <p className={`text-sm mt-1 ${remainingSeats <= 50 ? "text-danger-main fw-semibold" : "text-primary-light"}`}>
                  {remainingSeats <= 0 ? "마감됨" : `${remainingSeats}석 남음`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 접수 상태별 카운트 카드 */}
        <div className="col-xxl-8 col-xl-7">
          <div className="card h-100">
            <div className="card-header border-bottom bg-base py-16 px-24">
              <h6 className="text-lg mb-0">접수 상태 요약</h6>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <MiniStat label="접수됨" value={stats.submissions.submitted} color="warning" icon="mdi:file-clock-outline" />
                <MiniStat label="심사중" value={stats.submissions.under_review} color="info" icon="mdi:file-search-outline" />
                <MiniStat label="합격" value={stats.submissions.accepted} color="success" icon="mdi:file-check-outline" />
                <MiniStat label="불합격" value={stats.submissions.rejected} color="danger" icon="mdi:file-remove-outline" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ Row 3: Recent Lists ══ */}
      <section className="row gy-4 mt-1">
        {/* 최근 작품 접수 */}
        <div className="col-xxl-6">
          <div className="card h-100">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
              <h6 className="text-lg mb-0">최근 작품 접수</h6>
              <Link href="/admin/submissions" className="text-primary-600 text-sm fw-medium hover-text-primary">
                전체보기 →
              </Link>
            </div>
            <div className="card-body p-24">
              <div className="table-responsive">
                <table className="table bordered-table mb-0">
                  <thead>
                    <tr>
                      <th className="text-sm">접수번호</th>
                      <th className="text-sm">작품명</th>
                      <th className="text-sm">부문</th>
                      <th className="text-sm">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(stats.recent_submissions || []).length === 0 ? (
                      <tr><td colSpan={4} className="text-center text-muted py-4">접수 내역 없음</td></tr>
                    ) : (
                      stats.recent_submissions.map((s) => (
                        <tr key={s.id}>
                          <td className="text-sm fw-medium">{s.submission_no}</td>
                          <td className="text-sm">{s.title?.length > 20 ? s.title.slice(0, 20) + "…" : s.title}</td>
                          <td className="text-sm">{CATEGORY_LABELS[s.category] || s.category}</td>
                          <td>{statusBadge(s.status, STATUS_LABELS, SUB_COLORS)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* 최근 이용권 신청 */}
        <div className="col-xxl-6">
          <div className="card h-100">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
              <h6 className="text-lg mb-0">최근 이용권 신청</h6>
              <Link href="/admin/license" className="text-primary-600 text-sm fw-medium hover-text-primary">
                전체보기 →
              </Link>
            </div>
            <div className="card-body p-24">
              <div className="table-responsive">
                <table className="table bordered-table mb-0">
                  <thead>
                    <tr>
                      <th className="text-sm">신청자</th>
                      <th className="text-sm">부문</th>
                      <th className="text-sm">학교</th>
                      <th className="text-sm">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(stats.recent_licenses || []).length === 0 ? (
                      <tr><td colSpan={4} className="text-center text-muted py-4">신청 내역 없음</td></tr>
                    ) : (
                      stats.recent_licenses.map((l) => (
                        <tr key={l.id}>
                          <td className="text-sm fw-medium">{l.applicant_name || "-"}</td>
                          <td className="text-sm">{CATEGORY_LABELS[l.category] || l.category}</td>
                          <td className="text-sm">{l.school_name || "-"}</td>
                          <td>{statusBadge(l.status, LICENSE_STATUS, LIC_COLORS)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ Row 4: Alerts & Quick Actions ══ */}
      <section className="row gy-4 mt-1">
        {/* 미답변 QnA */}
        <div className="col-xxl-4 col-xl-6">
          <div className="card h-100">
            <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
              <h6 className="text-lg mb-0">미답변 QnA</h6>
              <Link href="/admin/board" className="text-primary-600 text-sm fw-medium hover-text-primary">
                게시판 →
              </Link>
            </div>
            <div className="card-body p-24">
              {(stats.board.unanswered_qna_list || []).length === 0 ? (
                <div className="text-center py-4">
                  <Icon icon="mdi:check-circle-outline" className="text-success-main text-4xl mb-2" />
                  <p className="text-muted mb-0">모든 QnA에 답변 완료!</p>
                </div>
              ) : (
                <ul className="list-group list-group-flush">
                  {stats.board.unanswered_qna_list.map((q) => (
                    <li key={q.id} className="list-group-item px-0 d-flex justify-content-between align-items-start">
                      <div>
                        <p className="fw-medium mb-1 text-sm">{q.title?.length > 30 ? q.title.slice(0, 30) + "…" : q.title}</p>
                        <span className="text-xs text-primary-light">{q.author_name}</span>
                      </div>
                      <Link href="/admin/board" className="btn btn-outline-primary-600 btn-sm">
                        답변
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* 빠른 작업 */}
        <div className="col-xxl-4 col-xl-6">
          <div className="card h-100">
            <div className="card-header border-bottom bg-base py-16 px-24">
              <h6 className="text-lg mb-0">처리 필요 항목</h6>
            </div>
            <div className="card-body p-24">
              <div className="d-flex flex-column gap-3">
                <AlertItem
                  icon="mdi:account-school"
                  label="학생 인증 승인 대기"
                  value={`${stats.student_verif_pending}건`}
                  href="/admin/verifications"
                  color={stats.student_verif_pending > 0 ? "warning" : "success"}
                />
                <AlertItem
                  icon="mdi:ticket-outline"
                  label="이용권 승인 대기"
                  value={`${stats.license.pending}건`}
                  href="/admin/license"
                  color={stats.license.pending > 0 ? "warning" : "success"}
                />
                <AlertItem
                  icon="mdi:file-document-edit-outline"
                  label="심사 대기 작품"
                  value={`${stats.submissions.submitted}건`}
                  href="/admin/submissions"
                  color={stats.submissions.submitted > 0 ? "info" : "success"}
                />
              </div>
            </div>
          </div>
        </div>

        {/* 챗봇 & 시스템 */}
        <div className="col-xxl-4 col-xl-12">
          <div className="card h-100">
            <div className="card-header border-bottom bg-base py-16 px-24">
              <h6 className="text-lg mb-0">시스템 현황</h6>
            </div>
            <div className="card-body p-24">
              <div className="d-flex flex-column gap-3">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <div className="w-40-px h-40-px bg-primary-100 rounded-circle d-flex justify-content-center align-items-center">
                      <Icon icon="mdi:robot-outline" className="text-primary-600 text-xl" />
                    </div>
                    <div>
                      <p className="fw-medium text-sm mb-0">챗봇 질의</p>
                      <span className="text-xs text-primary-light">누적 대화</span>
                    </div>
                  </div>
                  <h6 className="mb-0">{(stats.chatbot.total_queries || 0).toLocaleString()}건</h6>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <div className="w-40-px h-40-px bg-warning-100 rounded-circle d-flex justify-content-center align-items-center">
                      <Icon icon="mdi:coin-outline" className="text-warning-600 text-xl" />
                    </div>
                    <div>
                      <p className="fw-medium text-sm mb-0">토큰 사용량</p>
                      <span className="text-xs text-primary-light">누적 토큰</span>
                    </div>
                  </div>
                  <h6 className="mb-0">{(stats.chatbot.total_tokens || 0).toLocaleString()}</h6>
                </div>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center gap-2">
                    <div className="w-40-px h-40-px bg-success-100 rounded-circle d-flex justify-content-center align-items-center">
                      <Icon icon="mdi:post-outline" className="text-success-600 text-xl" />
                    </div>
                    <div>
                      <p className="fw-medium text-sm mb-0">전체 게시글</p>
                      <span className="text-xs text-primary-light">공지+FAQ+QnA</span>
                    </div>
                  </div>
                  <h6 className="mb-0">{stats.board.total_posts}건</h6>
                </div>
                <Link href="/admin/chatbot/logs" className="btn btn-outline-primary-600 btn-sm mt-2">
                  챗봇 로그 보기 →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* ── Reusable Components ── */

function StatCard({ title, value, icon, bg, gradient, sub, subType }) {
  return (
    <div className="col">
      <div className={`card shadow-none border bg-gradient-start-${gradient} h-100`}>
        <div className="card-body p-20">
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3">
            <div>
              <p className="fw-medium text-primary-light mb-1">{title}</p>
              <h6 className="mb-0">{typeof value === "number" ? value.toLocaleString() : value}</h6>
            </div>
            <div className={`w-50-px h-50-px bg-${bg} rounded-circle d-flex justify-content-center align-items-center`}>
              <Icon icon={icon} className="text-white text-2xl mb-0" />
            </div>
          </div>
          {sub && (
            <p className="fw-medium text-sm text-primary-light mt-12 mb-0">
              <span className={`text-${subType}-main`}>{sub}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, color, icon }) {
  return (
    <div className="col-md-3 col-sm-6">
      <div className={`bg-${color}-50 border border-${color}-200 rounded-3 p-16 text-center`}>
        <Icon icon={icon} className={`text-${color}-main text-3xl mb-2`} />
        <h5 className={`fw-bold text-${color}-main mb-1`}>{value}</h5>
        <p className="text-sm text-primary-light mb-0">{label}</p>
      </div>
    </div>
  );
}

function AlertItem({ icon, label, value, href, color }) {
  return (
    <Link href={href} className="text-decoration-none">
      <div className={`d-flex align-items-center justify-content-between p-12 rounded-3 border border-${color}-200 bg-${color}-50 hover-bg-${color}-100`}>
        <div className="d-flex align-items-center gap-12">
          <div className={`w-40-px h-40-px bg-${color}-100 rounded-circle d-flex justify-content-center align-items-center`}>
            <Icon icon={icon} className={`text-${color}-main text-xl`} />
          </div>
          <span className="fw-medium text-sm">{label}</span>
        </div>
        <span className={`fw-bold text-${color}-main`}>{value}</span>
      </div>
    </Link>
  );
}
