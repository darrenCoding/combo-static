
'use strict';

const es6 = require('es6-shim');
const fs = require('fs');
const uglify = require('uglify-js');
const csswring = require("csswring");
const iconv = require('iconv-lite');
const utils = require('./lib/util').Utils;
const event = require('./lib/util').event;
const File = require('./lib/file');
const compile = require('./controller/');

let compress = (ispress,cate,content,cb) => {
	if(ispress){
		try{
			content = (cate === 'js') ? uglify.minify(content,{fromString: true}).code : csswring.wring(content).css;
			return cb && cb(null,content);
		}catch(e){
			return cb && cb(e)
		}
	}
	
}

let combineFile = (files,callback) => {
	let util = new utils();
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

event.on("compileData",(fn,suffix,data) => {
	compress(true,suffix,data,fn)
});

module.exports = (url,fn) => {
	let util = new utils(),
		fileArr = [];
	util.parseUrl(url,(files,suffix,search,isStr) => {
		if(util.getType(files) === 'array'){
			if(!search){
				combineFile(files,function(err,data){
					if(!err){
						fn && compress(true,suffix,data,fn)
					}else{
						event.emit("fileResult",fn,err);
					}
				})					
			}else{
				if(!isStr){
					compile(files,suffix,search,fn);
				}else{
					combineFile(files,function(err,data){
						if(!err){
							compile(data,suffix,search,fn);
						}else{
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
	

