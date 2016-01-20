
'use strict';

let filetype = {
	'js r' : require('./js/amd'),
	'js c' : require('./js/common'),
	'css l' : require('./css/less'),
	'css s' : require('./css/sass')
}

let optFile = (files,suffix,search,fn) => {
	return new filetype[suffix + " " + search](files,suffix,fn)
}

module.exports = optFile