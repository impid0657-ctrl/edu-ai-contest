"use client";

/**
 * 접근 권한을 확인하고, 비공개 페이지일 경우 이동 없이 모달을 표시하는 링크 컴포넌트.
 * layout.jsx의 'show-access-blocked' 커스텀 이벤트를 통해 모달을 트리거한다.
 */
export default function AccessCheckedLink({ href, className, style, children }) {
    const handleClick = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/pages?path=${encodeURIComponent(href)}`);
            const data = res.ok ? await res.json() : null;
            if (data?.access === "private") {
                window.dispatchEvent(new CustomEvent("show-access-blocked", {
                    detail: { warning: data.warning || "이 페이지는 현재 비공개 상태입니다." },
                }));
                return;
            }
        } catch { /* 오류 시 그냥 이동 */ }
        window.location.href = href;
    };

    return (
        <a href={href} className={className} style={style} onClick={handleClick}>
            {children}
        </a>
    );
}
