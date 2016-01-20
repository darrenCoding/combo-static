
'use strict';

const sass = require('node-sass');
const iconv = require('iconv-lite');

class Sass{
	constructor(data){
		this.handleJs(data);
	}

	handleJs(data){
		sass.render({
		  	data : data
		}, (err, result) => { 
			if(Buffer.isBuffer(result.css)){
				iconv.decode(result.css,'utf8');
			}
		});
	}
}

module.exports = Sass;