
"use strict";

const fs = require('fs');
const es6 = require('es6-shim');
const File = module.exports = function(){
    this.promise = Promise.resolve();
}

File.exist = function(filePath){
    let file = new File();
    return file.exist(filePath);
}

File.prototype.then = function(onFulfilled, onRejected){
    this.promise = this.promise.then(onFulfilled, onRejected);
    return this;
}

File.prototype["catch"] = function (onRejected) {
    this.promise = this.promise.catch(onRejected);
    return this;
}

File.prototype.exist = function(fileArr){
    let isExist = false,
        index = 0,
        len = fileArr.length;
    for(let file of fileArr){
        fs.existsSync(file) && ++index;
    }
    if(index === len){
        isExist = true
    }
    return this.then(function(){
        return isExist ? fileArr : isExist;
    })
}