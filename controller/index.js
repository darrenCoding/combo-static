
'use strict';

const amdp = "js " + lastConfig.js_module.AMD.param;
const commonp = "js " + lastConfig.js_module.COMMONJS.param;
const lessp = "css " + lastConfig.css_module.less.param;
const sassp = "css " + lastConfig.css_module.sass.param;

let map  = new Map();
map.set(amdp,require('./js/amd'));
map.set(commonp,require('./js/common'));
map.set(lessp,require('./css/less'));
map.set(sassp,require('./css/sass'));

let optFile = (data,suffix,search,fn,fileArr) => {
	let func = map.get(suffix + " " + search);
	return new func(data,suffix,fn,fileArr);
}

module.exports = optFile