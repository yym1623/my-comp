// 숫자에 콤마 추가
export const formatNumber = (num: number): string => {
  return num.toLocaleString('ko-KR')
}

// 가격 포맷
export const formatPrice = (price: number): string => {
  return `${formatNumber(price)}원`
}

