import "server-only";
import mysql, { type Pool, type RowDataPacket, type ResultSetHeader } from "mysql2/promise";

/**
 * RDS MySQL 커넥션 풀. 서버리스(Vercel)에서는 인스턴스마다 풀이 생기므로 작게 잡는다.
 * 환경변수: DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME (.env / Vercel 환경변수)
 */
declare global {
  var __weddingPool: Pool | undefined;
}

/** execute() 에 넘길 수 있는 값 */
export type Param = string | number | boolean | null | Date;

export function getPool(): Pool {
  if (globalThis.__weddingPool) return globalThis.__weddingPool;
  const host = (process.env.DB_HOST ?? "").replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  if (!host) throw new Error("DB_HOST 가 설정되지 않았습니다");
  const pool = mysql.createPool({
    host,
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: "Amazon RDS",
    connectionLimit: 3,
    waitForConnections: true,
    connectTimeout: 8000,
    charset: "utf8mb4",
    timezone: "Z",
  });
  globalThis.__weddingPool = pool;
  return pool;
}

export async function query<T extends RowDataPacket[]>(sql: string, params: Param[] = []): Promise<T> {
  const [rows] = await getPool().execute<T>(sql, params);
  return rows;
}

export async function exec(sql: string, params: Param[] = []): Promise<ResultSetHeader> {
  const [res] = await getPool().execute<ResultSetHeader>(sql, params);
  return res;
}
