import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // Vue 관련 규칙 (필수)
    'vue/multi-word-component-names': 'off', // Nuxt pages는 단일 단어 허용
    'vue/no-multiple-template-root': 'off', // Vue 3는 여러 루트 허용
    'vue/no-v-html': 'warn', // XSS 위험 경고
    
    // TypeScript 관련 규칙 (필수)
    '@typescript-eslint/no-unused-vars': ['warn', { 
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_' 
    }],
    '@typescript-eslint/no-explicit-any': 'warn', // any 타입 사용 경고
    '@typescript-eslint/explicit-function-return-type': 'off', // 반환 타입 명시 불필요
    
    // 코드 품질 관련 규칙 (필수)
    'no-console': ['warn', { allow: ['warn', 'error'] }], // console.log 금지
    'no-debugger': 'warn', // debugger 사용 경고
    'no-unused-vars': 'off', // TypeScript 규칙 사용
    'prefer-const': 'warn', // const 사용 권장
    'no-var': 'error', // var 사용 금지
    
    // 일반적인 규칙 (필수)
    'eqeqeq': ['error', 'always'], // === 사용 강제
    'prefer-template': 'warn' // 템플릿 리터럴 권장
  }
})
