
'use strict';

const csswring = require("csswring");
const destroy  = require('destroy');
const extend   = require('extend');
const uglify   = require('uglify-js');
const config   = global.lastConfig = require('./config');
const iconv    = require('iconv-lite');
const fs       = require('fs');
const utils    = require('./lib/util').Utils;
const event    = require('./lib/util').event;
const compile  = require('./controller/');
const noop     = () => {};       

global.util = new utils();

let compress = (ispress, cate, content, deps, cb) => {  
    if ( ispress ) {
        try{
            content = (cate === 'js') ? uglify.minify(content,
                {
                    fromString: true,
                    output:{
                        quote_keys : true
                    }
                }
            ).code : csswring.wring(content).css;
            return cb && cb(null, content, deps);
        }catch(e){
            log4js.loggerE.error(util.getFinfo() + String(e));
            return cb && cb(e)
        }
    }else{
        return cb && cb(null, content, deps);
    }
}

let combineFile = (files ,callback) => {
    if ( filExists(files) ) {
        let chunks = [],
            size   = 0,
            buf,
            str;
        util.each(files, (i, file, go) => {
            let rs  = fs.createReadStream(file);
            rs.on("data",chunk => {
                chunks.push(chunk);
                size += chunk.length
            })
            rs.on("end",() => {
                buf = Buffer.concat(chunks, size);
                destroy(rs);
                go();
            })
        },() => {
            str = iconv.decode(buf, 'utf8');
            callback && callback(null, str);
        })
    } else {
        callback && callback('Not Found')
    }
}

event.on("globalError",(fn, err, nowrite) => {
    !nowrite && log4js.loggerE.error(err);
    fn(err)
});

event.on("compileData",(fn, suffix, data, deps) => compress(lastConfig.compress, suffix, data, deps, fn));

let combo = module.exports = (url, fn) => {
    fn = util.getType(fn) === 'function' ? fn : noop;
    global.log4js = require('./config/log');
    util.parseUrl(url, (files, suffix, search, isControl) => {
        if ( util.getType(files) === 'array' ) {
            if ( !isControl ) {
                combineFile(files, (err, data) => {
                    if ( !err ) {
                        compress(lastConfig.compress, suffix, data, files, fn)
                    }else{
                        event.emit("globalError", fn, String(err), true);
                    }
                })                  
            } else {
                if ( suffix === 'js' ) {
                    compile(files, suffix, search, fn);
                } else {
                    combineFile(files, (err, data) => {
                        if ( !err ) {
                            compile(data, suffix, search, fn, files);
                        } else {
                            event.emit("globalError", fn, String(err), true);
                        }
                    })
                }
            }
        } else {
            event.emit("globalError", fn, util.getFinfo() + String(files))
        }
    });
}
    
combo.config = (options) => {
    lastConfig = extend(true, config, options);
    util.setConfig()
}

function filExists (files) {
    let fpath = Array.isArray(files) ? files : [files];

    for ( let i=0, len = fpath.length; i < len; i++ ){
        if ( !fs.existsSync(fpath[i]) ) {
            log4js.loggerE.error(`[combo] Unable to read ${fpath[i]}: No such file or directory`);
            return false;
        }
    }
    return true;
}
