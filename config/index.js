
'use strict';

const path = require('path');

let env = process.env.NODE_ENV || 'local';
    env = env.toLowerCase();

const file = path.resolve(__dirname, env);

const config = module.exports = require(file);