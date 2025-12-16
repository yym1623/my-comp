<template>
  <div>
    <h1>사용자 상세</h1>
    <p>app/pages/users/[id].vue → "/users/:id" 동적 라우트</p>
    <p>현재 사용자 ID: {{ $route.params.id }}</p>
    <NuxtLink to="/users">목록으로 돌아가기</NuxtLink>
  </div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped></style>