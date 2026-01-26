// 텍스트에서 검색어를 하이라이트 처리 (HTML <u> 태그로 감싸기)
export const highlightText = (text: string, query: string): string => {
  if (!query.trim()) return text
  
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedQuery})`, 'gi')
  return text.replace(regex, '<u>$1</u>')
}

// 스타일 값에서 단위 추출 (예: "100%" -> { value: 100, unit: "%" })
export const parseSizeValue = (size: string | number | undefined | null): { value: number; unit: string } | null => {
  if (size === undefined || size === null) return null
  
  if (typeof size === 'number') {
    return { value: size, unit: 'px' }
  }
  
  if (typeof size === 'string') {
    const match = size.match(/^(\d+(?:\.\d+)?)(%|px)$/)
    if (match && match[1] && match[2]) {
      return { value: parseFloat(match[1]), unit: match[2] }
    }
  }
  
  return null
}

// 숫자와 단위를 문자열로 변환 (예: 100, "%" -> "100%")
export const formatSizeValue = (value: number, unit: string): string => {
  return `${value}${unit}`
}
