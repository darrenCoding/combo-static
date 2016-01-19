
'use strict';

let filetype = {
	'js r' : require('./js/amd'),
	'js c' : require('./js/common')
}

let optFile = (files,suffix,search) => {
	return new filetype[suffix + " " + search](files)
}

module.exports = optFile