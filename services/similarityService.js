var stringSimilarity = require("string-similarity");


const compareResult = (local_address, remote_address) => Promise.resolve(stringSimilarity.compareTwoStrings(local_address, remote_address));
const bestMatch = (local_addresses, remote_address) => Promise.resolve(stringSimilarity.findBestMatch(remote_address, ));

  module.exports = {
    compareResult,
    bestMatch
  };
  