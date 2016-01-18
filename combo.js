
'use strict';

const es6 = require('es6-shim');
const utils = require('./lib/util').Utils;
const event = require('./lib/util').event;
const fs = require('fs');
const uglify = require('uglify-js');
const File = require('./lib/file');
const iconv = require('iconv-lite');

event.on("fileError",(msg) => console.log(msg));
module.exports = (url,res) => {
	let util = new utils(),
		fileArr = [];
	util.parseUrl(url,function(files){
		if(util.getType(files) === 'array'){
			File.exist(files).then(function(data){
				if(data){
					let chunks = [],
						size = 0,
						buf,
						str;
					util.each(data,function(i,file,go){
						let rs  = fs.createReadStream(file);
						rs.on("data",function(chunk){
							chunks.push(chunk);
							size += chunk.length
						})
						rs.on("end",function(){
							buf = Buffer.concat(chunks,size);
							go();
						})
					},function(){
						let str = iconv.decode(buf,'utf8');
						str = uglify.minify(str,{fromString: true}).code;
						
					})
				}else{
					event.emit("fileError","the file is not exist");
				}	
			})
		}else{
			res.end(files);
		}
	});
}
	

