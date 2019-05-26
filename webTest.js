// var uploadPushInfo_module = require('./uploadPushInfo_module');

// console.log(uploadPushInfo_module())

var uploadPushInfo = new Object()
uploadPushInfo["shaList"] = ["c492c241e28b027efd4806f79ff6bc11c5b92979", "7a3437f18dfc2191dddf4255e42a9a39747918dc"]
uploadPushInfo["branch"] = "master"
uploadPushInfo["ownername"] = "Nigel"
uploadPushInfo["reponame"] = "trustietest"
uploadPushInfo["username"] = "Nigel"
uploadPushInfo["password"] = "Nigel.zhang007"

// var testInfo = "{"+
// 	'"shaList": ["c492c241e28b027efd4806f79ff6bc11c5b92979", "7a3437f18dfc2191dddf4255e42a9a39747918dc"],'+
// 	'"branch": "master",'+
// 	'"ownername": "Nigel",'+
// 	'"reponame": "trustietest",'+
// 	'"username": "Nigel",'+
// 	'"password": "Nigel.zhang007"'+
// "}"

// console.log(JSON.stringify(uploadPushInfo))
// console.log(uploadPushInfo)
// console.log(testInfo)

var url = "https://ucloudtest.trustie.net/api/v1/blockchains/getCommitInfo";
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
    console.log(body)
}); 