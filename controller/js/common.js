
'use strict';

const event = require('../../lib/util').event;
const browserify = require('browserify');
const iconv = require('iconv-lite');

class Common{
	constructor(files,suffix,fn){
		this.fn = fn;
		this.suffix = suffix;
		this.handleJs(files)
	}

	handleJs(files){
		var r_instance= browserify(files);
		r_instance.bundle( (err,buf) => {
			if(!err){
				if(Buffer.isBuffer(buf)){
					event.emit("compileData",this.fn,this.suffix,iconv.decode(buf,'utf8'))
				}
			}else{
				event.emit("fileResult",this.fn,err)
			}
		})
	}
}

module.exports = Common;