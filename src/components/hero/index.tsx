import type { ComponentType } from "react";
import type { HeroVariant } from "@/config/wedding";
import type { HeroProps } from "./types";
import HeroSealed from "./HeroSealed";
import HeroPolaroid from "./HeroPolaroid";
import HeroPhoto from "./HeroPhoto";

/** 새 hero 변형을 만들면 여기 한 줄만 추가하고, config/wedding.ts 의 heroVariant 로 선택한다. */
const variants: Record<HeroVariant, ComponentType<HeroProps>> = {
  sealed: HeroSealed,
  polaroid: HeroPolaroid,
  photo: HeroPhoto,
};

export default function Hero(props: HeroProps & { variant: HeroVariant }) {
  const { variant, ...rest } = props;
  const Component = variants[variant];
  return <Component {...rest} />;
}

export type { HeroProps } from "./types";
