
'use strict';

//本地环境配置
module.exports = {
	"base_path" : "/Users/linfang/Documents/leju/leju-combo/", //文件存放路径
	"combo_dir" : ";", //跨目录文件分隔符
	"combo_file" : ",", //同目录下文件分隔符
	"combo_format" : ["js","css"], //支持合并功能的文件后缀名
	"extend" : { //扩展方法
		"js_module" : {
			"AMD" : "r", //AMD规范的参数设置
			"COMMONJS" : "c",//commonjs规范的参数设置
		},
		"css_module" : {
			"less" : "l", //less编译的参数设置
			"sass" : "s" //sass编译的参数设置
		}
	}
}