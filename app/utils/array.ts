// 배열을 초기화 (그리드 셀용)
export const createEmptyGridCells = <T = any>(count: number): T[][] => {
  return Array(count).fill(null).map(() => [])
}

// 두 배열의 ID 목록이 동일한지 비교
export const compareArrayIds = <T extends Record<string, any>>(
  arr1: T[],
  arr2: T[],
  idKey: string = 'id'
): boolean => {
  if (arr1.length !== arr2.length) return false
  
  const ids1 = arr1.map(item => item[idKey]).sort()
  const ids2 = arr2.map(item => item[idKey]).sort()
  
  return ids1.join(',') === ids2.join(',')
}

// 배열에서 ID로 인덱스 찾기
export const findIndexById = <T extends { id: string | number }>(
  arr: T[],
  id: string | number
): number => {
  return arr.findIndex(item => item.id === id)
}
