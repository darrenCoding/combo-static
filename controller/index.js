
'use strict';

let filetype = {
	'js r' : require('./js/amd'),
	'js c' : require('./js/common'),
	'css l' : require('./css/less'),
	'css s' : require('./css/sass')
}

let optFile = (data,suffix,search,fn,fileArr) => {
	return new filetype[suffix + " " + search](data,suffix,fn,fileArr);
}

module.exports = optFile