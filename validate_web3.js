// 连接本地启动的 geth rpc 服务，连接成功之后进行如发起交易等操作

var Web3 = require('web3')

// 连接本地启动的 geth rpc 服务
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));//默认http://localhost:8545
    // web3 = new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider('ws://localhost:8546'));
}

// 判断是否连接成功
if(!web3.isConnected()) {
    console.log("连接失败！！")
} else {
    console.log("连接成功！！")
}

// 获取 geth 中已有的账号
var accounts = web3.eth.accounts;

// console.log("账户：" + accounts)

// console.log("余额：" + web3.eth.getBalance(web3.eth.coinbase).toString())

// 调用已部署的智能合约 api
var contractAddress = "0x63ccf4544dcac0c294d911c4b773ad85174c7af3";
var contractABI = [{"constant":true,"inputs":[],"name":"storedData","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"x","type":"string"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}]

var contract = web3.eth.contract(contractABI).at(contractAddress);
var result = contract.get();
console.log(result);

// var result1 = contract.set.sendTransaction("push git content newest qiubing",{from:accounts[0]});
// var result1 = contract.set.sendTransaction("哈t content newest qinewest qiubing219.4.23：完成功能完成功能：上传 模拟 push 内容 c1 至 django 服务器，成功返回之后再连接本地启动的 geth rpc 服务，调用事先部署好的智能合约 api，将 模拟 push 内容 c2 传入（理论上 c1 和 c2 是相等的）。geth 内部 commit transaction 模块发起请求，从 django 服务器获取 c1 内容。之后对比 c1 和 c2 内容，判断其是否相等。push git content newest qiubing219.4.23：完成功能：上传 模拟 push 内容 c1 至 django 服务器，成功返回之后再连接本地启动的 geth rpc 服务，调用事先部署好的智能合约 api，将 模拟 push 内容 c2 传入（理论上 c1 和 c2 是相等的）。geth 内部 commit transaction 模块发起请求，从 django 服务器获取 c1 内容。之后对比 c1 和 c2 内容，判断其是否相等push git content newest qiubing219.4.23：完成功能：上传 模拟 push 内容 c1 至 django 服务器，将 模拟 push ",{from:accounts[0], gas:500000});
// console.log("交易 hash 值：", result1)