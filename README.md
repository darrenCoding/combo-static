# combo-static
解析combo形式文件

## 安装
```
(sudo) npm install static-combo -S
```

## 版本
node >= 5.2.0

## 使用方法
```

const http  = require('http');
const combo = require('static-combo');
const mime  = require('mime-types');
const path  = require('path');

//配置
combo.config({
    /**
    * 配置相应的url查询参数来区分解析何种规范
    **/
    "params" : {
        'AMD' : "r", // http://cdn.leju.com/sso/app/dist/js/sso.js?r -> 解析AMD
        "COMMONJS" : "c", // http://cdn.leju.com/sso/app/dist/js/sso.js?c -> 解析COMMONJS
        "LESS" : "l", // http://cdn.leju.com/sso/app/dist/css/base.css?l -> 编译LESS
        "SASS" : "s" // http://cdn.leju.com/sso/app/dist/css/base.css?s -> 编译SASS
    },
    /**
    * 是否输出日志
    */
    log : false
    /**
    * 文件所在根目录
    */
    base_path : path.resolve(process.cwd(), 'dist'),
    /**
    * 跨目录文件分隔符
    *
    * 例：http://cdn.leju.com/sso/app/dist/js/sso??cms/app/dist/index.js(?x)
    */
    combo_dir : "??",
    /**
    * 同目录下文件分隔符
    *
    * 例：http://cdn.leju.com/sso/app/dist/js/sso,index.js(?x)
    */
    combo_file : ",",
    /**
    * 支持合并功能的文件后缀名
    */
    combo_format : ["js","css","scss","sass","less"],
    /**
    * 是否开启压缩
    */
    compress : false,
    js_module : {
        /**
        * 配置AMD解析参数，具体配置信息请参考r.js
        */
        AMD : {
            baseUrl: path.resolve(process.cwd(), 'static'),
            paths: {
                requireLib: path.resolve(__dirname,"../deps/minirequire")
            },
            name: 'requireLib',
            skipModuleInsertion: true,
            uglify: {
                make_seqs : false,
                dead_code : false
            }
        },
        /**
        * COMMONJS配置，具体配置信息请参考browserify
        */
        COMMONJS : {
        }
    }
})

let app = http.createServer(( req, res ) => {
  combo(req.url, (err, data, deps) => {
        /**
        * err 错误信息
        * data 文件内容
        * deps 依赖文件列表
        */
        let code = 200;
        if ( err ) {
             code = 404;
             res.writeHead(code, {
                'Content-Type' : 'text/html; charset=UTF-8'
             });
             res.end('<center><h1>404 Not Found</h1></center><hr><center>')
        } else {
             res.writeHead(code, {
                "Content-Type" : mime.contentType(path.extname(req.url))
             });
             res.end(data);
        }
    });
})

app.listen(8000)
```
