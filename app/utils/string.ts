// 텍스트에서 검색어를 하이라이트 처리 (HTML <u> 태그로 감싸기)
export const highlightText = (text: string, query: string): string => {
  if (!query.trim()) return text
  
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedQuery})`, 'gi')
  return text.replace(regex, '<u>$1</u>')
}
