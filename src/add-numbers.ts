import { Sheet } from './excel'
import { getCodeGenerator } from './get-code'

export const addNumbers = (sheet: Sheet, firstIndex: number): void => {
  const generator = getCodeGenerator(firstIndex)
  const buffyLoc = sheet.getColumnIndex('Location_BuffyCoat')!
  const indexLocationPlasma = sheet.getColumnIndex('Location_Plasma')!
  const statusBuffy = sheet.getColumnIndex('Status_BuffyCoat')!
  const statusPlasma = sheet.getColumnIndex('Status_Plasma')!
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
