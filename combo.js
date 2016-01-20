
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

event.on("fileError",(res,msg) => res.end(msg));

module.exports = (url,res) => {
	let util = new utils(),
		fileArr = [];
	util.parseUrl(url,(files,suffix,search,isStr) => {
		if(util.getType(files) === 'array'){
			if(!search){
				combineFile(files,function(data){
					compress(true,suffix,data)
				})					
			}else{
				if(!isStr){
					compile(files,suffix,search);
				}else{
					combineFile(files,function(data){
						compile(data,suffix,search);
					})
				}
			}
		}else{
			res.end(files);
		}
	});

	function combineFile(files,callback){
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
					callback && callback(str);
				})
			}else{
				event.emit("fileError",res,"the file is not exist");
			}	
		})
	}

	function compress(ispress,cate,content){
		if(ispress){
			content = (cate === 'js') ? uglify.minify(content,{fromString: true}).code : csswring.wring(content).css;
		}
		return res.end(content);
	}
}
	

