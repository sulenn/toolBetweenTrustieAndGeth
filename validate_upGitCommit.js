// 本文件用于上传 git commit 信息

//文件读取引入和声明
var readline = require('readline');
var fs = require('fs');
var fReadName = '/home/qiubing/桌面/blogLog.log';
var fRead = fs.createReadStream(fReadName);
var objReadline = readline.createInterface({
	input: fRead,
});

//存储数据变量声明
var allCommitArr = new Object();
allCommitArr["data"] = new Array();
var singleCommitArr = new Object();
var flag = 0;
var mergeReg = /[\w]+/;  //该正则表达式用于匹配 merge 类型的 commit

// 利用子进程模块，同步调用 shell 指令
var execSync = require('child_process').execSync;

// 按行读取和处理
objReadline.on('line', (line)=>{
    if (line == "" && flag != 4) {
        //轮空
    } else if (flag == 4) {    //将单个 commit 信息压入总 commitArr 中
        var diff = execSync('git --git-dir=/home/qiubing/qiubing/blogDir/.git show ' + singleCommitArr["hash"]);  //注意 git 项目所处的绝对地址
        singleCommitArr["diff"] = diff.toString(); //添加 diff 字段
        flag = 0;
        allCommitArr["data"].push(singleCommitArr);
        singleCommitArr = new Object();
    } else {
        if (flag == 0) {   //处理 commit hash 字段
            var reg = /\s+([\w]+)/;
            var res = reg.exec(line)[1];
            singleCommitArr["hash"] = res;
            flag += 1;
        } else if (flag == 1 && mergeReg.exec(line) != "Merge") {   //处理 author 字段，排除 merge 类型的 commit
            var reg = /\s+([\s\S]+)/;
            var res = reg.exec(line)[1];
            singleCommitArr["author"] = res;
            flag += 1;
        } else if (flag == 2) {   //处理 date 字段
            var reg = /\s+([\s\S]+)/;
            var res = reg.exec(line)[1];
            singleCommitArr["date"] = res;
            flag += 1;
        } else if (flag == 3) {   //处理 title 字段
            var reg = /\s+([\s\S]+)/;
            var res = reg.exec(line)[1];
            singleCommitArr["title"] = res;
            flag += 1;
        }
    }
})

//关闭文件读取，同时上传 commit 信息
objReadline.on('close', ()=>{
    console.log('readline close...');
    console.log(allCommitArr["data"].length);
    //循环进行 http 请求，将每个 commit 上传至 django
    const request = require('request');
    var url = "http://127.0.0.1:8000/uplordGitCommit/";
    var requestData = "";
    for (var i = 0; i < allCommitArr["data"].length; i += 1) {
        requestData = allCommitArr["data"][i];
        // 引入 promise 用于同步 post 请求
        new Promise(function(resolve, reject) {
            request({
                url: url,
                method: "POST",
                json: true,
                headers: {
                    "content-type": "application/json",
                },
                body: JSON.stringify(requestData)
            }, function(error, response, body) {
                resolve(body);
            }); 
        }).then(function(body) {
            if (body.status == 200) {
                console.log(body);
            }
            else {
                console.log(body);
            }
        })
    }
});


