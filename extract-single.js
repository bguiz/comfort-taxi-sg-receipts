const path = require('path');
const pdf2Json = require('pdf2json');
const dateParse = require('date-fns/parse');
const dateFormatIso = require('date-fns/formatISO');

const { trimAndCamelCase } = require('./util.js');

function processPdfText (text) {
  const lines = text.split('\n');
  const object = lines.map((unparsedLine, index) => {
    const line = unparsedLine.replace('\r', '').trim();
    if (line === '' ||
        index === 0 ||
        index >= lines.length - 4) {
      return {};
    } else if (index === 1) {
      return {
        licencePlate: line.trim(),
      };
    } else if (line === 'CASH' || line === 'NETS') {
      // What are the other payment modes?
      return {
        paymentMode: line,
      };
    } else if (line.indexOf('$') > 0) {
      const parts = line.split('$');
      const key = trimAndCamelCase(parts[0]);
      const value = parseFloat(parts[1].trim());
      return {
        [key]: value,
      };
    } else {
      const parts = line.split(/[\s]{2,}/);
      if (!parts[0] || !parts[1]) {
        console.error('UNPARSEABLE:', line);
        return {
          [`UNPARSEABLE_LINE_#${index}`]: line,
        };
      }
      const key = trimAndCamelCase(parts[0]);
      let value = parts[1].trim();
      if (key === 'distanceRun') {
        value = parseFloat(value.replace(' KM', ''));
      } else if (key === 'start' || key === 'end') {
        const parsedDate = dateParse(value, 'dd/MM/yyyy HH:mm', new Date());
        value = dateFormatIso(parsedDate);
      }
      return {
        [key]: value,
      };
    }
  }).reduce(
    (x, acc) => ({ ...x, ...acc }),
    {},
  );
  return object;
}

function extractSingle(pdfPath) {
  return new Promise((accept, reject) => {
    let pdfParser = new pdf2Json(this, 1);

    pdfParser.on(
      'pdfParser_dataError',
      (errData) => {
        console.error(errData.parserError);
        return reject(errData.parserError);
      }
    );

    pdfParser.on('pdfParser_dataReady', (pdfData) => {
      const text = pdfParser.getRawTextContent();
      const object = processPdfText(text);
      return accept({
        text,
        object,
      });
    });

    pdfParser.loadPDF(pdfPath);
  });
}

module.exports = {
  extractSingle,
  processPdfText,
};

async function demoExtractSingle () {
  const pdfPath = path.resolve(process.argv[2]);
  const results = await extractSingle(pdfPath);
  console.log(results.text);
  console.log(results.object);
}

if (process.env.DEMO_EXTRACT_SINGLE) {
  demoExtractSingle();
}
