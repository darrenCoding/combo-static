
'use strict';

const es6 = require('es6-shim');
const EventEmitter = require('events').EventEmitter;
const path = require('path');
const uri = require('url');
const EventProxy = () => {};
const event = Object.assign(EventProxy,EventEmitter.prototype),
      objectRegExp = /^\[object (\S+)\]$/,
      slice = Array.prototype.slice,
      toString = Object.prototype.toString;

event.on("patherror",(fn,msg) => fn(msg));

class Utils {
    constructor(){
        Object.assign(this,lastConfig);
        this.params = Object.keys(this.params).map(function(item){
            return this.params[item];
        },this)
    }

    parseUrl(url,fn){
        if(typeof url === 'string'){
            let ename,
                obj_r,
                obj_s,
                isStr,
                analy_url,
                suffixReg,
                url_path;
            try{
                ename = path.extname(url).slice(1).match(/(^[^?]+)(?:\?\w+)?/)[1];
                obj_r = uri.parse(url, true);
                analy_url = new RegExp("(\\.)" + ename + "(\\?.?){0,1}").exec(obj_r.path);
                obj_s = (analy_url[2] && this.params.indexOf(analy_url[2].slice(1)) != -1) ? analy_url[2].slice(1) : ''; //文件后缀
                url_path = analy_url[2] ? obj_r.path.slice(1).match(/(.+\.\w+)(\?.+)/)[1] : obj_r.path.slice(1);//文件路径
                isStr = (ename === 'css' && obj_s) ? true : false;
            }catch(e){
                return this.next(fn,"The url format is wrong");
            }
            if(this.combo_format.indexOf(ename) > -1){
                let result_arr = [],
                    match_path = '',
                    url_f = this.unique(url_path.split(this.combo_dir));
                for(let elem of url_f.values()){
                    result_arr.push(...this.unique(elem.split(this.combo_file).map(item => {
                        let reg = item.match(/(.+)\/(?:[^\/]+$)/);
                        if(reg){
                            match_path = reg[1] + "/";
                        }else{
                            item = match_path + item;
                        }
                        return item = new RegExp("\\.(" + ename + ")").test(item) ? item : item + "." + ename;
                    })))
                };
                return fn && fn(this.addPath(result_arr),ename,obj_s,isStr);
            }else{
                this.next(fn,"The url doesn't support the file suffix");
            }
        }else{
            this.next(fn, "url must be string")
        }
    }

    next(callback,errmsg){
        return event.emit("patherror",callback,errmsg);
    }

    addPath(args){
        let init_arr = [];
        for(let value of args){
            init_arr.push(path.resolve(this.base_path,value));
        }
        return init_arr;
    }

    unique(arr){
      return Array.from(new Set(arr));
    }

    getType(obj){
      let type = typeof obj;
      if (type !== 'object') {
        return type;
      }
      return toString.call(obj)
        .replace(objectRegExp, '$1').toLowerCase();
    }

    each(obj,fn,callback){
        let i = -1,
            objArr = [],
            len = obj.length;

        if(!len){
            len = Object.keys(obj).length;
            for(var attr in obj){
              objArr.push(attr);
            }
        }

        go();
        function go(){
            if(++i === len){
              return callback();
            };
            if(objArr.length > 0){
              fn.call(obj[objArr[i]], objArr[i], obj[objArr[i]], done);
            }else{
              fn.call(obj[i], i, obj[i], done);
            }
        }

        function done(err){
            if(err){
              return callback(err);
            }
            go();
        }
    }
}

exports.Utils = Utils;
exports.event = event;