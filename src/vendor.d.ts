declare module 'read-excel-file/node' {
  type CellValue = string | number | boolean | Date | null

  function readExcelFile(file: string, options: { getSheets: true }): Promise<{ name: string }[]>
  function readExcelFile(file: string, options: { sheet: string }): Promise<CellValue[][]>

  export default readExcelFile
}

declare module 'excel4node' {
  interface Cell {
    string(val: string): Cell
    number(val: number): Cell
    boolean(val: boolean): Cell
    date(val: Date): Cell
  }

  interface Worksheet {
    cell(row: number, col: number): Cell
  }

  class Workbook {
    addWorksheet(name: string): Worksheet
    write(file: string): void
  }
}
