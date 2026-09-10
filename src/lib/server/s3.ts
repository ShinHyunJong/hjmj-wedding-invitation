import "server-only";
import { S3Client, PutObjectCommand, GetObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * 하객 사진 S3. 모든 객체는 `wedding/` 아래에 둔다.
 * 환경변수: S3_ACCESS_KEY, S3_SECRET_KEY, (선택) S3_BUCKET, S3_REGION, S3_PREFIX
 */
export const S3_BUCKET = process.env.S3_BUCKET ?? "rechee-platform-asset";
export const S3_PREFIX = (process.env.S3_PREFIX ?? "wedding").replace(/\/+$/, "");
const REGION = process.env.S3_REGION ?? "ap-northeast-2";

let client: S3Client | undefined;
function s3(): S3Client {
  if (client) return client;
  const accessKeyId = process.env.S3_ACCESS_KEY ?? process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_KEY ?? process.env.AWS_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) throw new Error("S3 자격 증명이 설정되지 않았습니다");
  client = new S3Client({ region: REGION, credentials: { accessKeyId, secretAccessKey } });
  return client;
}

/** 브라우저가 직접 PUT 할 수 있는 서명 URL (5분) */
export function presignUpload(key: string, contentType: string, size: number): Promise<string> {
  return getSignedUrl(s3(), new PutObjectCommand({ Bucket: S3_BUCKET, Key: key, ContentType: contentType, ContentLength: size }), {
    expiresIn: 300,
  });
}

/** 열람용 서명 URL (1시간). 버킷을 공개하지 않아도 청첩장에서 볼 수 있다. */
export function presignView(key: string): Promise<string> {
  return getSignedUrl(s3(), new GetObjectCommand({ Bucket: S3_BUCKET, Key: key }), { expiresIn: 3600 });
}

/** 업로드가 실제로 끝났는지 확인 (객체 존재 + 크기) */
export async function headObject(key: string): Promise<{ size: number; contentType?: string } | null> {
  try {
    const r = await s3().send(new HeadObjectCommand({ Bucket: S3_BUCKET, Key: key }));
    return { size: r.ContentLength ?? 0, contentType: r.ContentType };
  } catch {
    return null;
  }
}
