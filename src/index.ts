import { addNumbers } from './add-numbers.ts'
import { Excel } from './excel.ts'
import { filterSamples } from './filter-samples.ts'
import { getIndex } from './get-code.ts'
import { mergeSamples } from './merge-samples.ts'
import { parseArguments } from './parse-arguments.ts'

const main = async (): Promise<void> => {
  console.log('Parsing arguments')
  const {
    input,
    output,
    firstCode,
    fromSheetName,
    toSheetName,
    sampleCodeColumn,
    patientIdColumn,
    collectionDateColumn,
    vlSymbolColumn,
    vlResultColumn
  } = parseArguments()

  const firstIndex = getIndex(firstCode)

  console.log('Reading file')
  const xls = await Excel.fromFile(input)
  const fromSheet = xls.getSheet(fromSheetName)
  const toSheet = xls.getSheet(toSheetName)

  console.log(`Filtering samples in Sheet '${fromSheet}'`)
  filterSamples(fromSheet, patientIdColumn, collectionDateColumn, vlSymbolColumn, vlResultColumn)

  console.log(`Merging with samples from '${toSheet}'`)
  mergeSamples(fromSheet, toSheet, sampleCodeColumn)

  console.log(`Writing sample codes, starting with '${firstCode}'`)
  addNumbers(toSheet, firstIndex)

  console.log(`Writing to output file '${output}'`)
  try {
    await xls.write(output)
  } catch (err) {
    console.error('Failed while writing: ', err)
  }
}

main()
