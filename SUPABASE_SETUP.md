# Supabase 설정 가이드

## 1. 패키지 설치

```bash
npm install @supabase/supabase-js
```

## 2. 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### Supabase 프로젝트에서 값 가져오기:
1. [Supabase Dashboard](https://app.supabase.com)에 로그인
2. 프로젝트 선택
3. Settings > API 메뉴로 이동
4. 다음 값들을 복사:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (서버 사이드에서만 사용)

## 3. 사용 방법

### 서버 사이드에서 사용 (권장):

**모든 데이터베이스 작업은 서버 API를 통해 수행하는 것을 권장합니다.**

```typescript
// server/api/users.get.ts
import { createServerSupabaseClient } from '@server/utils/supabase'

export default defineEventHandler(async (event) => {
  const supabase = createServerSupabaseClient()
  
  // 서비스 롤 키를 사용하여 모든 보안 정책 우회
  const { data, error } = await supabase
    .from('users')
    .select('*')
  
  if (error) {
    throw createError({
      statusCode: 500,
      message: error.message
    })
  }
  
  return { data }
})
```

### 클라이언트 사이드에서 사용:

**클라이언트에서는 인증, 실시간 구독 등에만 사용하고, 데이터베이스 작업은 서버 API를 호출하세요.**

```vue
<script setup>
// 인증만 클라이언트에서 직접 처리
const { supabase } = useSupabase()

const signIn = async () => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'user@example.com',
    password: 'password'
  })
}

// 데이터 조회는 서버 API를 통해
const fetchData = async () => {
  const { data } = await $fetch('/api/users')
  return data
}

// 실시간 구독 (필요한 경우)
supabase.channel('messages')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
    console.log('New message:', payload.new)
  })
  .subscribe()
</script>
```

## 4. 보안 주의사항

- `SUPABASE_ANON_KEY`: 클라이언트에서 사용 가능 (Row Level Security 적용)
- `SUPABASE_SERVICE_ROLE_KEY`: 서버 사이드에서만 사용 (모든 보안 정책 우회)
- `.env` 파일은 절대 Git에 커밋하지 마세요
- `.gitignore`에 `.env`가 포함되어 있는지 확인하세요

