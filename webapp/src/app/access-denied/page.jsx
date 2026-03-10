import AccessDeniedLayer from "@/components/AccessDeniedLayer";

export const metadata = {
  title: "접근 거부 - 제8회 교육 공공데이터 AI활용대회",
  description: "관리자 권한이 필요한 페이지입니다.",
};

const Page = () => {
  return (
    <>
      <AccessDeniedLayer />
    </>
  );
};

export default Page;
