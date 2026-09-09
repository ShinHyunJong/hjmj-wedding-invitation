import type { Wedding } from "@/config/wedding";

/** 모든 hero 변형은 이 props만 받는다. 텍스트·날짜·사진을 하드코딩하지 않는다. */
export interface HeroProps {
  wedding: Wedding;
  /** 대표 사진 (public 기준 경로). 사진을 쓰지 않는 변형은 무시해도 된다. */
  photo: { src: string; width: number; height: number };
}
