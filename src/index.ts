import { resolve } from 'node:path'
import { addNumbers } from './add-numbers'
import { Excel } from './excel'
import { filterSamples } from './filter-samples'
import { getIndex } from './get-code'
import { mergeSamples } from './merge-samples'
import { parseArguments } from './parse-arguments'

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
    vlResultColumn,
    statusBuffycoatColumn,
    statusPlasmaColumn,
    locationBuffycoatColumn,
    locationPlasmaColumn
  } = parseArguments()

  const firstIndex = getIndex(firstCode)

  console.log(`Reading file ${input}`)
  const xls = await Excel.fromFile(resolve(input))
  const fromSheet = xls.getSheet(fromSheetName)
  const toSheet = xls.getSheet(toSheetName)

  console.log(`Filtering samples in Sheet '${fromSheetName}'`)
  filterSamples(fromSheet, patientIdColumn, collectionDateColumn, vlSymbolColumn, vlResultColumn)

  console.log(`Merging with samples from '${toSheetName}'`)
  mergeSamples(fromSheet, toSheet, sampleCodeColumn)

  console.log(`Writing sample codes, starting with '${firstCode}'`)
  addNumbers(
    toSheet,
    firstIndex,
    statusBuffycoatColumn,
    statusPlasmaColumn,
    locationBuffycoatColumn,
    locationPlasmaColumn
  )

  console.log(`Writing to output file '${output}'`)
  try {
    await xls.write(resolve(output))
  } catch (err) {
    console.error('Failed while writing: ', err)
  }
}

main()
