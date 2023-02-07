const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express()
const port = 3000
const helmet = require('helmet')
const morgan = require('morgan');
const amqp = require("amqplib");
const stringSimilarity = require("string-similarity");
var channel, connection;  //global variables for rabbitmq

/**
 * 
 * 

{
"local_value" : "İsmet karaokur bul palmiye sitesi c blok kat 3 no 5",
"remote_value" : "Tekerek yolu Palmiye Sitesi"
}

{
"local_value" : "İsmet karaokur bul palmiye sitesi c blok kat 3 no 5"
[
"palmiye apartmani",
"palmiye",
"15536 Sk. Palmiye Apt."
]
}
 */


//Security things
app.use(cors());
app.use(helmet())
app.disable('x-powered-by')

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// adding morgan to log HTTP requests
app.use(morgan('combined'));



//RabbitMQ Connector
async function connectQueue() {   
  try {
      connection = await amqp.connect("amqp://localhost:5672");
      channel    = await connection.createChannel()
      
      await channel.assertQueue("similarity-queue")
      
  } catch (error) {
      console.log(error)
  }
}
connectQueue();

//Best Match
app.post('/string-bestmatch', (req, res) => {
  var local_address = req.body.local_value;
  var remote_addresses = req.body.remote_values;
  try {
    var bestMatch = stringSimilarity.findBestMatch(local_address, remote_addresses );
    return res.status(200).send(JSON.stringify(bestMatch));
  } catch (error) {
    return res.status(400).send("error occured!");
  }
})

//Compare
app.post('/string-compare', (req, res) => {
  var local_address = req.body.local_value;
  var remote_address = req.body.remote_value;
  try {
    var similarity = stringSimilarity.compareTwoStrings(local_address, remote_address);
    return res.status(200).send(JSON.stringify(similarity));
  } catch (error) {
    return res.status(400).send("error occured!");
  }
});


// Custom 404 
app.use((req, res, next) => {
  res.status(404).send("404")
})

// Custom error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(port, () => {
  console.log(`similarity app listening at (dice coefficient method w/string-similarity lib from npm) ${port}`)
})