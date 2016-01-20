
'use strict';

const sass = require('node-sass');
const iconv = require('iconv-lite');

class Sass{
	constructor(data,suffix,fn){
		this.fn = fn;
		this.suffix = suffix;
		this.handleJs(data);
	}

	handleJs(data){
		sass.render({
		  	data : data
		}, (err, result) => {
			if(!err){
				if(Buffer.isBuffer(result.css)){
					event.emit("compileData",this.fn,this.suffix,iconv.decode(result.css,'utf8'))
				}
			}else{
				event.emit("fileResult",this.fn,err);
			}
		}.bind(this));
	}
}

module.exports = Sass;