const START = 58999
const SIZE = 3316


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


for (let i = START; i <= START + SIZE; i++) {
  console.log(_getCode(i))
}
