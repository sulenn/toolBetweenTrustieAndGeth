# README

- validate_web3：连接本地启动的 geth rpc 服务，连接成功之后模拟进行发起交易等操作

- validate_web3_module：本文件是 validate_web3.js 的模块化表示，用于其他文件引用

- validate_upGitCommit：本文件用于上传 git commit 信息

- validate_fir_repoWithGeth：第一次尝试模拟所有流程

- test：用于测试所有不确定或者不会的功能或者模块

- validate_2nd_repoWithGeth：第二次尝试模拟所有流程，通过 git show 获取本地 git commit 信息，组织上传至 django ，然后调用 geth rpc 传入 git coomit 信息，geth 内部从 django 获取信息，然后对比，输出相应结果

- validate_uploardGethInfo：将本次 push 内容组织成最终需要传入 geth 的格式。字段包括 ： 包括两次 hash 、当前所处分支 branch、用户名 username、项目名 projectname 和本次 push 的 diff 内容。两次 hash 包括获取本次 push 单位的最新 commit hash 和 最旧的 commit hash

- validate_uploardGethInfo_module：将 validate_uploardGethInfo 模块化，用于其他文件引用

- deployContract/compileContract：自动编译、部署和调用智能合约

- validate_third_repoWithGeth：第三次模拟所有流程，首先将本次需要 push 的内容组织成最终需要传入 geth 的格式 format1，然后捕捉 git push 操作返回的信息。如果 push 失败就终止，如果 push 成功，就将 format1 上传至 django，记为 format2（这一步骤用于模拟 trustie 需要提供的功能，就是通过若干信息获取本次 push 的 diff 内容），上传成功后，将 format1 传入 geth，geth 从 django 获取 format2，对比，输出结果