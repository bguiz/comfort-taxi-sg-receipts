const path = require('path');
const globby = require('globby');
const { createObjectCsvWriter } = require('csv-writer');

const { extractSingle } = require('./extract-single.js');

async function extractAll (pdfDirPath) {
  // detect all `.pdf` files in directory
  const pdfFiles = await globby([`${pdfDirPath}/*.pdf`]);

  // run each one through extractSingle
  const extractPromises = pdfFiles.map(extractSingle);
  const pdfExtracts = await Promise.all(extractPromises);
  const pdfObjects = pdfExtracts.map(
    (pdfExtract) => (pdfExtract.object),
  );

  // compile results into a table
  const csvPath = path.resolve(pdfDirPath, 'out.csv');
  const csvWriter = createObjectCsvWriter({
    path: csvPath,
    header: [
      'start',
      'end',
      'licencePlate',
      'paymentMode',
      'tripNo',
      'distanceRun',
      'amountPaid',
    ],
  });
  await csvWriter.writeRecords(pdfObjects);

  return csvPath; // stubbed value
}

module.exports = {
  extractAll,
};

async function demoExtractAll () {
  const pdfDirPath = path.resolve(process.argv[2]);
  const csvFilePath = await extractAll(pdfDirPath);
  console.log(csvFilePath);
}

if (process.env.DEMO_EXTRACT_ALL) {
  demoExtractAll();
}
