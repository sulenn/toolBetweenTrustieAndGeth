var uploadPushInfo = new Object()
uploadPushInfo["shaList"] = ["c492c241e28b027efd4806f79ff6bc11c5b92979", "7a3437f18dfc2191dddf4255e42a9a39747918dc"]
uploadPushInfo["branch"] = "master"
uploadPushInfo["ownername"] = "Nigel"
uploadPushInfo["reponame"] = "trustietest"
uploadPushInfo["username"] = "Nigel"
uploadPushInfo["password"] = "Nigel.zhang007"
uploadPushInfo = JSON.stringify(uploadPushInfo)


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