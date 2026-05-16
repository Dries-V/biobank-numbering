const MAX_ATTEMPTS = 1e6

export const getCode = (counter: number): string => {
  let plaats: string | number = Math.floor(1 + (counter % 81))
  const doos = Math.floor(1 + ((counter / 81) % 4))
  const schuif_row = Math.floor(1 + ((counter / (81 * 4)) % 7))
  const schuif_col = Math.floor(1 + ((counter / (81 * 4 * 7)) % 6))
  const vak = Math.floor(1 + ((counter / (81 * 4 * 7 * 6)) % 3))
  const vriezer = String.fromCharCode(65 + counter / (81 * 4 * 7 * 6 * 3))
  if (plaats < 10) {
    plaats = `0${plaats}`
  }
  return `${vriezer}${vak}-${schuif_row}${schuif_col}-${doos}-${plaats}`
}

export const getIndex = (code: string): number => {
  let index = 0
  while (index < MAX_ATTEMPTS) {
    if (getCode(index) === code) {
      return index
    }
    index++
  }
  throw new Error(`Could not find the index for code '${code}'. Does it have a correct structure?`)
}

export function* getCodeGenerator(counter = 0): Generator<string, never, unknown> {
  while (true) {
    yield getCode(counter++)
  }
}
