
'use strict';

const iconv  = require('iconv-lite');
const sass   = require('node-sass');
const path   = require('path');
const event  = require('../../lib/util').event;

class Sass{
    constructor (data, suffix, fn, fileArr) {
        this.fileArr = fileArr;
        this.suffix  = suffix;
        this.fn      = fn;
        this.handleJs(data);
    }

    handleJs (data) {
        sass.render({
            data : data,
            includePaths : [path.dirname(this.fileArr[0])],
            outputStyle: lastConfig.compress ? 'compressed' : 'expanded'
        }, (err, result) => {
            if ( !err) {
                this.fileArr.push.apply(this.fileArr, result.stats.includedFiles);
                if ( Buffer.isBuffer(result.css) ) {
                    event.emit("compileData", this.fn, this.suffix, iconv.decode(result.css, 'utf8'), this.fileArr)
                }
            } else {
                event.emit("globalError", this.fn, util.getFinfo() + String(err));
            }
        });
    }
}

module.exports = Sass;