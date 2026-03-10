"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const CATEGORY_LABELS = { elementary: "초등부", secondary: "중·고등부", general: "일반부" };
const STAGE_LABELS = {
  none: "미심사", pre_screening_pass: "규격통과", pre_screening_fail: "규격탈락",
  first_round: "심사중", first_round_done: "심사완료",
};
const STAGE_BADGE = {
  none: "bg-secondary-focus text-secondary-600",
  pre_screening_pass: "bg-info-focus text-info-600",
  pre_screening_fail: "bg-danger-focus text-danger-600",
  first_round: "bg-warning-focus text-warning-600",
  first_round_done: "bg-success-focus text-success-600",
};
const REC_LABELS = { pass: "통과", review_needed: "재검토", reject: "탈락 권고" };
const REC_BADGE = { pass: "bg-success-focus text-success-600", review_needed: "bg-warning-focus text-warning-600", reject: "bg-danger-focus text-danger-600" };

export default function ReviewResultsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const [preScreeningLoading, setPreScreeningLoading] = useState(false);
  const [firstRoundLoading, setFirstRoundLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState("");

  const fetchResults = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter) params.set("category", categoryFilter);
      const res = await fetch(`/api/admin/ai-review/results?${params}`);
      if (res.ok) setData(await res.json());
      else setData({ summary: {}, submissions: [], score_distribution: [], category_stats: {}, recommendations: {} });
    } catch { setData({ summary: {}, submissions: [], score_distribution: [], category_stats: {}, recommendations: {} }); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchResults(); }, [categoryFilter]);

  const runPreScreening = async () => {
    setPreScreeningLoading(true); setActionMsg("");
    try {
      const res = await fetch("/api/admin/ai-review/pre-screening", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
      const d = await res.json();
      setActionMsg(d.message || "완료");
      fetchResults();
    } catch { setActionMsg("오류 발생"); }
    finally { setPreScreeningLoading(false); }
  };

  const runFirstRound = async () => {
    setFirstRoundLoading(true); setActionMsg("");
    try {
      const res = await fetch("/api/admin/ai-review/first-round", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
      const d = await res.json();
      setActionMsg(d.message || "완료");
      fetchResults();
    } catch { setActionMsg("오류 발생"); }
    finally { setFirstRoundLoading(false); }
  };

  const s = data?.summary || {};

  // ApexCharts configs
  const scoreDistOptions = {
    chart: { type: "bar", toolbar: { show: false } },
    colors: ["#6366f1"],
    plotOptions: { bar: { borderRadius: 4, columnWidth: "60%" } },
    xaxis: { categories: (data?.score_distribution || []).map((d) => d.range) },
    yaxis: { title: { text: "작품 수" } },
    dataLabels: { enabled: false },
    tooltip: { y: { formatter: (v) => `${v}건` } },
  };
  const scoreDistSeries = [{ name: "작품 수", data: (data?.score_distribution || []).map((d) => d.count) }];

  const pieOptions = {
    chart: { type: "donut" },
    colors: ["#4ade80", "#fbbf24", "#f87171"],
    labels: ["통과", "재검토", "탈락 권고"],
    legend: { position: "bottom" },
    dataLabels: { enabled: true, formatter: (val) => `${Math.round(val)}%` },
  };
  const pieSeries = data?.recommendations
    ? [data.recommendations.pass || 0, data.recommendations.review_needed || 0, data.recommendations.reject || 0]
    : [0, 0, 0];
  const hasPieData = pieSeries.some((v) => v > 0);

  const catStats = data?.category_stats || {};
  const catBarOptions = {
    chart: { type: "bar", toolbar: { show: false }, stacked: false },
    colors: ["#94a3b8", "#38bdf8", "#4ade80"],
    plotOptions: { bar: { borderRadius: 4, columnWidth: "55%" } },
    xaxis: { categories: Object.keys(catStats).map((k) => CATEGORY_LABELS[k] || k) },
    yaxis: { title: { text: "건수" } },
    dataLabels: { enabled: false },
    legend: { position: "top" },
  };
  const catBarSeries = [
    { name: "접수", data: Object.values(catStats).map((v) => v.total) },
    { name: "규격통과", data: Object.values(catStats).map((v) => v.pre_pass) },
    { name: "심사완료", data: Object.values(catStats).map((v) => v.first_done) },
  ];

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>;
  }

  return (
    <>
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-24">
        <h6 className="fw-semibold mb-0">심사 결과 대시보드</h6>
        <div className="d-flex align-items-center gap-2">
          <button className="btn btn-sm btn-outline-info" onClick={runPreScreening} disabled={preScreeningLoading}>
            {preScreeningLoading ? "처리중..." : "사전규격 심사"}
          </button>
          <button className="btn btn-sm btn-outline-warning" onClick={runFirstRound} disabled={firstRoundLoading}>
            {firstRoundLoading ? "처리중..." : "1차 AI 심사"}
          </button>
          <select className="form-select form-select-sm" style={{ width: "auto" }} value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">전체 부문</option>
            <option value="elementary">초등부</option>
            <option value="secondary">중·고등부</option>
            <option value="general">일반부</option>
          </select>
        </div>
      </div>

      {actionMsg && <div className="alert alert-info alert-dismissible mb-24">{actionMsg}<button className="btn-close" onClick={() => setActionMsg("")} /></div>}

      {/* Tabs */}
      <ul className="nav nav-pills mb-24 gap-2">
        {[
          { key: "overview", label: "종합 현황", icon: "mdi:chart-box-outline" },
          { key: "table", label: "작품별 결과", icon: "mdi:table" },
        ].map((tab) => (
          <li key={tab.key} className="nav-item">
            <button className={`nav-link d-flex align-items-center gap-2 ${activeTab === tab.key ? "active" : ""}`} onClick={() => setActiveTab(tab.key)}>
              <Icon icon={tab.icon} className="text-lg" /><span>{tab.label}</span>
            </button>
          </li>
        ))}
      </ul>

      {/* ===== Overview Tab ===== */}
      {activeTab === "overview" && (
        <>
          {/* Summary Cards */}
          <div className="row g-3 mb-24">
            {[
              { label: "총 접수", value: s.total_submissions || 0, icon: "mdi:file-document-multiple", color: "primary" },
              { label: "규격 통과", value: s.pre_screening_pass || 0, icon: "mdi:check-circle", color: "info" },
              { label: "규격 탈락", value: s.pre_screening_fail || 0, icon: "mdi:close-circle", color: "danger" },
              { label: "1차 심사 완료", value: s.first_round_done || 0, icon: "mdi:star-check", color: "success" },
              { label: "평균 점수", value: s.avg_score || 0, icon: "mdi:chart-line", color: "warning", suffix: "점" },
              { label: "최고 점수", value: s.max_score || 0, icon: "mdi:trophy", color: "success", suffix: "점" },
            ].map((card) => (
              <div key={card.label} className="col-lg-2 col-md-4 col-sm-6">
                <div className="card shadow-none border h-100">
                  <div className="card-body p-16 text-center">
                    <div className={`w-48-px h-48-px bg-${card.color}-50 rounded-circle d-flex justify-content-center align-items-center mx-auto mb-8`}>
                      <Icon icon={card.icon} className={`text-${card.color}-600 text-2xl`} />
                    </div>
                    <div className="fw-bold fs-4 text-primary-light">{card.value}{card.suffix || ""}</div>
                    <span className="text-muted text-sm">{card.label}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="row g-3 mb-24">
            {/* Score Distribution */}
            <div className="col-lg-8">
              <div className="card shadow-none border h-100">
                <div className="card-header border-bottom bg-base py-16 px-24">
                  <h6 className="text-lg fw-semibold mb-0">점수 분포</h6>
                </div>
                <div className="card-body p-24">
                  {(data?.score_distribution?.some((d) => d.count > 0)) ? (
                    <ReactApexChart options={scoreDistOptions} series={scoreDistSeries} type="bar" height={280} />
                  ) : (
                    <div className="text-center text-muted py-5">1차 심사 완료된 작품이 없습니다.</div>
                  )}
                </div>
              </div>
            </div>

            {/* Recommendation Donut */}
            <div className="col-lg-4">
              <div className="card shadow-none border h-100">
                <div className="card-header border-bottom bg-base py-16 px-24">
                  <h6 className="text-lg fw-semibold mb-0">AI 권고 결과</h6>
                </div>
                <div className="card-body p-24">
                  {hasPieData ? (
                    <ReactApexChart options={pieOptions} series={pieSeries} type="donut" height={280} />
                  ) : (
                    <div className="text-center text-muted py-5">심사 데이터가 없습니다.</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="card shadow-none border mb-24">
            <div className="card-header border-bottom bg-base py-16 px-24">
              <h6 className="text-lg fw-semibold mb-0">부문별 현황</h6>
            </div>
            <div className="card-body p-24">
              {Object.keys(catStats).length > 0 ? (
                <ReactApexChart options={catBarOptions} series={catBarSeries} type="bar" height={250} />
              ) : (
                <div className="text-center text-muted py-5">접수 데이터가 없습니다.</div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ===== Table Tab ===== */}
      {activeTab === "table" && (
        <div className="card shadow-none border">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table bordered-table mb-0">
                <thead>
                  <tr>
                    <th>접수번호</th>
                    <th>작품명</th>
                    <th>부문</th>
                    <th>심사 단계</th>
                    <th>1차 점수</th>
                    <th>AI 권고</th>
                    <th>상세</th>
                  </tr>
                </thead>
                <tbody>
                  {(!data?.submissions?.length) ? (
                    <tr><td colSpan={7} className="text-center py-4 text-muted">작품이 없습니다.</td></tr>
                  ) : data.submissions.map((sub) => (
                    <tr key={sub.id} style={{ cursor: "pointer" }} onClick={() => setExpandedId(expandedId === sub.id ? null : sub.id)}>
                      <td className="fw-medium text-primary">{sub.submission_no}</td>
                      <td>{sub.title}</td>
                      <td><span className="badge bg-primary-50 text-primary-600">{CATEGORY_LABELS[sub.category] || sub.category}</span></td>
                      <td><span className={`badge ${STAGE_BADGE[sub.review_stage] || ""}`}>{STAGE_LABELS[sub.review_stage] || sub.review_stage}</span></td>
                      <td className="fw-bold">{sub.first_round_score != null ? `${sub.first_round_score}점` : "-"}</td>
                      <td>
                        {sub.first_round_result?.recommendation ? (
                          <span className={`badge ${REC_BADGE[sub.first_round_result.recommendation] || ""}`}>
                            {REC_LABELS[sub.first_round_result.recommendation] || sub.first_round_result.recommendation}
                          </span>
                        ) : "-"}
                      </td>
                      <td>
                        <Icon icon={expandedId === sub.id ? "mdi:chevron-up" : "mdi:chevron-down"} className="text-lg" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Expanded Detail */}
            {expandedId && data?.submissions?.find((s) => s.id === expandedId) && (() => {
              const sub = data.submissions.find((s) => s.id === expandedId);
              return (
                <div className="border-top p-24 bg-light">
                  <div className="row g-4">
                    {/* Pre-screening */}
                    <div className="col-md-6">
                      <h6 className="fw-semibold mb-12">사전규격 심사</h6>
                      {sub.pre_screening_result?.checks ? (
                        <div className="list-group">
                          {sub.pre_screening_result.checks.map((c, i) => (
                            <div key={i} className="list-group-item d-flex justify-content-between align-items-center py-8 px-12">
                              <span className="text-sm">{c.label}</span>
                              <div className="d-flex align-items-center gap-2">
                                <small className="text-muted">{c.detail}</small>
                                {c.passed
                                  ? <Icon icon="mdi:check-circle" className="text-success-600" />
                                  : <Icon icon="mdi:close-circle" className="text-danger-600" />
                                }
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : <p className="text-muted">사전규격 심사 전</p>}
                    </div>

                    {/* 1st Round */}
                    <div className="col-md-6">
                      <h6 className="fw-semibold mb-12">1차 AI 심사</h6>
                      {sub.first_round_result?.scores ? (
                        <>
                          <div className="d-flex align-items-center gap-3 mb-12">
                            <div className="fw-bold fs-2 text-primary-600">{sub.first_round_score || 0}</div>
                            <span className="text-muted">/ 100점</span>
                            {sub.first_round_result.recommendation && (
                              <span className={`badge ${REC_BADGE[sub.first_round_result.recommendation] || ""}`}>
                                {REC_LABELS[sub.first_round_result.recommendation]}
                              </span>
                            )}
                          </div>
                          {Object.entries(sub.first_round_result.scores).map(([key, val]) => (
                            <div key={key} className="mb-12">
                              <div className="d-flex justify-content-between mb-4">
                                <span className="text-sm fw-medium">{val.comment ? key : key}</span>
                                <span className="text-sm fw-bold">{val.score}/{val.max}</span>
                              </div>
                              <div className="progress" style={{ height: "6px" }}>
                                <div className="progress-bar bg-primary" style={{ width: `${(val.score / val.max) * 100}%` }} />
                              </div>
                              {val.comment && <small className="text-muted d-block mt-4">{val.comment}</small>}
                            </div>
                          ))}
                          {sub.first_round_result.summary && (
                            <p className="mt-12 fw-medium border-top pt-12">{sub.first_round_result.summary}</p>
                          )}
                          {sub.first_round_result.strengths?.length > 0 && (
                            <div className="mb-4"><strong className="text-sm">강점:</strong> <span className="text-sm">{sub.first_round_result.strengths.join(", ")}</span></div>
                          )}
                          {sub.first_round_result.improvements?.length > 0 && (
                            <div><strong className="text-sm">개선사항:</strong> <span className="text-sm">{sub.first_round_result.improvements.join(", ")}</span></div>
                          )}
                        </>
                      ) : <p className="text-muted">1차 심사 전</p>}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </>
  );
}
