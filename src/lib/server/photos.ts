import "server-only";
import { todayKST } from "./http";
import { wedding } from "@/config/wedding";

/** 예식 당일 0시(KST)부터 업로드 가능. 테스트용으로 PHOTO_UPLOAD_OPEN=1 이면 항상 열림. */
export function uploadOpen(): boolean {
  if (process.env.PHOTO_UPLOAD_OPEN === "1") return true;
  const { year, month, day } = wedding.date;
  const opens = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  return todayKST() >= opens;
}
