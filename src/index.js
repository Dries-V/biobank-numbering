const { Excel } = require('./excel')

const EXAMPLE = '/home/dries/Git/biobank-numbering/example/Biobank_aanvulling_2017.xlsx'

const main = async () => {
  const xls = new Excel(EXAMPLE)
  await xls.read()
  console.log(`Read ${xls.sheetNames.length} sheets`)
  for (const sheetName of xls.sheetNames) {
    console.log(`${sheetName}: ${xls.getSheet(sheetName).length} x ${xls.getSheet(sheetName).columnNames.length}`)
  }
}

main()
