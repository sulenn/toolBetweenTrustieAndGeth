
// 通过 git show 指令从本地读取 hash 值对应的 commit 记录信息
var hash = "7b706e866e30034aade670726ac3722e86dd3b19";
var execSync = require('child_process').execSync;
var gitShow = execSync('git --git-dir=/home/qiubing/qiubing/blogDir/.git show ' + hash);  // gitShow 是字节类型，需要 to.String() 转换
var line = new Array();
gitShow.toString().trim().split('\n').forEach(function(v, i) {
    line['str' + (i+1)] = v;
})

// 填充 gitCommit 为满足条件的 json 对象
var gitCommit = new Object();
var reg = /\s+([\s\S]+)/;
gitCommit["hash"] = reg.exec(line["str1"])[1];   //hash
gitCommit["author"] = reg.exec(line["str2"])[1]; //author
gitCommit["date"] = reg.exec(line["str3"])[1];  //date
gitCommit["title"] = reg.exec(line["str5"])[1];  //title
gitCommit["diff"] = gitShow.toString();  //diff

//上传 commit 信息
var requestData = gitCommit;
var url = "http://127.0.0.1:8000/uplordGitCommit/";
const request = require('request');
request({
    url: url,
    method: "POST",
    json: true,
    headers: {
        "content-type": "application/json",
    },
    body: JSON.stringify(requestData)
}, function(error, response, body) {
    if (body.status == 200) {

        var hashAndDiff = new Object();      //传入 geth 中的值
        hashAndDiff["hash"] = gitCommit["hash"];
        hashAndDiff["diff"] = gitCommit["diff"];

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
        } else {
            console.log("连接成功！！")
        }
        // 获取 geth 中已有的账号
        var accounts = web3.eth.accounts;
        // 调用已部署的智能合约 api
        var contractAddress="0x63ccf4544dcac0c294d911c4b773ad85174c7af3";
        var contractABI = [{"constant":true,"inputs":[],"name":"storedData","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"x","type":"string"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}]

        var contract = web3.eth.contract(contractABI).at(contractAddress);
        var gasValue = contract.set.estimateGas(JSON.stringify(hashAndDiff), {from:accounts[0], gas:500000})  //估计所需要消耗的 gas 值
        var result1 = contract.set.sendTransaction(JSON.stringify(hashAndDiff),{from:accounts[0], gas:gasValue});
        console.log(result1)
    } else {
        console.log(body);
    }
}); 
