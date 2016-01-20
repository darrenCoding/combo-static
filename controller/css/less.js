
'use strict';

const less = require('less');
const event = require('../../lib/util').event;
const log4js = require('../../config/log');

class Less{
	constructor(data,suffix,fn){
		this.fn = fn;
		this.suffix = suffix;
		this.handleJs(data);
	}

	handleJs(data){
		less.render(data,{
	      compress: false 
	    },(err, output) => {
	    	if(!err){
	    		event.emit("compileData",this.fn,this.suffix,output.css)
	    	}else{
	    		log4js.logger_e.error(err.message || err.stack);
	    		event.emit("fileResult",this.fn,err)
	    	}
	    });
	}
}

module.exports = Less;