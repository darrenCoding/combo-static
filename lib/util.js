
'use strict';

const EventEmitter = require('events').EventEmitter;
const extend       = require('extend');
const uri          = require('url');
const fs           = require('fs');
const config       = require('../config/');
const path         = require('path');
const EventProxy   = () => {};
const objectRegExp = /^\[object (\S+)\]$/,
      toString     = Object.prototype.toString,
      event        = Object.assign(EventProxy,EventEmitter.prototype);

event.on("patherror",(fn, msg) => fn(msg));

class Utils {
    constructor () {
        Object.assign(this, config);
        this._params = Object.keys(this.params).map((item) => {
            return this.params[item];
        },this)

        this._fileMap = {
            'js' : [this.params['AMD'], this.params['COMMONJS']],
            'css' : [this.params['LESS'], this.params['SASS']]
        }
    }

    setConfig () {
        extend(true, this, lastConfig);
    }

    parseUrl (url, fn) {
        if ( typeof url === 'string' ) {
            let isBuild, //是否解析
                prefix, //文件类型
                param, //文件后缀
                upath, //文件路径
                aurl,
                uobj;
            try{
                uobj      = uri.parse(url, true);
                prefix    = path.extname(path.basename(uobj.path).replace(/\?+.+/g,'')).slice(1).replace(/\?+$/g,'');
                aurl      = new RegExp('(\\.)' + prefix + '(\\?.{0,})').exec(uobj.path) || [];
                param     = (aurl[2] && (~this._params.indexOf(aurl[2].slice(1, 2)))) ? aurl[2].slice(1, 2) : '';
                upath     = aurl[2] ? uobj.path.slice(1).match(/(.+\.\w+)(\?.{0,})/)[1] : uobj.path.slice(1);
            }catch(e){
                return this.next(fn, `[url] ${url} \n Failed to Resolve url`);
            }

            if ( ~this.combo_format.indexOf(prefix) ) {
                let resultArr = [],
                    matchPath = '',
                    uniqueFile = this.unique(upath.split(this.combo_dir));
                uniqueFile.forEach(function(elem){
                    resultArr.push(...this.unique(elem.split(this.combo_file).map(item => {
                        let reg = item.match(/(.+)\/(?:[^\/]+$)/);
                        if ( reg) {
                            matchPath = reg[1] + '/';
                        } else {
                            item = matchPath + item;
                        }
                        item = new RegExp('\\.(' + prefix + ')').test(item) ? item : item + '.' + prefix;
                        return item.replace(/_@\w{7}/, '');
                    })))
                },this)
                param  = this.isSass(prefix) ? this.params['SASS'] : this.isLess(prefix) ? this.params['LESS'] : param;
                prefix = this.isCss(prefix) ? 'css' : prefix;
                return fn && fn(this.addPath(resultArr), ...this.checkMatch(prefix, param));
            } else {
                this.next(fn, `[url] ${url} \n Wrong file suffix`);
            }
        } else {
            this.next(fn, `[url] ${url} \n Wrong file type`)
        }
    }

    next (callback, errmsg) {
        return event.emit('patherror', callback, errmsg);
    }

    checkMatch ( prefix, param ) {
        let result = [prefix],
            isMatch = !!~this._fileMap[prefix].indexOf(param),
            isBuild   = ((param || this.isCss(prefix)) && isMatch) ? true : false;
        result.push(isMatch ? param : '', isBuild)
        return result;
    }

    addPath (args) {
        let init_arr = [];
        for (let value of args) {
            init_arr.push(path.resolve(this.base_path, value));
        }
        return init_arr;
    }

    isCss (ex) {
        return this.isSass(ex) || this.isLess(ex);
    }

    isSass (ex) {
        return ~['sass','scss'].indexOf(ex)
    }

    isLess (ex) {
        return ex === 'less'
    }

    unique (arr) {
      return Array.from(new Set(arr));
    }

    getType (obj) {
      let type = typeof obj;
      if ( type !== 'object' ) {
        return type;
      }
      return toString.call(obj)
        .replace(objectRegExp, '$1').toLowerCase();
    }

    each(obj, fn, callback){
        let i      = -1,
            objArr = [],
            len    = obj.length;

        if ( !len ) {
            len = Object.keys(obj).length;
            for ( var attr in obj ) {
              objArr.push(attr);
            }
        }

        go();
        function go(){
            if ( ++i === len ) {
              return callback();
            };
            if ( objArr.length > 0 ) {
              fn.call(obj[objArr[i]], objArr[i], obj[objArr[i]], done);
            } else {
              fn.call(obj[i], i, obj[i], done);
            }
        }

        function done(err){
            if ( err ) {
              return callback(err);
            }
            go();
        }
    }

    getFinfo () {
        const _ = Error.prepareStackTrace;
        Error.prepareStackTrace = (_, stack) => stack;
        const stack = new Error().stack.slice(1);
        Error.prepareStackTrace = _;
        const einfo = stack[0];
        return einfo.getFileName() + ' ' + einfo.getLineNumber() + '\n';
    }
}

exports.Utils = Utils;
exports.event = event;