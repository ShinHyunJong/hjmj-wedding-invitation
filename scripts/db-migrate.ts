/**
 * RDS MySQL 테이블 생성 (멱등). `pnpm db:migrate`
 * .env 의 DB_* 를 읽는다. 테이블이 이미 있으면 건너뛴다.
 */
import { readFileSync } from "node:fs";
import mysql from "mysql2/promise";

const env: Record<string, string> = {};
for (const line of readFileSync(".env", "utf8").split("\n")) {
  const i = line.indexOf("=");
  if (i > 0 && !line.startsWith("#")) env[line.slice(0, i).trim()] = line.slice(i + 1).trim();
}
for (const k of Object.keys(env)) process.env[k] ??= env[k];

const STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS rsvp (
    id INT AUTO_INCREMENT PRIMARY KEY,
    side ENUM('groom','bride') NOT NULL,
    name VARCHAR(40) NOT NULL,
    attending TINYINT(1) NOT NULL,
    headcount TINYINT UNSIGNED NOT NULL DEFAULT 1,
    message VARCHAR(300) NULL,
    ip VARCHAR(64) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_ip_created (ip, created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS guestbook (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(40) NOT NULL,
    message VARCHAR(500) NOT NULL,
    password_hash VARCHAR(120) NOT NULL,
    ip VARCHAR(64) NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME NULL,
    INDEX idx_created (deleted_at, created_at),
    INDEX idx_ip_created (ip, created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    s3_key VARCHAR(255) NOT NULL UNIQUE,
    content_type VARCHAR(60) NOT NULL,
    size INT UNSIGNED NOT NULL,
    uploader VARCHAR(40) NULL,
    ip VARCHAR(64) NULL,
    status ENUM('pending','uploaded') NOT NULL DEFAULT 'pending',
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status_created (status, created_at),
    INDEX idx_ip_created (ip, created_at)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
];

async function main() {
  const host = (process.env.DB_HOST ?? "").replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  const conn = await mysql.createConnection({
    host,
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: "Amazon RDS",
  });
  for (const sql of STATEMENTS) {
    const name = sql.match(/EXISTS (\w+)/)?.[1];
    await conn.query(sql);
    console.log(`✓ ${name}`);
  }
  const [tables] = await conn.query<mysql.RowDataPacket[]>("SHOW TABLES");
  console.log("tables:", tables.map((r) => Object.values(r)[0]).join(", "));
  await conn.end();
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
