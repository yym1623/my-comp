import { db } from '@server/utils/db'
import { auth } from '@server/db/schema'

export default defineEventHandler(async (event) => {
  try {
    // 요청 body에서 email, password 가져오기
    const body = await readBody(event)
    const { email, password } = body

    if (!email || !password) {
      throw createError({
        statusCode: 400,
        message: 'email과 password는 필수입니다',
      })
    }

    // auth 테이블에 새 레코드 추가
    const result = await db.insert(auth).values({
      email,
      password,
    })

    return {
      success: true,
      message: '등록 완료',
      insertId: result[0].insertId,
    }
  }
  catch (error) {
    console.error('DB 추가 에러:', error)
    throw createError({
      statusCode: 500,
      message: 'DB 추가 실패',
    })
  }
})

