
'use strict';

const less = require('less');
const event = require('../../lib/util').event;
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
		  paths : lastConfig.css_module.LESS.paths,
	      compress: false
	    },(err, output) => {
	    	this.fileArr.push.apply(this.fileArr,output.imports);
	    	if(!err){
	    		event.emit("compileData",this.fn,this.suffix,output.css,this.fileArr)
	    	}else{
	    		log4js.logger_e.error(err.message || err.stack);
	    		event.emit("fileResult",this.fn,err)
	    	}
	    });
	}
}

module.exports = Less;