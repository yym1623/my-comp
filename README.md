

vercel 메모

1. 환경변수
ex) nuxt 등등 설정한거 -> 다른것도 포함 해당 config.public 등등의 환경변수에 맞게
=> vercel에 넣은 환경변수도 그대로 들어간다


보통 환경변수 개념이 env(로컬에서) -> 빌드떄 올리지않는다 이그노어로 올리는거 막고 -> 빌드쪽엔 거기 자체 환경변수 설정해서 안전하게 해야한다 env올리면 해당 정보를 보기떄문에 위험하고 보통 이 방식을 사용한다 

=> vercel에서 설정 환경변수를 변경하면 재배포해야 적용된다 -> 바로 적용 x
=> 도메인도 vercel.app 붙은건 바셀 배포때의 도메인 하나 이름변경 가능하고 그외는 preview 및 사온 도메인 연결도 가능하다 vercel.app붙은건 vercel에서 재공하는 도메인이고 하나만 설정 가능하며 production, preview 잘 확인해서 보면된다


2. deployment

-> production 명시한 브랜치 기준으로만 production에 배포되며 그 외의 브랜치는 전부 preview로 등록되며 이건 막을 수 있지만 안 막는게 좋다 -> 보통 이렇게한다 production 문제 생길수도 있으니

-> 그래서 main기준 production 설정이라 이거외에 다른 브랜치 머지전에 푸시해도 다 preview로되고 그걸 다시 머지하면 production으로 배포된다