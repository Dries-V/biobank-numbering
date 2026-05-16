import { hideBin } from 'yargs/helpers'
import yargs from 'yargs'
import process from 'node:process'

export const parseArguments = () => {
  const argv = yargs(hideBin(process.argv))
    .option('input', {
      alias: 'i',
      type: 'string',
      demandOption: true,
      describe: 'Path to input xlsx file'
    })
    .option('output', {
      alias: 'o',
      type: 'string',
      demandOption: true,
      describe: 'Path to output xlsx file'
    })
    .option('first-code', {
      alias: 'c',
      type: 'string',
      default: 'A1-11-1-01',
      describe: 'The first code to assign'
    })
    .option('from-sheet', {
      alias: 'f',
      type: 'string',
      default: 'Tbl_Samples_1',
      describe: 'The name of the Sheet with samples that need to be added.\n\tdefault: Tbl_Samples_1'
    })
    .option('to-sheet', {
      alias: 't',
      type: 'string',
      default: 'Tbl_Samples_2',
      describe: 'The name of the Sheet with samples that need to be added.\n\tdefault: Tbl_Samples_2'
    })
    .option('sample-code-column', {
      alias: 's',
      type: 'string',
      default: 'Sample-Code',
      describe: 'Name of the column with sample codes.\n\tdefault: Sample-Code'
    })
    .option('patient-id-column', {
      type: 'string',
      default: 'PatientID',
      describe: 'Name of the column with patient ids.\n\tdefault: PatientID'
    })
    .option('collection-date-column', {
      type: 'string',
      default: 'Collection_date',
      describe: 'Name of the column with collection dates.\n\tdefault: Collection_date'
    })
    .option('vl-symbol-column', {
      type: 'string',
      default: 'VL_Symbol',
      describe: 'Name of the column with VL symbols.\n\tdefault: VL_Symbol'
    })
    .option('vl-result-column', {
      type: 'string',
      default: 'VL_Result',
      describe: 'Name of the column with VL results.\n\tdefault: VL_Result'
    })
    .option('status-buffycoat-column', {
      type: 'string',
      default: 'Status_BuffyCoat',
      describe: 'Name of the column with BuffyCoat status.\n\tdefault: Status_BuffyCoat'
    })
    .option('status-plasma-column', {
      type: 'string',
      default: 'Status_Plasma',
      describe: 'Name of the column with Plasma status.\n\tdefault: Status_Plasma'
    })
    .option('location-buffycoat-column', {
      type: 'string',
      default: 'Location_BuffyCoat',
      describe: 'Name of the column where buffycoat locations should be written.\n\tdefault: Location_BuffyCoat'
    })
    .option('location-plasma-column', {
      type: 'string',
      default: 'Location_Plasma',
      describe: 'Name of the column where plasma locations should be written.\n\tdefault: Location_Plasma'
    })
    .parseSync()

  return {
    input: argv['input'],
    output: argv['output'],
    firstCode: argv['first-code'],
    fromSheetName: argv['from-sheet'],
    toSheetName: argv['to-sheet'],
    sampleCodeColumn: argv['sample-code-column'],
    patientIdColumn: argv['patient-id-column'],
    collectionDateColumn: argv['collection-date-column'],
    vlSymbolColumn: argv['vl-symbol-column'],
    vlResultColumn: argv['vl-result-column'],
    statusBuffycoatColumn: argv['status-buffycoat-column'],
    statusPlasmaColumn: argv['status-plasma-column'],
    locationBuffycoatColumn: argv['location-buffycoat-column'],
    locationPlasmaColumn: argv['location-plasma-column']
  }
}
