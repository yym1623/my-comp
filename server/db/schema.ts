import { int, mysqlTable, varchar, timestamp } from 'drizzle-orm/mysql-core'

// auth 테이블 스키마 정의
export const auth = mysqlTable('auth', {
  no: int('no').primaryKey().autoincrement(),
  email: varchar('email', { length: 255 }).notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow().onUpdateNow(),
})

// 타입 추출 (API 응답 등에 사용)
export type Auth = typeof auth.$inferSelect
export type NewAuth = typeof auth.$inferInsert


