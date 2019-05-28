// 获取并组织传入 geth 的 data 信息，包括当前 push 阶段的所有 hash 、
// 当前所处分支 branch、项目创世人 ownername、项目名 reponame、
// 用户名 username、以及密码 password

var execSync = require('child_process').execSync;

function uploadPushInfo_module() {

    var uploadPushInfo = new Object();  //传入 geth 的数据
    
    uploadPushInfo["shaList"] = getShaList()

    uploadPushInfo["branch"] = getBranch();

    var ownernameAndReponame = getOwnernameAndReponame()
    uploadPushInfo["ownername"] = ownernameAndReponame["ownername"]
    uploadPushInfo["reponame"] = ownernameAndReponame["reponame"]

    var usernameAndPassword = getUsernameAndPassword()
    uploadPushInfo["username"] = usernameAndPassword["username"]
    uploadPushInfo["password"] = usernameAndPassword["password"]

    return JSON.stringify(uploadPushInfo)
}

module.exports = uploadPushInfo_module;   //模块化

console.log(uploadPushInfo_module())
    
// 获取当前 push 单位所有尚未提交的 hash 值
function getShaList() {
    try {
        var allHashUnderPush = execSync("git cherry");
    } catch(err) {
        console.log("错误！本地当前分支没有对应的远程分支！");
        return;
    }
    if (!allHashUnderPush.toString()) {
        console.log("当前 repo 没有新的 commit 提交！");
        return;
    }
    var pendingArr = allHashUnderPush.toString().split("\n");   //因为每个 hash 都带有一个 \n 分行符，故数组长度为 hash 数量 + 1
    var shaList = [];
    for (var i = 0; i < pendingArr.length - 1; i += 1) {   //注意这儿 i 从 1 开始
        shaList.push(pendingArr[i].substring(2,42))  //取第 2 到 第 41 个字节
    }
    return shaList
}

//获取当前所处分支 branch
function getBranch() {
    var reg = /[^\n]+/;   //用于去掉各种字符串尾部 \n 换行符
    var branch = execSync("git symbolic-ref --short -q HEAD");
    // console.log("\n当前所处分支 branch：", reg.exec(branch.toString())[0]);
    return reg.exec(branch.toString())[0]
}

//获取 ownername 和 项目名reponame
function getOwnernameAndReponame() {
    unfixedCmd = "remote -v";
    var remoteInfo = execSync("git remote -v");
    var fetchRemoteInfo = remoteInfo.toString().split("\n")[0];
    reg = /\s+([\s\S]+)\s/;
    var urlStr = reg.exec(fetchRemoteInfo)[1];
    // console.log(fetchRemoteInfo)
    // console.log(reg1.exec(fetchRemoteInfo))
    // console.log(urlStr)
    var strArr = urlStr.split("/");
    var ownername = strArr[3];
    // console.log("\nusername：", username);
    try {  //捕获可能由于所选的 remote 协议类型而导致的错误
        var reponame = strArr[4].slice(0, strArr[4].length - 4);    //考虑到 projectName 中可以包含 . 小数点等特殊符号，于是就用 slice 按字符串长度来截取
    } catch(err) {
        console.log("不支持的 remote 类型，如 ssh 类型协议！")
        return
    }
    // console.log("\nprojectName：", projectName);
    return {"ownername":ownername, "reponame":reponame}
}

//获取 用户名 username 和 密码 password
function getUsernameAndPassword() {
    unfixedCmd = ""
    var configList = execSync("git config --global --list")
    // console.log(configList.toString())
    var nameReg = /user.name=([\s\S]+)/
    var passwordReg = /user.password=([\s\S]+)/
    var arr = configList.toString().split("\n")
    var username = ""
    var password = ""
    for (var i = 0; i < arr.length; i += 1) {
        var nameRegResult = nameReg.exec(arr[i])
        if (nameRegResult != null) {
            username = nameRegResult[1]
        }
        var passwordRegResult = passwordReg.exec(arr[i])
        if (passwordRegResult != null) {
            password = passwordRegResult[1]
        }
    }
    return {"username":username, "password":password}
}