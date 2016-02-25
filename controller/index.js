
'use strict';

const amdp = "js " + lastConfig.params.AMD;
const commonp = "js " + lastConfig.params.COMMONJS;
const lessp = "css " + lastConfig.params.LESS;
const sassp = "css " + lastConfig.params.SASS;

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