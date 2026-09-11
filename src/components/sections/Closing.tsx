import Reveal from "@/components/ui/Reveal";
import type { GalleryPhoto } from "@/config/gallery";

/** 마무리: 사진 3장 + 겹치는 스크립트 문구. */
export default function Closing({ photos }: { photos: GalleryPhoto[] }) {
  return (
    <section className="pt-24 pb-8">
      <div className="space-y-14">
        {photos.map((p, i) => (
          <Reveal key={p.id} delay={60}>
            <figure className="relative px-8">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                width={p.width}
                height={p.height}
                alt=""
                loading="lazy"
                className={`ml-auto block w-[72%] object-cover ${p.orientation === "landscape" ? "aspect-[4/3]" : "aspect-[4/5]"}`}
                style={{ objectPosition: p.focal }}
              />
              <figcaption
                className={`absolute bottom-6 left-5 font-script text-[30px] leading-[1.1] text-primary ${i % 2 ? "rotate-[-6deg]" : "rotate-[-4deg]"}`}
                aria-hidden={i > 0}
              >
                Love story is
                <br />
                <span className="ml-4">beautiful, but ours</span>
                <br />
                <span className="ml-2">is my favorite</span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
