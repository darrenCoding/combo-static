
'use strict';

const sass = require('node-sass');
const iconv = require('iconv-lite');
const event = require('../../lib/util').event;
const log4js = require('../../config/log');

class Sass{
	constructor(data,suffix,fn,fileArr){
		this.fn = fn;
		this.fileArr = fileArr;
		this.suffix = suffix;
		this.handleJs(data);
	}

	handleJs(data){
		sass.render({
		  	data : data,
		  	includePaths : lastConfig.css_module.SASS.includePaths
		}, (err, result) => {
			this.fileArr.push.apply(this.fileArr,result.stats.includedFiles);
			if(!err){
				if(Buffer.isBuffer(result.css)){
					event.emit("compileData",this.fn,this.suffix,iconv.decode(result.css,'utf8'),this.fileArr)
				}
			}else{
				log4js.logger_e.error(err.message || err.stack);
				event.emit("fileResult",this.fn,err);
			}
		});
	}
}

module.exports = Sass;