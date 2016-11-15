
'use strict';

//本地环境配置
const path = require('path');

module.exports = {
	"params" : {
		'AMD' : "r",
		"COMMONJS" : "c",
		"LESS" : "l",
		"SASS" : "s"
	},
	"compress" : false,
	"base_path" : process.cwd(), //文件存放路径
	"combo_dir" : ";", //跨目录文件分隔符
	"combo_file" : ",", //同目录下文件分隔符
	"combo_format" : ["js","css","scss","sass","less"], //支持合并功能的文件后缀名
	"js_module" : {
		"AMD" : { //r.js的参数设置
			"baseUrl": "./",
			"paths": {
			    "requireLib":path.resolve(__dirname,"../deps/minirequire")
			},
		    "name": 'requireLib',
		    "skipModuleInsertion": true,
		    "uglify": {
		        "make_seqs" : false,
		        "dead_code" : false
		    }
		}, 
		"COMMONJS" : { //commonjs规范的参数设置
		}
	}
}