import "./globals.css";

export const metadata = {
  title: "제8회 교육 공공데이터 AI활용대회",
  description:
    "AI와 교육 데이터의 만남, 당신의 창의적인 아이디어를 기다립니다!",
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
