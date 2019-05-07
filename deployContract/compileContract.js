// 自动编译、部署和调用智能合约
var solc = require('solc');

// 待编译的合约源码
var contractCode = "pragma solidity >=0.4.0 <0.6.0;" +
						"contract trustieTransaction {" +
    					"string public storedData = 'qiubing';" +
    					"function set(string memory x) payable public { storedData = x;}" +
						"function get() public view returns (string memory) { return storedData;}}";

var input = {
	language: 'Solidity',
	sources: {
		'trustieTransaction.sol': {
			content: contractCode
		}
	},
	settings: {
		outputSelection: {
			'*': {
				'*': [ '*' ]
			}
		}
	}
}

//编译合约源码
var output = JSON.parse(solc.compile(JSON.stringify(input)))

//获取编译后的 bytecode、abi 和 gas
var abi = JSON.stringify(output.contracts['trustieTransaction.sol'].trustieTransaction.abi);
// console.log("abi：", abi);
var bytecode = output.contracts['trustieTransaction.sol'].trustieTransaction.evm.bytecode.object;
// console.log("\n\nbytecode：", bytecode);
var gas = output.contracts['trustieTransaction.sol'].trustieTransaction.evm.gasEstimates.creation.totalCost;
// console.log("\n\ngas：", gas);



// 连接本地启动的 geth rpc 服务，连接成功之后进行如发起交易等操作
var Web3 = require('web3')

// 连接本地启动的 geth rpc 服务
if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));//默认http://localhost:8545
}

// 判断是否连接成功
if(!web3.isConnected()) {
    console.log("连接失败！！")
} else {
    console.log("\n连接成功！！")
}

var realGas = web3.eth.estimateGas({data:"0x" + bytecode});    //调用 estimateGas 方法估计合约部署所需的 gas 值
// console.log("\n\nrealGas:", realGas);

// 本地部署经过编译的合约
var trustietransactionContract = web3.eth.contract(JSON.parse(abi));
var trustietransaction = trustietransactionContract.new(
   {
     from: web3.eth.accounts[0], 
	 data: "0x" + bytecode, 
	 gas: realGas     //估计所需消耗的 gas 值
	//  gas: '4700000'  //修改源码，将 storedData 字符串初始化为 “qiubing”。编译源码获得的 gas 值为 `infinite`，导致出错，于是这儿固定一个 `4700000`值
	//  gas: String(parseInt(gas) * 10)  //由于 solc 编译出来的 gas 过低，会导致 gas 不足的问题，于是 * 10
   }, function (e, contract){
    // console.log(e, contract);
    if (typeof contract.address !== 'undefined') {
		 console.log('\nContract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash + "\n");
		
		//  检测合约是否部署成功
		 var contract = web3.eth.contract(JSON.parse(abi)).at(contract.address);
		 var result = contract.get();
		 console.log("\n" + result)
	}
 })

//另外一种部署合约的方法
// web3.eth.defaultAccount = web3.eth.coinbase;
// var code = "0x60806040526040805190810160405280600781526020017f71697562696e67000000000000000000000000000000000000000000000000008152506000908051906020019061004f929190610062565b5034801561005c57600080fd5b50610107565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100a357805160ff19168380011785556100d1565b828001600101855582156100d1579182015b828111156100d05782518255916020019190600101906100b5565b5b5090506100de91906100e2565b5090565b61010491905b808211156101005760008160009055506001016100e8565b5090565b90565b61045c806101166000396000f3fe608060405260043610610051576000357c0100000000000000000000000000000000000000000000000000000000900480632a1afcd9146100565780634ed3885e146100e65780636d4ce63c146101a1575b600080fd5b34801561006257600080fd5b5061006b610231565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156100ab578082015181840152602081019050610090565b50505050905090810190601f1680156100d85780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b61019f600480360360208110156100fc57600080fd5b810190808035906020019064010000000081111561011957600080fd5b82018360208201111561012b57600080fd5b8035906020019184600183028401116401000000008311171561014d57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192905050506102cf565b005b3480156101ad57600080fd5b506101b66102e9565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156101f65780820151818401526020810190506101db565b50505050905090810190601f1680156102235780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b60008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156102c75780601f1061029c576101008083540402835291602001916102c7565b820191906000526020600020905b8154815290600101906020018083116102aa57829003601f168201915b505050505081565b80600090805190602001906102e592919061038b565b5050565b606060008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156103815780601f1061035657610100808354040283529160200191610381565b820191906000526020600020905b81548152906001019060200180831161036457829003601f168201915b5050505050905090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106103cc57805160ff19168380011785556103fa565b828001600101855582156103fa579182015b828111156103f95782518255916020019190600101906103de565b5b509050610407919061040b565b5090565b61042d91905b80821115610429576000816000905550600101610411565b5090565b9056fea165627a7a72305820fbab90b3be1f41c38a9add58150716fc7cec06b36132830dc777cc129daf47c40029";
// web3.eth.sendTransaction({data: code, gas:500000}, function(err, transactionHash) {
//  if (!err)
//    console.log(transactionHash);
//    console.log(web3.eth.getTransactionReceipt(transactionHash))   //不是异步的方法，无法捕捉合约创建的挖矿事件，不能在合约上链之后再放回信息
// });