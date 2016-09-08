
'use strict';

const less   = require('less');
const path   = require('path');
const event  = require('../../lib/util').event;
const log4js = require('../../config/log');

class Less{
	constructor(data,suffix,fn,fileArr){
		this.fn = fn;
		this.fileArr = fileArr;
		this.suffix = suffix;
		this.handleJs(data);
	}

	handleJs(data){
		less.render(data,{
		  paths :  path.dirname(this.fileArr[0]),
	      compress: lastConfig.compress
	    },(err, output) => {
	    	this.fileArr.push.apply(this.fileArr,output.imports);
	    	if(!err){
	    		event.emit("compileData",this.fn,this.suffix,output.css,this.fileArr)
	    	}else{
	    		log4js.logger_e.error(err.message || err.stack);
	    		event.emit("fileResult",this.fn,err.message)
	    	}
	    });
	}
}

module.exports = Less;