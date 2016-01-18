
'use strict';

var http = require('http');
var util = require('./util');
var mime = require('mime-types');

var res = module.exports = {
  __proto__: http.ServerResponse.prototype
};

res.status = res.status || function (code){
  this.statusCode = code;
  return this;
};

res.set = res.set || function (resH, resV) {
	if (arguments.length === 2) {
	  	if (util.getType(resV) !== 'string'){
	  		String(resV);
	  	}
	    if ('content-type' === resH.toLowerCase() && !/;\s*charset\s*=/.test(resV)){
	      	var charset = mime.charset(resV.split(';')[0]);
	      	if (charset){
	         resV += '; charset=' + charset.toLowerCase();
	      	}
	    }
	    this.setHeader(resH, resV);
	} else {
	    for (var key in resH){
	    	if(resH.hasOwnProperty(key)){
	    		this.set(key, resH[key]);
	    	}
	    }
	}
	return this;
};

res.type = function(type){
    this.set('Content-Type', mime.lookup(type));
};

res.get = function(field){
  return this.getHeader(field);
};

res.send = res.send || function(val){
	var len,encode = 'utf8';
	switch(util.getType(val)){
		case 'string':
			if (!this.get('Content-Type')){
		        this.type('html');
		    }
		break;
		case 'object' : 
			if (!this.get('Content-Type')) {
		        this.type('json');
		    }
		    val = JSON.stringify(val);
		break;
		case 'uint8array' :
			if(Buffer.isBuffer(val)){
				if (!this.get('Content-Type')) {
		          	this.type('txt');
		        }
			}
		break;
	}
	if (val !== undefined) {
	    if (!Buffer.isBuffer(val)) {
	     	len = Buffer.byteLength(val, 'utf8');
	     	encode = undefined;
	    }else{
	    	len = val.length
	    }
	    this.set('Content-Length', len);
	}

	if (204 == this.statusCode || 304 == this.statusCode) {
	    this.removeHeader('Content-Type');
	    this.removeHeader('Content-Length');
	    this.removeHeader('Transfer-Encoding');
	    val = '';
	}
	this.end(val,encode)
}