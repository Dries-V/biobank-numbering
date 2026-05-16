import { Row, Sheet } from './excel'

// For each patient-year combination, removes rows with an undetectable viral load (VL_Symbol '<'
// and VL_Result 20). If all rows for a patient-year are undetectable, keeps the single row
// whose collection date is closest to mid-year (July 15) as a fallback.
export const filterSamples = (
  sheet: Sheet,
  patientIdColumn: string,
  collectionDateColumn: string,
  vlSymbolColumn: string,
  vlResultColumn: string
): void => {
  const indexPatientID = sheet.getColumnIndex(patientIdColumn)
  const indexCollectionDate = sheet.getColumnIndex(collectionDateColumn)
  const indexVLSymbol = sheet.getColumnIndex(vlSymbolColumn)
  const indexVLResult = sheet.getColumnIndex(vlResultColumn)

  // Group rows per patient & year combo
  const perPatientRows: Record<string, Row[]> = {}
  for (const row of sheet.rows) {
    const patientId = row.data[indexPatientID]
    const year = new Date(row.data[indexCollectionDate] as string | number | Date).getFullYear()
    const key = `${patientId}-${year}`
    let patientData = perPatientRows[key]
    if (patientData == null) {
      patientData = []
      perPatientRows[key] = patientData
    }
    patientData.push(row)
  }

  // Filter rows per patient
  for (const [key, rows] of Object.entries(perPatientRows)) {
    const selectedRows = rows.filter(
      (row) => !(row.data[indexVLSymbol] === '<' && parseInt(String(row.data[indexVLResult])) === 20)
    )
    if (selectedRows.length === 0) {
      selectedRows.push(
        rows.reduce((bestRow, nextRow) => {
          const bestDate = new Date(bestRow.data[indexCollectionDate] as string | number | Date)
          const nextDate = new Date(nextRow.data[indexCollectionDate] as string | number | Date)
          const bestMonthDiff = Math.abs(bestDate.getMonth() - 6)
          const nextMonthDiff = Math.abs(nextDate.getMonth() - 6)
          if (bestMonthDiff < nextMonthDiff) {
            return bestRow
          } else if (bestMonthDiff === nextMonthDiff) {
            const bestDayDiff = Math.abs(bestDate.getDay() - 15)
            const nextDayDiff = Math.abs(nextDate.getDay() - 15)
            if (bestDayDiff < nextDayDiff) {
              return bestRow
            } else {
              return nextRow
            }
          } else {
            return nextRow
          }
        })
      )
    }
    perPatientRows[key] = selectedRows
  }

  // Update rows
  const newRows: Row[] = []
  const sortedPatientIds = Object.keys(perPatientRows).sort((a, b) => parseInt(a) - parseInt(b))
  for (const patientId of sortedPatientIds) {
    for (const row of perPatientRows[patientId]) {
      newRows.push(row)
    }
  }

  sheet.rows = newRows
}
