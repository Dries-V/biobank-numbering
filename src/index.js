const { Excel, Sheet } = require('./excel')

const EXAMPLE = '/home/dries/Git/biobank-numbering/example/Biobank aanvulling 2018.xlsx'

const filterSamples = (sheet) => {
  const indexPatientID = sheet.getColumnIndex('PatientID')
  const indexCollectionDate = sheet.getColumnIndex('Collection_date')
  const indexVLSymbol = sheet.getColumnIndex('VL_Symbol')
  const indexVLResult = sheet.getColumnIndex('VL_Result')
  // Group rows per patient & year combo
  const perPatientRows = {}
  for (const row of sheet.rows) {
    const patientId = row.data[indexPatientID]
    const year = new Date(row.data[indexCollectionDate]).getFullYear()
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
      row =>
       !(row.data[indexVLSymbol] === '<' && parseInt(row.data[indexVLResult]) === 20)
    )
    if (selectedRows.length === 0) {
      selectedRows.push(
        rows.reduce(
          (bestRow, nextRow) => {
            const bestDate = new Date(bestRow.data[indexCollectionDate])
            const nextDate = new Date(nextRow.data[indexCollectionDate])
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
    perPatientRows[key] = selectedRows
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
  const generator = getCode(49973) // B1-15-1-78
  const buffyLoc = sheet.getColumnIndex('Location_BuffyCoat')
  const indexLocationPlasma = sheet.getColumnIndex('Location_Plasma')
  const statusBuffy = sheet.getColumnIndex('Status_BuffyCoat')
  const statusPlasma = sheet.getColumnIndex('Status_Plasma')
  for (const row of sheet.rows) {
    const buffy = row.data[statusBuffy] === 1 || row.data[statusBuffy] === '1'
    const plasma = row.data[statusPlasma] === 1 || row.data[statusPlasma] === '1'
    if (buffy) {
      row.data[buffyLoc] = generator.next().value
    }
    if (plasma) {
      row.data[indexLocationPlasma] = generator.next().value
    }
  }
}

const _getCode = counter => {
  /** @type {string|number} */
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

function * getCode (counter = 0) {
  while (true) {
    yield _getCode(counter++)
  }
}

const main = async () => {
  const xls = new Excel(EXAMPLE)
  console.log('Reading file')
  await xls.read()
  console.log(`Read ${xls.sheetNames.length} sheets`)
  const fromSheet = xls.getSheet('Tbl_Samples_1') || xls.getSheet('Tbl_Samples_1 ')
  const toSheet = xls.getSheet('Tbl_Samples_2') || xls.getSheet('Tbl_Samples_2 ')
  console.log('Filtering samples')
  filterSamples(fromSheet)
  const indexSampleCode = fromSheet.getColumnIndex('Sample_Code')
  toSheet.rows = [...fromSheet.rows, ...toSheet.rows].sort(
    (a, b) => {
      const valA = a.data[indexSampleCode]
      const valB = b.data[indexSampleCode]
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
  try {
    await xls.write('/home/dries/Git/biobank-numbering/example/filtered.xlsx')
  } catch (err) {
    console.error('Failed while writing: ', err)
  }
}

main()
