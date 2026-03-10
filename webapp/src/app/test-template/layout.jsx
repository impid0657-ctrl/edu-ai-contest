/**
 * test-template 레이아웃 — 최소한의 래퍼
 * globals.css의 간섭을 방지하기 위해 독립 레이아웃 사용
 */
export const metadata = {
  title: "Evalo Template Test",
};

export default function TestTemplateLayout({ children }) {
  return <>{children}</>;
}
