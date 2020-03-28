const { Excel, Sheet } = require('./excel')

const EXAMPLE = '/home/dries/Git/biobank-numbering/example/Biobank_aanvulling_2017.xlsx'

const filterSamples = (sheet) => {
  // Group rows per patient
  const perPatientRows = {}
  for (const row of sheet.rows) {
    const patientId = row.getValue('PatientID')
    let patientData = perPatientRows[patientId]
    if (patientData == null) {
      patientData = []
      perPatientRows[patientId] = patientData
    }
    patientData.push(row)
  }
  // Filter rows per patient
  for (const [patientId, rows] of Object.entries(perPatientRows)) {
    const selectedRows = rows.filter(
      row =>
       !(row.getValue('VL_Symbol') === '<' && parseInt(row.getValue('VL_Result')) === 20)
    )
    if (selectedRows.length === 0) {
      selectedRows.push(
        rows.reduce(
          (bestRow, nextRow) => {
            const bestDate = new Date(bestRow.getValue('Collection_date'))
            const nextDate = new Date(nextRow.getValue('Collection_date'))
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
          }
        )
      )
    }
    perPatientRows[patientId] = selectedRows
  }
  // Update rows
  const newRows = []
  const sortedPatientIds = Object.keys(perPatientRows).sort(
    (a, b) => parseInt(a) - parseInt(b)
  )
  for (const patientId of sortedPatientIds) {
    for (const row of perPatientRows[patientId]) {
      newRows.push(row)
    }
  }
  sheet.rows = newRows
}

const addNumbers = (sheet) => {
  const generator = getCode()
  const buffyLoc = sheet.getColumnIndex('Location_BuffyCoat')
  const plasmaLoc = sheet.getColumnIndex('Location_Plasma')
  for (const row of sheet.rows) {
    const buffy = row.getValue('BuffyCoat aanwezig?') == 1
    const plasma = row.getValue('Plasma aanwezig?') == 1
    if (buffy) {
      row.data[buffyLoc] = generator.next().value
    }
    if (plasma) {
      row.data[plasmaLoc] = generator.next().value
    }
  }
}

const _getCode = counter => {
  let plaats = Math.floor(1 + counter % 81)
  const doos = Math.floor(1 + (counter / ( 81 )) % 4)
  const schuif_row = Math.floor(1 + ( counter / ( 81 * 4 )) % 7)
  const schuif_col = Math.floor(1 + ( counter / ( 81 * 4 * 7 )) % 6)
  const vak = Math.floor(1 + ( counter / ( 81 * 4 * 7 * 6 )) % 3)
  const freezer = String.fromCharCode(65 + ( counter / ( 81 * 4 * 7 * 6 * 3 )))
  if (plaats < 10) {
    plaats = `0${plaats}`
  }
  return `${freezer}${vak}-${schuif_row}${schuif_col}-${doos}-${plaats}`
}

function * getCode () {
  let counter = 0
  while (true) {
    yield _getCode(counter++)
  }
}

const main = async () => {
  const xls = new Excel(EXAMPLE)
  console.log('Reading file')
  await xls.read()
  console.log(`Read ${xls.sheetNames.length} sheets`)
  for (const sheetName of xls.sheetNames) {
    console.log(`${sheetName}: ${xls.getSheet(sheetName).length} x ${xls.getSheet(sheetName).columnNames.length}`)
  }
  const fromSheet = xls.getSheet('Tbl_Samples_1')
  const toSheet = xls.getSheet('Tbl_Samples_2')
  console.log('Filtering samples')
  filterSamples(fromSheet)
  toSheet.rows = [...fromSheet.rows, ...toSheet.rows].sort(
    (a, b) => {
      const valA = a.getValue('Sample_Code')
      const valB = b.getValue('Sample_Code')
      if (valA < valB) {
        return -1
      } else if (valA === valB) {
        return 0
      } else {
        return 1
      }
    }
  )
  addNumbers(toSheet)
  console.log('Writing file')
  await xls.write('/home/dries/Git/biobank-numbering/example/filtered.xlsx')
}

main()
