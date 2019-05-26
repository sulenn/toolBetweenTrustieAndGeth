// 本文件是 uploadPushInfo 的模块化，用于其它逻辑调用

function uploadPushInfo_module() {
    // 获取并组织传入 geth 的 data 信息，包括当前 push 阶段的所有 hash 、当前所处分支 branch、用户名 owner、项目名 reponame

    var uploadPushInfo = new Object();  //传入 geth 的数据
    var reg = /[^\n]+/;   //用于去掉各种字符串尾部 \n 换行符
    var execSync = require('child_process').execSync;
    // var fixedCmd = "git --git-dir=/home/qiubing/qiubing/blogDir/.git ";
    var fixedCmd = "git --git-dir=/home/qiubing/桌面/trustietest/.git ";
    var unfixedCmd = "rev-parse HEAD";

    //获取当前 push 单位所有尚未提交的 hash 值
    unfixedCmd = "cherry";   
    try {
        var allHashUnderPush = execSync(fixedCmd + unfixedCmd);
    } catch(err) {
        console.log("错误！本地当前分支没有对应的远程分支！");
        return;
    }
    if (!allHashUnderPush.toString()) {
        console.log("当前 repo 没有新的 commit 提交！");
        return;
    }

    // 获取所有待 push 提交的 hash 值
    var pendingArr = allHashUnderPush.toString().split("\n");   //因为每个 hash 都带有一个 \n 分行符，故数组长度为 hash 数量 + 1
    var hashArr = [];
    for (var i = 0; i < pendingArr.length - 1; i += 1) {   //注意这儿 i 从 1 开始
        hashArr.push(pendingArr[i].substring(2,42))  //取第 2 到 第 41 个字节
    }
    uploadPushInfo["commithash"] = hashArr

    //获取当前所处分支
    unfixedCmd = "symbolic-ref --short -q HEAD";
    var branch = execSync(fixedCmd + unfixedCmd);
    // console.log("\n当前所处分支 branch：", reg.exec(branch.toString())[0]);
    uploadPushInfo["branch"] = reg.exec(branch.toString())[0];

    //获取用户名和项目名
    unfixedCmd = "remote -v";
    var remoteInfo = execSync(fixedCmd + unfixedCmd);
    var fetchRemoteInfo = remoteInfo.toString().split("\n")[0];
    reg1 = /\s+([\s\S]+)\s/;
    var urlStr = reg1.exec(fetchRemoteInfo)[1];
    var strArr = urlStr.split("/");
    var username = strArr[3];
    // console.log("\nusername：", username);
    var projectName = strArr[4].slice(0, strArr[4].length - 4);    //考虑到 projectName 中可以包含 . 小数点等特殊符号，于是就用 slice 按字符串长度来截取
    // console.log("\nprojectName：", projectName);
    uploadPushInfo["owner"] = username;
    uploadPushInfo["reponame"] = projectName;

    return JSON.stringify(uploadPushInfo)
}

module.exports = uploadPushInfo_module;