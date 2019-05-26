// 第三次模拟所有流程，首先将本次需要 push 的内容组织成最终需要传入 geth 的格式 format1
//然后判断 git push 是否成功。如果 push 失败就终止
// 如果 push 成功，就将 format1 上传至 django，记为 format2（这一步骤用于模拟 trustie 需要提供的功能，就是通过若干信息获取本次 push 的 diff 内容）
//上传成功后，将 format1 传入 geth，geth 从 django 获取 format2，对比，输出结果

var execSync = require('child_process').execSync;
var fixedCmd = "git --git-dir=/home/qiubing/qiubing/blogDir/.git ";
var unfixedCmd = "cherry";

//首先判断当前是否存在待 push 的 commit hash
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

//获取传入 geth 的数据信息
var uploadPushInfo_module = require('./uploadPushInfo_module');
var uploadPushInfo = uploadPushInfo_module();

//执行 git push 操作
unfixedCmd = "push";
execSync(fixedCmd + unfixedCmd);  // 无法获得 git push 的返回值

//判断 git push 操作是否成功（不晓得怎么获得 git push 的返回内容，于是再用一次 git cherry 来判断）
unfixedCmd = "cherry";
allHashUnderPush = execSync(fixedCmd + unfixedCmd);
if (!allHashUnderPush.toString()) {
    console.log("git push 提交成功！");
} else {
    console("git push 提交失败！");
    return;
}

//上传 uploadPushInfo 信息，上传成功后将 uploadPushInfo 传入 geth
var url = "http://127.0.0.1:8000/uploardPushInfo/";
const request = require('request');
request({
    url: url,
    method: "POST",
    json: true,
    headers: {
        "content-type": "application/json",
    },
    body: uploadPushInfo
}, function(error, response, body) {
    if (body.status == 200) {
        var Web3 = require('web3')
        // 连接本地启动的 geth rpc 服务
        if (typeof web3 !== 'undefined') {
            web3 = new Web3(web3.currentProvider);
        } else {
            web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));  //默认http://localhost:8545
        }
        // 判断是否连接成功
        if(!web3.isConnected()) {
            console.log("连接失败！！")
            return;
        } else {
            console.log("连接成功！！")
        }
        // 获取 geth 中已有的账号
        var accounts = web3.eth.accounts;
        // 调用已部署的智能合约 api
        var contractAddress="0x63ccf4544dcac0c294d911c4b773ad85174c7af3";
        var contractABI = [{"constant":true,"inputs":[],"name":"storedData","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"x","type":"string"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}]

        var contract = web3.eth.contract(contractABI).at(contractAddress);
        var gasValue = contract.set.estimateGas(uploadPushInfo)  //估计所需要消耗的 gas 值
        var result1 = contract.set.sendTransaction(uploadPushInfo,{from:accounts[0], gas:gasValue});
        console.log(result1);
    } else {
        console.log("上传 django 出错！！！\n\n");
        console.log(body);
        return;
    }
}); 

