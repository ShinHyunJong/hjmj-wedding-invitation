import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";

/** 폼 요소. 버튼과 같은 톤: 흰 바탕, 1px 연한 테두리, 모서리 12px. */
const field =
  "w-full rounded-[12px] border border-line bg-bg px-4 py-3 text-[15px] text-text placeholder:text-text-muted/70 " +
  "focus:border-primary-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/20";

export function Input({ className = "", ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={`${field} ${className}`} {...rest} />;
}

export function Textarea({ className = "", ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={`${field} resize-none leading-[1.7] ${className}`} {...rest} />;
}

export function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block text-[13px] text-text-sub">
      {children}
    </label>
  );
}

/** 두세 개 중 하나를 고르는 세그먼트 (신랑측/신부측, 참석/불참) */
export function Segmented<T extends string>({
  value,
  options,
  onChange,
  name,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
  name: string;
}) {
  return (
    <div role="radiogroup" aria-label={name} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.value)}
            className={`h-[46px] rounded-[12px] border text-[14px] transition-colors ${
              active ? "border-primary bg-primary text-white" : "border-line bg-bg text-text hover:bg-bg-tint"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** 숨은 허니팟 필드. 봇이 채우면 서버가 조용히 무시한다. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden" aria-hidden>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

/** 폼 제출 버튼 (채운 버건디) */
export function SubmitButton({ children, disabled }: { children: ReactNode; disabled?: boolean }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="h-[48px] w-full rounded-[14px] bg-primary text-[15px] font-medium text-white transition-opacity disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
    >
      {children}
    </button>
  );
}
