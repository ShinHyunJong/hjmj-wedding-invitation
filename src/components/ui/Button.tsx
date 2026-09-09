import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";

/**
 * 참고 사이트 버튼: 흰 바탕, 1px 연한 테두리, 모서리 14px, 포인트 색 글자 + 같은 색 얇은 선 아이콘.
 * 아이콘은 children 앞에 넣는다 (currentColor 사용).
 */
const base =
  "inline-flex h-[46px] items-center justify-center gap-2 rounded-[14px] border border-line bg-bg px-6 text-[14px] text-primary transition-colors " +
  "hover:bg-bg-tint active:bg-bg-tint focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

export function Button({ className = "", children, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button type="button" className={`${base} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function LinkButton({ className = "", children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { children: ReactNode }) {
  return (
    <a className={`${base} ${className}`} {...rest}>
      {children}
    </a>
  );
}
