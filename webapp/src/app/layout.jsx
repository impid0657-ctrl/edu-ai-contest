import "./globals.css";

export const metadata = {
  title: "제8회 교육 공공데이터 AI활용대회",
  description:
    "교육의 미래를 AI와 함께 열어갑니다. 교육 공공데이터를 활용한 AI 솔루션을 개발하고 공유하세요.",
};

export default function RootLayout({ children }) {
  return (
    <html lang='ko'>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </head>
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  );
}
