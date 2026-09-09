interface Props {
  /** 영문 소제목. script=true면 스크립트 폰트(예: "Invitation"), 아니면 대문자 세리프(예: "GALLERY") */
  en: string;
  script?: boolean;
  /** 한글 제목 (선택) */
  ko?: string;
  className?: string;
}

export default function SectionTitle({ en, script = false, ko, className = "" }: Props) {
  return (
    <div className={`text-center ${className}`}>
      {script ? (
        <p className="font-script text-primary text-[34px] leading-none">{en}</p>
      ) : (
        <p className="eyebrow">{en}</p>
      )}
      {ko && <h2 className="font-serif-ko mt-3 text-[21px] font-medium text-text">{ko}</h2>}
    </div>
  );
}
