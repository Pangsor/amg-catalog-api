'use strict';
const winston = require(`winston`);
const express = require(`express`);
const app = express();

require(`./startup/logging`)();
require(`./startup/routes`)(app);
require(`./startup/config`)();
require(`./startup/db`)();

const port = process.env.PORT || 3754;
app.listen(port,() => winston.info(`Listening on port ${port}...`));