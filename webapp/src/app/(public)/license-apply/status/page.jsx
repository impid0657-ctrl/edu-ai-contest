"use client";

import { useState } from "react";
import Link from "next/link";
import { formatKST } from "@/lib/dateUtils";

/**
 * License Application Status Lookup — /license-apply/status
 * Public page. Email-only lookup. No auth required.
 * Zero inline styles.
 */

const STATUS_LABELS = {
  pending: "대기 중",
  approved: "승인됨",
  rejected: "반려됨",
};

const STATUS_BADGE = {
  pending: "bg-warning",
  approved: "bg-success",
  rejected: "bg-danger",
};

const CATEGORY_LABELS = {
  elementary: "초등부",
  secondary: "중·고등부",
  general: "일반부",
};

export default function LicenseStatusPage() {
  const [email, setEmail] = useState("");
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setSearching(true);
    setSearched(false);

    try {
      const res = await fetch(`/api/license/status?email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "조회에 실패했습니다.");
        return;
      }

      setResult(data.application);
      setSearched(true);
    } catch (err) {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setSearching(false);
    }
  };

  return (
    <section className="py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="text-center mb-5">
              <h1 className="fw-bold mb-3">AI 이용권 신청 현황 조회</h1>
              <p className="text-muted">신청 시 사용한 이메일로 현황을 확인하세요.</p>
            </div>

            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">
                {error && (
                  <div className="alert alert-danger" role="alert">{error}</div>
                )}

                <form onSubmit={handleSearch}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">
                      이메일 <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      placeholder="신청 시 사용한 이메일"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-lg w-100 public-btn-primary"
                    disabled={searching}
                  >
                    {searching ? "조회 중..." : "조회하기"}
                  </button>
                </form>

                {/* Result */}
                {searched && (
                  <div className="mt-4">
                    {result ? (
                      <div className="card bg-light border-0 rounded-3">
                        <div className="card-body p-3">
                          <h5 className="fw-bold mb-3">신청 현황</h5>
                          <div className="table-responsive">
                            <table className="table table-sm mb-0">
                              <tbody>
                                <tr>
                                  <th className="text-muted">상태</th>
                                  <td>
                                    <span className={`badge ${STATUS_BADGE[result.status] || "bg-secondary"}`}>
                                      {STATUS_LABELS[result.status] || result.status}
                                    </span>
                                  </td>
                                </tr>
                                <tr>
                                  <th className="text-muted">부문</th>
                                  <td>{CATEGORY_LABELS[result.category] || result.category}</td>
                                </tr>
                                {result.team_name && (
                                  <tr>
                                    <th className="text-muted">팀명</th>
                                    <td>{result.team_name}</td>
                                  </tr>
                                )}
                                <tr>
                                  <th className="text-muted">신청일</th>
                                  <td>{result.created_at ? formatKST(result.created_at, "yyyy-MM-dd") : "-"}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="alert alert-info" role="alert">
                        해당 이메일로 신청된 내역이 없습니다.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="text-center mt-4">
              <Link href="/license-apply" className="text-muted">
                ← AI 이용권 신청 페이지로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
