#!/usr/bin/env bash
#

# 青龙一键安装脚本 简洁版
TIME() {
[[ -z "$1" ]] && {
	echo -ne " "
} || {
     case $1 in
	r) export Color="\e[31;1m";;
	g) export Color="\e[32;1m";;
	b) export Color="\e[34;1m";;
	y) export Color="\e[33;1m";;
	z) export Color="\e[35;1m";;
	l) export Color="\e[36;1m";;
      esac
	[[ $# -lt 2 ]] && echo -e "\e[36m\e[0m ${1}" || {
		echo -e "\e[36m\e[0m ${Color}${2}\e[0m"
	 }
      }
}
echo
echo
echo
TIME l "安装依赖..."
echo
TIME y "安装依赖需要时间，请耐心等待!"
echo
sleep 3
echo
echo
npm config set registry https://registry.npm.taobao.org
cd /ql
TIME l "安装依赖npm..."
npm install -g npm
cd /ql
TIME l "安装依赖png-js..."
npm install -g png-js
cd /ql
TIME l "安装依赖date-fns..."
npm install -g date-fns
cd /ql
TIME l "安装依赖axios..."
npm install -g axios
cd /ql
TIME l "安装依赖crypto-js..."
npm install -g crypto-js
cd /ql
TIME l "安装依赖md5..."
npm install -g md5
cd /ql
TIME l "安装依赖ts-md5..."
npm install -g ts-md5
cd /ql
TIME l "安装依赖tslib..."
npm install -g tslib
cd /ql
TIME l "安装依赖@types/node..."
npm install -g @types/node
cd /ql
TIME l "安装依赖requests..."
npm install -g requests
cd /ql
TIME l "安装依赖tough-cookie..."
npm install -g tough-cookie
cd /ql
TIME l "安装依赖jsdom..."
npm install -g jsdom
cd /ql
TIME l "安装依赖download..."
npm install -g download
cd /ql
TIME l "安装依赖tunnel..."
npm install -g tunnel
cd /ql
TIME l "安装依赖fs..."
npm install -g fs
cd /ql
TIME l "安装依赖ws..."
npm install -g ws
cd /ql
TIME l "安装依赖global-agent..."
npm install -g global-agent
cd /ql
TIME l "安装依赖bootstrap..."
npm install -g bootstrap
cd /ql
TIME l "安装依赖form-data..."
npm install -g form-data
cd /ql
TIME l "安装依赖requests..."
pip3 install requests
cd /ql
TIME l "安装依赖PyExecJS..."
pip3 install PyExecJS
cd /ql
TIME l "安装依赖ds..."
pip3 install ds
cd /ql
TIME l "安装依赖moment..."
npm install -g moment
cd /ql
TIME l "安装依赖js-base64..."
npm install -g js-base64
cd /ql
echo
TIME g "依赖安装完毕..."
echo
exit 0
