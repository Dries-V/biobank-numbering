const readExcelFile = require('read-excel-file/node')

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

  async write () {

  }

  get sheetNames () {
    return Object.keys(this._sheets)
  }

  getSheet (name) {
    return this._sheets[name]
  }
}

class Sheet {
  constructor (data) {
    this._colNames = data[0].map(val => String(val))
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

  get rows () {
    return this._rows
  }

  get length () {
    return this._rows.length
  }
}

class Row {
  constructor (sheet, data) {
    this._sheet = sheet
    this._data = data.map(val => String(val))
  }

  get length () {
    return this._data.length
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
