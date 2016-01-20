
'use strict';

const event = require('../../lib/util').event;
const less = require('less');

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
	    		event.emit("fileResult",this.fn,err)
	    	}
	    });
	}
}

module.exports = Less;