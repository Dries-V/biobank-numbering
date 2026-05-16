import { Sheet } from './excel.ts'

export const mergeSamples = (fromSheet: Sheet, toSheet: Sheet, sampleCodeColumn: string) => {
  const indexSampleCode = fromSheet.getColumnIndex(sampleCodeColumn)
  toSheet.rows = [...fromSheet.rows, ...toSheet.rows].sort((a, b) => {
    const valA = a.data[indexSampleCode] as string | number
    const valB = b.data[indexSampleCode] as string | number
    if (valA < valB) {
      return -1
    } else if (valA === valB) {
      return 0
    } else {
      return 1
    }
  })
}
