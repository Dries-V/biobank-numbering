import readExcelFile from 'read-excel-file/node'
import * as xls from 'excel4node'

export type CellValue = string | number | boolean | Date | null

export class Row {
  private _data: CellValue[]

  constructor(data: CellValue[]) {
    this._data = data
  }

  get length(): number {
    return this._data.length
  }

  get data(): CellValue[] {
    return this._data
  }

  getValue(column: number): CellValue {
    return this._data[column]
  }
}

export class Sheet {
  private _colNames: CellValue[]
  private _colNameToIndex: Record<string, number>
  private _rows: Row[]

  constructor(data: CellValue[][]) {
    this._colNames = data[0]
    this._colNameToIndex = Object.fromEntries(this._colNames.map((val, i) => [val, i]))
    this._rows = data.slice(1).map((vals) => new Row(vals))
  }

  get columnNames(): CellValue[] {
    return this._colNames
  }

  getColumnIndex(name: string): number {
    const index = this._colNameToIndex[name]
    if (index == null) {
      throw new Error(`Column with name ${name} not found in Sheet`)
    }
    return index
  }

  get rows(): Row[] {
    return this._rows
  }

  set rows(rows: Row[]) {
    this._rows = rows
  }

  get length(): number {
    return this._rows.length
  }
}

export class Excel {
  private constructor(private _sheets: Record<string, Sheet>) {}

  static async fromFile(file: string) {
    const sheets: Record<string, Sheet> = {}
    const sheetNames = await readExcelFile(file, { getSheets: true })
    for (const { name: sheetName } of sheetNames) {
      const sheetData = await readExcelFile(file, { sheet: sheetName })
      sheets[sheetName] = new Sheet(sheetData)
    }
    return new Excel(sheets)
  }

  write(file: string) {
    const wb = new xls.Workbook()
    for (const [sheetName, sheet] of Object.entries(this._sheets)) {
      const ws = wb.addWorksheet(sheetName)
      sheet.columnNames.forEach((name, i) => {
        if (name != null && String(name) !== 'null') {
          ws.cell(1, i + 1).string(String(name))
        }
      })
      sheet.rows.forEach((row, i) => {
        row.data.forEach((val, j) => {
          if (val != null && String(val) !== 'null') {
            if (typeof val === 'number') {
              ws.cell(i + 2, j + 1).number(val)
            } else if (typeof val === 'boolean') {
              ws.cell(i + 2, j + 1).boolean(val)
            } else if (val instanceof Date) {
              ws.cell(i + 2, j + 1).date(val)
            } else {
              ws.cell(i + 2, j + 1).string(val)
            }
          }
        })
      })
    }
    wb.write(file)
  }

  get sheetNames(): string[] {
    return Object.keys(this._sheets)
  }

  getSheet(name: string): Sheet {
    const sheet = this._sheets[name]
    if (sheet == null) {
      throw new Error(`Sheet name not found in input Excell: '${name}'`)
    }
    return sheet
  }

  deleteSheet(name: string): void {
    delete this._sheets[name]
  }
}
