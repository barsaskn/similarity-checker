
var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
const similarityService = require('../services/similarityService');


//Best Match
router.post('/compare', (req, res, next) => {

  var local_address = req.body.local_value;
  var remote_address = req.body.remote_value;
  
  similarityService.compareResult(local_address, remote_address)
    .then(result => res.status(200).send("" + result)) //TODO :: FIX IT
    .catch(err => res.status(500).send(err));
})

//Compare
router.post('/bestmatch', (req, res, next) => {
  var local_addresses = req.body.local_values;
  var remote_address = req.body.remote_value;

  similarityService.bestMatch(local_addresses, remote_address)
  .then(result => res.status(200).send(result))
  .catch(err => res.status(500).send(err));

});

module.exports = router;
