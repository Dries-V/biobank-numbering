const readExcelFile = require('read-excel-file/node')
const xls = require('excel4node')

class Excel {
  constructor (file) {
    this._file = file
    this._sheets = {}
  }

  async read () {
    const file = this._file
    // Read sheet names
    const sheetNames = await new Promise(resolve => {
      readExcelFile(file, { getSheets: true }).then(resolve)
    })
    // Read sheets
    for (const { name: sheetName } of sheetNames) {
      const sheetData = await new Promise(resolve => {
        readExcelFile(file, { sheet: sheetName }).then(resolve)
      })
      this._sheets[sheetName] = new Sheet(sheetData)
    }
  }

  async write (file) {
    const wb = new xls.Workbook()
    for (const [sheetName, sheet] of Object.entries(this._sheets)) {
      const ws = wb.addWorksheet(sheetName)
      sheet.columnNames.forEach((name, i) => {
        if (name != null && name !== 'null') {
          ws.cell(1, i + 1).string(name)
        }
      })
      sheet.rows.forEach((row, i) => {
        row.data.forEach((val, j) => {
          if (val != null && val !== 'null') {
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

  get sheetNames () {
    return Object.keys(this._sheets)
  }

  getSheet (name) {
    return this._sheets[name]
  }

  deleteSheet (name) {
    delete this._sheets[name]
  }
}

class Sheet {
  constructor (data) {
    this._colNames = data[0]
    this._colNameToIndex = Object.fromEntries(
      this._colNames.map((val, i) => [val, i])
    )
    this._rows = data.slice(1).map(vals => new Row(this, vals))
  }

  get columnNames () {
    return this._colNames
  }

  getColumnIndex (name) {
    return this._colNameToIndex[name]
  }

  /** @returns {Row[]} */
  get rows () {
    return this._rows
  }

  set rows (rows) {
    this._rows = rows
  }

  get length () {
    return this._rows.length
  }
}

class Row {
  constructor (sheet, data) {
    this._sheet = sheet
    this._data = data
  }

  get length () {
    return this._data.length
  }

  /** @returns {string[]} */
  get data () {
    return this._data
  }

  getValue(column) {
    if (typeof column === 'string') {
      column = this._sheet.getColumnIndex(column)
    }
    return this._data[column]
  }
}

module.exports = {
  Excel,
  Sheet,
  Row
}
