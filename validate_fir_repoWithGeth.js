// 将 requestData1 上传 django，成功后将 requestData 2传入 geth，
// geth 请求 django 获得 requestData1，对比 requestData1 和 requestData2

const request = require('request');

var url = "http://127.0.0.1:8000/pushGitCotent/";
var requestData = "push git content newest qiubing";

request({
    url: url,
    method: "POST",
    json: true,
    headers: {
        "content-type": "application/json",
    },
    body: requestData
}, function(error, response, body) {
    if (body == "success") {
        console.log(body);
        var Validate_web3_module = require('./validate_web3_module');

        validate_web3_module = new Validate_web3_module();
        
        validate_web3_module.gethConnect(requestData);
    }
    else {
        console.log("error");
    }
}); 