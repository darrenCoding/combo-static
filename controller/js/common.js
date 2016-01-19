
'use strict';
const browserify = require('browserify');

class Common{
	constructor(files){
		this.handleJs(files)
	}

	handleJs(files){
		var b_instance= browserify(files);
		r_instance.bundle(function(err,buf){
			if(!err){
				
			}
		})
	}
}

module.exports = Common;