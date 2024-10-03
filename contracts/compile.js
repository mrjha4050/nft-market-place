const path = require('path');
const fs = require('fs');
const solc = require('solc');

const contractPath = path.resolve(__dirname, 'TokenizeAsset.sol');
const source = fs.readFileSync(contractPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'TokenizeAsset.sol': {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode'],
      },
    },
  },
};

const compiled = JSON.parse(solc.compile(JSON.stringify(input)));
module.exports = compiled.contracts['TokenizeAsset.sol'].TokenizeAsset;
