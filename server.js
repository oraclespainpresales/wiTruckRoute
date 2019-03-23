'use strict'

const log = require('npmlog-ts')
    , util = require('util')
    , express = require('express')
    , bodyParser = require('body-parser')
    , fs = require('fs-extra')
;

const PROCESS   = "PROCESS"
    , WWWFOLDER = "/var/www/mapviewer/"
    , PORT      = 9007
    , URI       = "/wedoindustry/truck/route/:demozone"
;

log.timestamp = true;
log.level     = 'verbose';

log.info(PROCESS, "WEDO Industry - Truck Route - 1.0");
log.info(PROCESS, "Author: Carlos Casares <carlos.casares@oracle.com>");

var app = express();

app.use(bodyParser.json({limit: '10mb', extended: true}))
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}))
/**
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
**/

app.post(URI, (req, res) => {
    let demozone = req.params.demozone;
    if (!demozone || !req.body || !req.body.payload) {
      res.status(400).send().end();
      return;
    }
    let file = WWWFOLDER + demozone.toLowerCase() + '.js';
    fs.writeFileSync(file, "var route = " + req.body.payload);
    res.status(204).send().end();
});

//////////////////////////////////////////////////////////
// Start listener
//////////////////////////////////////////////////////////
var server = app.listen(PORT, () => {
  log.info(PROCESS, "Listening at http://localhost:" + PORT);
})
