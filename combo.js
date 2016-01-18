
'use strict';

const es6 = require('es6-shim');
const utils = require('./lib/util').Utils;
const event = require('./lib/util').event;
const fs = require('fs');
const uglify = require('uglify-js');
const File = require('./lib/file');
const iconv = require('iconv-lite');

event.on("fileError",(res,msg) => res.end(msg));
module.exports = (url,res) => {
	let util = new utils(),
		fileArr = [];
	util.parseUrl(url,(files,suffix,search) => {
		if(util.getType(files) === 'array'){
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
						let str = iconv.decode(buf,'utf8');
						str = uglify.minify(str,{fromString: true}).code;
						res.end(str);
					})
				}else{
					event.emit("fileError",res,"the file is not exist");
				}	
			})
		}else{
			res.end(files);
		}
	});
}
	

