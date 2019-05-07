// 本文件是 validate_web3.js 的模块化表示，用于其他文件引用

var Web3 = require('web3')

function Validate_web3_module() {
    this.gethConnect = function(content) {
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
        var contractAddress="0x7a7db47ac09475ec94aa77f5107e2c51993d3d02";
        var contractABI = [{"constant":true,"inputs":[],"name":"storedData","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"x","type":"string"}],"name":"set","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"get","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}]

        var contract = web3.eth.contract(contractABI).at(contractAddress);

        // var result = contract.get();
        // console.log(result)

        var result1 = contract.set.sendTransaction(content,{from:accounts[0]});
        console.log(result1)

    }
}

module.exports = Validate_web3_module;


