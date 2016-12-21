
'use strict';

const less   = require('less');
const path   = require('path');
const event  = require('../../lib/util').event;

class Less{
    constructor (data, suffix, fn, fileArr) {
        this.fileArr = fileArr;
        this.suffix  = suffix;
        this.fn      = fn;
        this.handleJs(data);
    }

    handleJs (data) {
        less.render(data, {
          paths :  path.dirname(this.fileArr[0]),
          compress: lastConfig.compress
        },(err, output) => {
            this.fileArr.push.apply(this.fileArr, output.imports);
            if ( !err ) {
                event.emit("compileData", this.fn, this.suffix, output.css, this.fileArr)
            } else {
                event.emit("fileResult", this.fn, util.getFinfo() + String(err))
            }
        });
    }
}

module.exports = Less;