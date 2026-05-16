import { Sheet } from './excel'
import { getCodeGenerator } from './get-code'

export const addNumbers = (
  sheet: Sheet,
  firstIndex: number,
  statusBuffycoatColumn: string,
  statusPlasmaColumn: string,
  locationBuffycoatColumn: string,
  locaitonPlasmaColumn: string
): void => {
  const generator = getCodeGenerator(firstIndex)
  const statusBuffycoat = sheet.getColumnIndex(statusBuffycoatColumn)
  const statusPlasma = sheet.getColumnIndex(statusPlasmaColumn)
  const locationBuffycoat = sheet.getColumnIndex(locationBuffycoatColumn)
  const locationPlasma = sheet.getColumnIndex(locaitonPlasmaColumn)
  for (const row of sheet.rows) {
    const buffy = row.data[statusBuffycoat] === 1 || row.data[statusBuffycoat] === '1'
    const plasma = row.data[statusPlasma] === 1 || row.data[statusPlasma] === '1'
    if (buffy) {
      row.data[locationBuffycoat] = generator.next().value
    }
    if (plasma) {
      row.data[locationPlasma] = generator.next().value
    }
  }
}
