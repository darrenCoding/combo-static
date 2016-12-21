
'use strict';

const log4js    = require('log4js');

let loggerC,
    loggerE;

if ( lastConfig.log ) {
    log4js.configure({
        appenders: [
            { 
                type: 'console' 
            },
            {
                type: 'file',
                filename: 'combo_out.log', 
                maxLogSize: 1048576,
                backups:3,
                category: 'normal' 
            },
            {
                type: 'file', 
                filename: 'combo_error.log', 
                maxLogSize: 1048576,
                backups:3,
                category: 'error' 
            }
        ],
        replaceConsole: true
    },
    {
        cwd : lastConfig.log
    }
);

    loggerC = log4js.getLogger('normal'),
    loggerE = log4js.getLogger('error');
    loggerC.setLevel('INFO');
    loggerE.setLevel('ERROR');

} else {
    loggerC = {
        info () {}
    },
    loggerE = {
        erro () {}
    };
}

module.exports = {
    "loggerC" : loggerC,
    "loggerE" : loggerE,
    "logInfo" () {
        return callsites()[0].getFileName() + ' ' + callsites()[0].getLineNumber()
    }
}