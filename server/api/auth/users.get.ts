import { db } from '@server/utils/db'
import { auth } from '@server/db/schema'

export default defineEventHandler(async () => {
  try {
    // auth 테이블 전체 조회
    const allAuth = await db.select().from(auth)
    return allAuth
  }
  catch (error) {
    console.error('DB 조회 에러:', error)
    throw createError({
      statusCode: 500,
      message: 'DB 연결 또는 조회 실패',
    })
  }
})

