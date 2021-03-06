'use strict'

const log = require('npmlog-ts')
    , util = require('util')
    , cors = require('cors')
    , express = require('express')
    , bodyParser = require('body-parser')
    , glob = require("glob")
    , fs = require('fs-extra')
    , _ = require('lodash')
;

const PROCESS   = "PROCESS"
    , WWWFOLDER = "/var/www/mapviewer/"
    , PORT      = 9007
    , URI       = "/wedoindustry/truck/route/:demozone/:uuid"
;

log.timestamp = true;
log.level     = 'verbose';

log.info(PROCESS, "WEDO Industry - Truck Route - 1.0");
log.info(PROCESS, "Author: Carlos Casares <carlos.casares@oracle.com>");

var app = express();

app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(cors());

/**
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
**/

app.post(URI, (req, res) => {
  let demozone = req.params.demozone;
  let uuid = req.params.uuid;
  if (!demozone || !uuid || !req.body) {
    res.status(400).send().end();
    return;
  }
  demozone = demozone.toLowerCase();
  glob( WWWFOLDER + demozone + '*.js', (er, files) => {
    _.forEach(files, (f) => {
      fs.removeSync(f);
    });
    let file = WWWFOLDER + demozone + '.' + uuid + '.js';
    console.log("Writing file " + file);
    fs.writeFileSync(file, "var route = " + JSON.stringify(req.body) + ";");
    res.status(204).send().end();
  });
});

//////////////////////////////////////////////////////////
// Start listener
//////////////////////////////////////////////////////////
var server = app.listen(PORT, () => {
  log.info(PROCESS, "Listening at http://localhost:" + PORT);
})
