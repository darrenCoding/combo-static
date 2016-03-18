
'use strict';

//线上环境配置
const path = require('path');

module.exports = {
	"params" : {
		'AMD' : "r",
		"COMMONJS" : "c",
		"LESS" : "l",
		"SASS" : "s"
	},
	"compress" : false,
	"base_path" : path.join(__dirname, '../'), //文件存放路径
	"combo_dir" : "??", //跨目录文件分隔符
	"combo_file" : ",", //同目录下文件分隔符
	"combo_format" : ["js","css"], //支持合并功能的文件后缀名
	"js_module" : {
		"AMD" : { //r.js的参数设置
			"baseUrl": "./",
			"optimize": "none",
			"paths": {
			    "requireLib": path.join(__dirname, '../') + "deps/minirequire"
			},
		    "name": 'requireLib',
		    "skipModuleInsertion": true,
		}, 
		"COMMONJS" : { //commonjs规范的参数设置
		}
	},
	"css_module" : {
		"LESS" : { //less编译的参数设置
			"paths" : [path.join(__dirname, '../') + "asset/css"]
		},
		"SASS" : { //sass编译的参数设置
			"includePaths" : [path.join(__dirname, '../') + "asset/css"]
		} 
	}
}