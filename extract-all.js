const path = require('path');

const { extractSingle } = require('./extract-single.js');

async function extractAll (pdfDirPath) {
  // TODO detect all `.pdf` files in directory

  // TODO run each one through extractSingle

  // TODO compile results into a table

  return []; // stubbed value
}

module.exports = extractAll;

async function demoExtractAll () {
  const pdfDirPath = path.resolve(process.argv[2]);
  const results = await extractAll(pdfDirPath);
  console.log(results);
}

if (process.env.DEMO_EXTRACT_ALL) {
  demoExtractAll();
}