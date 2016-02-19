
'use strict';

//本地环境配置
module.exports = {
	"base_path" : "/Users/linfang/Documents/leju/leju-combo/", //文件存放路径
	"combo_dir" : "??", //跨目录文件分隔符
	"combo_file" : ",", //同目录下文件分隔符
	"combo_format" : ["js","css"], //支持合并功能的文件后缀名
	"js_module" : {
		"AMD" : { //r.js的参数设置
			"param" : "r",
			"baseUrl": "./",
			"optimize": "none",
			"paths": {
			    "requireLib": "/Users/linfang/Documents/leju/leju-combo/deps/minirequire"
			},
		    "name": 'requireLib',
		    "skipModuleInsertion": true,
		}, 
		"COMMONJS" : { //commonjs规范的参数设置
			"param" : "c"
		}
	},
	"css_module" : {
		"less" : { //less编译的参数设置
			"param" : "l",
			"paths" : ["/Users/linfang/Documents/leju/leju-combo/asset/css"]
		},
		"sass" : { //sass编译的参数设置
			"param" : "s",
			"includePaths" : ["/Users/linfang/Documents/leju/leju-combo/asset/css"]
		} 
	}
}