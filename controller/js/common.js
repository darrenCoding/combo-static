
'use strict';

const browserify = require('browserify');
const iconv = require('iconv-lite');
const event = require('../../lib/util').event;
const log4js = require('../../config/log');

class Common{
	constructor(files,suffix,fn){
		this.fn = fn;
		this.suffix = suffix;
		this.handleJs(files)
	}

	handleJs(files){
		let r_instance = browserify(files);
		r_instance.bundle( (err,buf) => {
			if(!err){
				if(Buffer.isBuffer(buf)){
					event.emit("compileData",this.fn,this.suffix,iconv.decode(buf,'utf8'))
				}
			}else{
				log4js.logger_e.error(err.message || err.stack);
				event.emit("fileResult",this.fn,err)
			}
		})
	}
}

module.exports = Common;