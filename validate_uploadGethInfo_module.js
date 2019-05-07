// 本文件是 uploadGethInfo 的模块化，用于其它逻辑调用

function validate_uploadGethInfo_module() {
    var uploadGethInfo = new Object();  //传入 geth 的数据
    var reg = /[^\n]+/;   //用于去掉各种字符串尾部 \n 换行符
    var execSync = require('child_process').execSync;
    var fixedCmd = "git --git-dir=/home/qiubing/qiubing/blogDir/.git ";
    var unfixedCmd = "rev-parse HEAD";

    //获取最新的 hash 值，字节类型
    var newestHash = execSync(fixedCmd + unfixedCmd);
    // console.log("最新的 hash 值：",reg.exec(newestHash.toString())[0]);
    uploadGethInfo["newestHash"] = reg.exec(newestHash.toString())[0];

    //获取当前 push 单位所有尚未提交的 hash 值
    unfixedCmd = "cherry";   
    try {
        var allHashUnderPush = execSync(fixedCmd + unfixedCmd);
    } catch(err) {
        console.log("错误！本地当前分支没有对应的远程分支！");
        return;
    }

    //获取当前 push 模块最旧的 hash 值
    var hashArr = allHashUnderPush.toString().split("\n");   //因为每个 hash 都带有一个 \n 分行符，故数组长度为 hash 数量 + 1
    unfixedCmd = "rev-parse HEAD";   //HEAD 指向最新的 hash值， HEAD^ 指向第二新的 hash 值，以此类推
    if (hashArr.length < 2) {  //假如没有任何提交，则 hashArr 的值为 “”，长度为 1
        console.log("当前 repo 没有新的 commit 提交！");
        return;
    }
    for (var i = 1; i < hashArr.length; i += 1) {   //注意这儿 i 从 1 开始
        unfixedCmd = unfixedCmd + "^";
    }
    var oldestHash = execSync(fixedCmd + unfixedCmd); 
    // console.log("\n最旧的 hash 值：", reg.exec(oldestHash.toString())[0]);
    uploadGethInfo["oldestHash"] = reg.exec(oldestHash.toString())[0];

    //获取当前所处分支
    unfixedCmd = "symbolic-ref --short -q HEAD";
    var branch = execSync(fixedCmd + unfixedCmd);
    // console.log("\n当前所处分支 branch：", reg.exec(branch.toString())[0]);
    uploadGethInfo["branch"] = reg.exec(branch.toString())[0];

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
    uploadGethInfo["username"] = username;
    uploadGethInfo["projectName"] = projectName;

    //获取两次 hash 之间的 diff 内容
    unfixedCmd = "diff " + uploadGethInfo["newestHash"] + " " + uploadGethInfo["oldestHash"];
    var diff = execSync(fixedCmd + unfixedCmd);
    // console.log("\ndiff：", diff.toString());
    uploadGethInfo["diff"] = diff.toString();
    // console.log(JSON.stringify(uploadGethInfo));
    return JSON.stringify(uploadGethInfo);
}

module.exports = validate_uploadGethInfo_module;