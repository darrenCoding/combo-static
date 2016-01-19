
'use strict';

class Compile{
	judge(str,ename){
		if(ename === 'css'){
			this.handleCss(str);
		}else{
			this.handleJs(str);
		}
	}

	handleCss(str){

	}

	handleJs(str){

	}
}

module.exports = Compile