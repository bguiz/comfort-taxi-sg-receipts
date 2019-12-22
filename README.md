# `comfort-taxi-sg-receipts`

Automated batch processor for receipts from Comfort Taxi Singapore.

## Installation

```bash
git clone git@github.com:bguiz/comfort-taxi-sg-receipts.git
cd comfort-taxi-sg-receipts

```

## Usage

To process a single PDF file:

```bash
DEMO_EXTRACT_SINGLE=1 node ./extract-single.js ./receipts/e_receipt_12345.pdf

```

To process a directory of PDF files:

```bash
DEMO_EXTRACT_ALL=1 node ./extract-all.js ./receipts/

```

To use programmatically:

```javascript
// Extracts data from a single PDF receipt
const { extractSingle } = require('./extract-single.js');

// Extracts data from a directory of multiple PDF receipts,
// and outputs a CSV file with all of them
const { extractAll } = require('./extract-all.js');

```

## Licence

GPL-3.0

## Author

[Brendan Graetz](https://bguiz.com)
