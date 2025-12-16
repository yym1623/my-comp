import { drizzle } from 'drizzle-orm/mysql2'
import mysql from 'mysql2/promise'

// MySQL 연결 풀 생성
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'my_database',
  waitForConnections: true,
  connectionLimit: 10,
})

// Drizzle ORM 인스턴스
export const db = drizzle(pool)

// 풀 직접 접근 (필요한 경우)
export { pool }

