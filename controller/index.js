
'use strict';

const config = require('../config');
const amdp = "js " + config.js_module.AMD.param;
const commonp = "js " + config.js_module.COMMONJS.param;
const lessp = "css " + config.css_module.less.param;
const sassp = "css " + config.css_module.sass.param;

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