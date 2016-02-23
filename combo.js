
'use strict';

const es6 = require('es6-shim');
const fs = require('fs');
const uglify = require('uglify-js');
const csswring = require("csswring");
const iconv = require('iconv-lite');
const config = global.lastConfig = require('./config');
const utils = require('./lib/util').Utils;
const event = require('./lib/util').event;
const log4js = require('./config/log');
const File = require('./lib/file');
const compile = require('./controller/');

let util = new utils();

let compress = (ispress,cate,content,deps,cb) => {	
	if(ispress){
		try{
			content = (cate === 'js') ? uglify.minify(content,{fromString: true}).code : csswring.wring(content).css;
			return cb && cb(null,content,deps);
		}catch(e){
			log4js.logger_e.error(e.message || e.stack);
			return cb && cb(e)
		}
	}else{
		return cb && cb(null,content,deps);
	}
}

let combineFile = (files,callback) => {
	File.exist(files).then(data => {
		if(data){
			let chunks = [],
				size = 0,
				buf,
				str;
			util.each(data,(i,file,go) => {
				let rs  = fs.createReadStream(file);
				rs.on("data",chunk => {
					chunks.push(chunk);
					size += chunk.length
				})
				rs.on("end",() => {
					buf = Buffer.concat(chunks,size);
					go();
				})
			},() => {
				str = iconv.decode(buf,'utf8');
				callback && callback(null,str);
			})
		}else{
			callback && callback("the file is not exist");
		}	
	})
}

event.on("fileResult",(fn,err,data) => fn(err,data));

event.on("compileData",(fn,suffix,data,deps) => compress(true,suffix,data,deps,fn));

let combo = module.exports = (url,fn) => {
	let fileArr = [];
	util.parseUrl(url,(files,suffix,search,isStr) => {
		if(util.getType(files) === 'array'){
			if(!search){
				combineFile(files,function(err,data){
					if(!err){
						fn && compress(true,suffix,data,files,fn)
					}else{
						log4js.logger_e.error(err.message || err.stack);
						event.emit("fileResult",fn,err);
					}
				})					
			}else{
				if(!isStr){
					compile(files,suffix,search,fn);
				}else{
					combineFile(files,function(err,data){
						if(!err){
							compile(data,suffix,search,fn,files);
						}else{
							log4js.logger_e.error(err.message || err.stack);
							event.emit("fileResult",fn,err);
						}
					})
				}
			}
		}else{
			event.emit("fileResult",fn,files)
		}
	});
}
	
combo.config = (options) => {
	lastConfig = Object.assign(config,options);;
}
