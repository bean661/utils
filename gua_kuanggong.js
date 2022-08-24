/*

*/
const $ = new Env("疯狂的矿工⚒️")

const jdCookieNode = $.isNode() ? require('./jdCookie.js') : ''
const notify = $.isNode() ? require('./sendNotify') : ''
//IOS等用户直接用NobyDa的jd cookie

let cookiesArr = [],
helpToolsArr = [],
helpCookiesArr = [];
const linkId = 'pTTvJeSTrpthgk9ASBVGsw'

if ($.isNode()) {
    Object.keys(jdCookieNode).forEach((item) => {
        cookiesArr.push(jdCookieNode[item])
    })
    if (process.env.JD_DEBUG && process.env.JD_DEBUG === 'false') console.log = () => {}
} else {
    cookiesArr = [$.getdata('CookieJD'), $.getdata('CookieJD2'), ...jsonParse($.getdata('CookiesJD') || '[]').map(item => item.cookie)].filter(item => !!item)
}

$.kuanggong_help_list = $.getdata("jd_kuanggong_help_list") || {}
$.kuanggong_help_list = $.toObj($.kuanggong_help_list,$.kuanggong_help_list)
if(typeof $.kuanggong_help_list != "object"){
    $.kuanggong_help_list = {}
}
$.kuanggong_help = {}
if($.kuanggong_help_list[$.time("MM_dd")]){
    $.kuanggong_help = $.kuanggong_help_list[$.time("MM_dd")]
}

sendFlag = false
allMessage = ''
message = ''
$.toStatus = false
$.hotFlag = false
$.errMsgPin = []
!(async () => {
    let token = '' // token
    let whitelist = '' // 白名单 用&隔开 pin值(填中文
    let blacklist = '' // 黑名单 用&隔开 pin值(填中文
    $.sendNotifyStatus = true // 发送消息 true 为发送 false 不发送 默认 true
    $.maxHelpNumber = 111 // 最大助力次数
    $.maxHelpErrCount = 5 // 连续"活动太火爆了，请稍后重试"次数超过此值则停止助力

    if (!cookiesArr[0]) {
        $.msg($.name, '【提示】请先获取cookie\n直接使用NobyDa的京东签到获取', 'https://bean.m.jd.com/', {
            'open-url': 'https://bean.m.jd.com/'
        })
        return
    }
    $.token = process.env.gua_kuanggong_token || token // token
    $.whitelist = process.env.gua_kuanggong_whitelist || whitelist // 白名单
    $.blacklist = process.env.gua_kuanggong_blacklist || blacklist // 黑名单
    $.sendNotifyStatus = process.env.gua_kuanggong_sendNotifyStatus || $.sendNotifyStatus + '' || true // 是否发送消息
    if(!$.token){
        console.log('请填写 gua_kuanggong_token')
        return
    }
    await toStatus()
    if(!$.toStatus){
        console.log('无法连接服务器，请检查网络')
        return
    }
    if($.openRed+"" == 'true'){
        $.openRed = true
    }else{
        $.openRed = false
    }
    console.log(`\n------ 变量设置 ------`)
    console.log(`${$.sendNotifyStatus+'' == 'true' ? '发送' : '不发送'}消息📜`)
    // ===========================================================================
    
    getWhitelist()
    getBlacklist()
    console.log("\n开始获取用于助力的账号列表")
    for (let i in cookiesArr) {
        // 将用于助力的账号加入列表
        let UserName = decodeURIComponent(cookiesArr[i].match(/pt_pin=([^; ]+)(?=;?)/) && cookiesArr[i].match(/pt_pin=([^; ]+)(?=;?)/)[1])
        helpToolsArr.push({id: i, UserName, assisted: false, cookie: cookiesArr[i]})
    }
    console.log(`用于助力的数目为 ${helpToolsArr.length}`)
    allMessage += `用于助力的数目为 ${helpToolsArr.length}\n`
    $.updateHelpData = false
    await run()
    // await $.wait(2000)
    
    if(allMessage){
        if($.errMsgPin.length > 0){
            let errmsg = `以下账号可能是火爆，请加入黑名单不然每次都消耗次数\ngua_kuanggong_blacklist="${$.errMsgPin.join('&')}"`
            allMessage += "\n"+errmsg

        }
        $.msg($.name, '', `${allMessage}`)
        if ($.isNode() && sendFlag && $.sendNotifyStatus+'' == 'true'){
            await notify.sendNotify(`${$.name}`, `${allMessage}`);
        }
    }
})()
    .catch((e) => console.log(e))
    .finally(() => $.done())


async function run() {
    try {
        for(let i = 0; i < helpCookiesArr.length; i++) {
            let UserName = decodeURIComponent(helpCookiesArr[i].match(/pt_pin=([^; ]+)(?=;?)/) && helpCookiesArr[i].match(/pt_pin=([^; ]+)(?=;?)/)[1])
            await getUA()
            let isLogin = await getLogin(UserName, helpCookiesArr[i])
            let help = ''
            if(isLogin){
                help = await getHelpInfoCk(UserName, helpCookiesArr[i])
            }
            if(help && help.inviteCode && help.inviter && !$.hotFlag){
                if(help.helpNumber < $.maxHelpNumber){
                    await helpProcess(help)
                }
                await getHelpInfoCk(UserName, helpCookiesArr[i], true)
                if(help.msg){
                    allMessage += `助力信息：${help.msg}\n\n`
                }else{
                    allMessage += `\n`
                }
            }
            if($.hotFlag || helpToolsArr.length <= 1){
                break
            }
        }
        
    } catch (e) {
        console.log(e)
    }
}

async function helpProcess(help) {
    while (helpToolsArr.length > 0) {
        let tool = helpToolsArr.pop()
        if($.kuanggong_help[tool.UserName]){
            console.log(Number(tool.id)+1,$.kuanggong_help[tool.UserName],'跳过')
            continue
        }
        
        if (help.UserName && tool.UserName == help.UserName) {
            helpToolsArr.unshift(tool)
            // console.log('跳过自己')
            if (helpToolsArr.length == 1) {
                break
            } else {
                continue
            }
        }
        // if(tool.id >= 12) continue
        let isLogin = await getLogin(tool.UserName, tool.cookie)
        if(isLogin){
            // console.log(Number(tool.id)+1,tool.UserName,'开始助力')
            await helpUser(help, tool)
        }else{
            console.log(Number(tool.id)+1,tool.UserName,'登录失败')
            continue
        }
        
        // await $.wait(10000) // 延迟
        if($.hotFlag){
            break
        }
        if (help.assist_full || help.helpCount+help.helpNumber >= $.maxHelpNumber) {
            console.log(`${help.UserName} 助力完成`)
            break
        }else if(help.assist_out || help.helpErrCount >= $.maxHelpErrCount){
            console.log(`退出执行`)
            $.hotFlag = true
            break
        }
    }
    if($.updateHelpData){
        $.kuanggong_help_list = {}
        $.kuanggong_help_list[$.time("MM_dd")] = $.kuanggong_help
        $.setdata($.kuanggong_help_list, 'jd_kuanggong_help_list')
    }
}
async function helpUser(help, tool) {
    try{
        var num = ''
        let log = ''
        let res = ''
        let h5st_res = ''
        let timestamp = Date.now()
        const body_in = { "linkId": linkId, "inviter": help.inviter, "inviteCode": help.inviteCode };
        const h5st_body = {
            appid: 'activities_platform',
            body: $.toStr(body_in, body_in),
            client: 'ios',
            clientVersion: '3.9.0',
            functionId: "happyDigHelp",
            t: timestamp.toString()
        }
        h5st_res = await getLog(h5st_body, tool.UserName)
        if(h5st_res && typeof h5st_res == 'object' && h5st_res.code == 200 && h5st_res.data && h5st_res.data.h5st){
            res = h5st_res.data
            // console.log(res)
        }
        if(!res){
            console.log('获取不到算法')
            $.hotFlag = true
            return
        }
        if(res.ua){
          $.UA = res.ua
        }
        h5st = res.h5st || ''
        let ck = tool.cookie
        await requestApi('happyDigHelp', ck, body_in, timestamp.toString(), h5st).then(async function (data) {
            // console.log(data)
            let desc = data.success && "助力成功" || data.errMsg || ""
            if (desc) {
                if (/助力成功/.test(desc)) {
                    await $.wait(1000)
                    $.kuanggong_help[tool.UserName] = "已助力「"+help.UserName+"」"
                    help.helpCount += 1
                    tool.assisted = true
                    $.updateHelpData = true
                    help.helpErrCount = 0
                } else if (/参与者参与次数达到上限/.test(desc)) {
                    $.kuanggong_help[tool.UserName] = "已助力他人"
                    tool.assisted = true
                    $.updateHelpData = true
                    help.helpErrCount = 0
                } else if (/已经邀请过/.test(desc)) {
                    $.kuanggong_help[tool.UserName] = "已助力「"+help.UserName+"」"
                    tool.assisted = true
                    $.updateHelpData = true
                    help.helpErrCount = 0
                } else if (/^活动太火爆了，请稍后重试$/.test(desc)) {
                    help.helpErrCount++
                    desc = '账号火爆或者算法失效'
                    $.errMsgPin.push(tool.UserName)
                    if(help.helpErrCount >= $.maxHelpErrCount){
                        help.msg = desc
                        $.errMsgPin = []
                    }
                } else {
                    if(data.rtn_code != 0) console.log(data)
                    // success
                    // 活动太火爆了，请稍后重试
                    // 已经邀请过
                    // 参与者参与次数达到上限
                    tool.assisted = true
                }
            } else {
                // undefined
                tool.assisted = true
            }
            console.log(`${Number(tool.id)+1}->${(help.UserName).substring(0,5)}`, desc)
        })
    }catch(e){
        console.log(e)
    }
}

async function getHelpInfoCk(UserName, cookie, flag = false) {
    try{
        let helpNumber = 0
        if(flag == true){
            sendFlag = true
            let helpData = await requestApi('happyDigHelpList', cookie, {"pageNum":1,"pageSize":50,"linkId": linkId});
            if(helpData.success && helpData.data && helpData.data.helpList){
                // helpNumber = helpData.data.personNum || 0
                helpNumber = helpData.data.helpList.totalNum || 0
                console.log(`\n${UserName} 已助力 ${helpNumber}/${$.maxHelpNumber} 次`)
                allMessage += `${UserName} 总计获得助力 ${helpNumber}/${$.maxHelpNumber}\n`
            }
        }else{
            console.log(`\n开始请求 ${UserName} 账号的信息`)
            let data = ''
            let assist_out = false
            let inviteCode = ''
            let inviter = ''
            let msg = ''
            data = await requestApi('happyDigHome', cookie, { "linkId": linkId, "inviter": "", "inviteCode": "" });
            if(data && data.data){
                inviteCode = data.data.inviteCode
                inviter = data.data.markedPin
            }
            if(inviteCode && inviter){
                console.log(`邀请码 ${inviteCode}`)
                let roundList = data.data.roundList
                let helpData = await requestApi('happyDigHelpList', cookie, {"pageNum":1,"pageSize":50,"linkId": linkId});
                if(helpData.success && helpData.data && helpData.data.helpList){
                    // helpNumber = helpData.data.personNum || 0
                    helpNumber = helpData.data.helpList.totalNum || 0
                    console.log(`${UserName} 已助力 ${helpNumber}/${$.maxHelpNumber} 次\n`)
                    if(helpNumber >= $.maxHelpNumber){
                        msg = '已助力满'
                    }
                }
                for(let i=0;i<roundList.length;i++){
                    if(roundList[2].state == 1){
                        console.log("今日挖宝已通关")
                        assist_out = true
                        break
                    }
                    if(roundList[i].state == 2){
                        console.log("已经领取今日挖宝奖励")
                        assist_out = true
                        break
                    }
                }
            }
            return {
                inviteCode: inviteCode,
                inviter: inviter,
                assist_full: false,
                assist_out: assist_out,
                UserName,
                cookie: cookie,
                msg,
                helpCount: 0,
                helpNumber: helpNumber
            }
        }
    }catch(e){
        console.log(e)
    }
}

async function requestApi(functionId, cookie, body = {}, t = Date.now(), h5st = '') {
    try{
        let ck = cookie
        let client = "H5"
        $.clientVersion = ""
        if(functionId == 'happyDigHelp'){
            // $.clientVersion = $.UA.split(';')[2]
            $.clientVersion = "3.9.0"
            client = "ios"
        }
        return new Promise(async resolve => {
            let options = {
                url: `https://api.m.jd.com/?functionId=${functionId}&body=${encodeURIComponent(JSON.stringify(body))}&t=${t}&appid=activities_platform&client=${client}&clientVersion=${$.clientVersion ? $.clientVersion : '1.2.0'}${h5st ? '&h5st=' + h5st : ''}`,
                headers: {
                    "Accept": "application/json, text/plain, */*",
                    "Accept-Language": "zh-CN,zh-Hans;q=0.9",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Cookie": ck,
                    "origin": "https://bnzf.jd.com",
                    "Referer": "https://bnzf.jd.com/",
                    "User-Agent": $.UA,
                }
            }
            $.get(options, async (err, resp, data) => {
                try {
                    if (err) {
                        console.log(`${$.toStr(err)}`)
                        console.log(`${$.name} jinlihongbao API请求失败，请检查网路重试`)
                    } else {
                        data = $.toObj(data,data)
                    }
                } catch (e) {
                    console.log(e)
                } finally {
                    resolve(data)
                }
            });
        })
    }catch(e){
        console.log(e)
    }
}

async function getLogin(UserName, ck) {
    return new Promise(resolve => {
        let options = {
            url: `https://me-api.jd.com/user_new/info/GetJDUserInfoUnion`,
            headers: {
                "Accept": "*/*",
                "Connection": "keep-alive",
                "Accept-Language": "zh-cn",
                "Accept-Encoding": "gzip, deflate, br",
                "Cookie": ck,
                "Referer": "https://home.m.jd.com/myJd/newhome.action?sceneval=2&ufc=&",
                "User-Agent": "jdapp;iPhone;9.4.4;14.3;network/4g;Mozilla/5.0 (iPhone; CPU iPhone OS 14_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1",
            },
            timeout:10000
        }
        let msg = true
        $.get(options, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} ck有效 API请求失败，请检查网路重试`)
                } else {
                    let res = $.toObj(data, data)
                    if (res.retcode+"" === "13" || res.retcode+"" === "1001") {
                        msg = false
                        console.log(`账号「${UserName}」 Cookie失效`)
                    }else{
                        msg = true
                    }
                }
            } catch (e) {
                console.log(e)
            } finally {
                resolve(msg);
            }
        })
    })
}
//log算法
async function getLog(body, pin) {
    return new Promise(resolve => {
        let options = {
            url: `https://jd.smiek.tk/jdh5st`,
            body: JSON.stringify({"appid": "8dd95", "pin": pin,"body": body,"token": $.token}),
            headers: {
                "Content-Type": "application/json",
            },
            timeout: 30000
        }
        let msg = ''
        $.post(options, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${JSON.stringify(err)}`)
                    console.log(`${$.name} 算法 API请求失败，请检查网路重试`)
                } else {
                    data = $.toObj(data,data);
                    if(data && data.code && data.code == 200){
                        msg = data
                        if (data.msg && data.msg != "success") console.log(data.msg)
                    }
                }
            } catch (e) {
                console.log(e)
            } finally {
                resolve(msg);
            }
        })
    })
}

function toStatus() {
    return new Promise(resolve => {
        let options = {
            url: `https://jd.smiek.tk/to_status`,
            timeout: 30000
        }
        $.get(options, async (err, resp, data) => {
            try {
                if (err) {
                    console.log(`${$.toStr(err)}`)
                    console.log(`${$.name} 连接服务器 API请求失败，请检查网路重试`)
                } else {
                    let res = $.toObj(data,data)
                    if(res && typeof res == 'object'){
                        if(res.msg === "success"){
                            $.toStatus = true
                        }
                    }
                }
            } catch (e) {
                console.log(e)
            } finally {
                resolve()
            }
        })
    })
}

/**
 * 黑名单
 */
 function getBlacklist(){
    if($.blacklist == '') return
    console.log('------- 黑名单 -------')
    const result = Array.from(new Set($.blacklist.split('&'))) // 数组去重
    console.log(`${result.join('\n')}`)
    let blacklistArr = result
    let arr = []
    let g = false
    for (let i = 0; i < cookiesArr.length; i++) {
        let s = decodeURIComponent((cookiesArr[i].match(/pt_pin=([^; ]+)(?=;?)/) && cookiesArr[i].match(/pt_pin=([^; ]+)(?=;?)/)[1]) || '')
        if(!s) break
        let f = false
        for(let n of blacklistArr){
            if(n && n == s){
                f = true
                break
            }
        }
        if(!f){
            g = true
            arr.splice(i,-1,cookiesArr[i])
        }
    }
    if(g) cookiesArr = arr
}
// 数组置顶移动
function toFirst(arr, index){
    if (index != 0) {
        arr.unshift(arr.splice(index, 1)[0])
    }
}
/**
 * 白名单
 */
function getWhitelist(){
    if($.whitelist == ''){
        helpCookiesArr = $.toObj($.toStr(cookiesArr,cookiesArr))
        return
    }
    console.log('------- 白名单 -------')
    const result = Array.from(new Set($.whitelist.split('&'))) // 数组去重
    console.log(`${result.join('\n')}`)
    let arr = []
    let whitelistArr = result
    for(let i in cookiesArr){
        let s = decodeURIComponent((cookiesArr[i].match(/pt_pin=([^; ]+)(?=;?)/) && cookiesArr[i].match(/pt_pin=([^; ]+)(?=;?)/)[1]) || '')
        if(whitelistArr.includes(s)){
            arr.push(cookiesArr[i])
        }
    }
    helpCookiesArr = arr
    if(whitelistArr.length > 1){
        for(let n in whitelistArr){
            let m = whitelistArr[whitelistArr.length - 1 - n]
            if(!m) continue
            for(let i in helpCookiesArr){
                let s = decodeURIComponent(helpCookiesArr[i].match(/pt_pin=([^; ]+)(?=;?)/) && helpCookiesArr[i].match(/pt_pin=([^; ]+)(?=;?)/)[1])
                if(m == s){
                    toFirst(helpCookiesArr, i)
                }
            }
        }
    }
}
async function getUA() {
    $.UA = `jdapp;iPhone;10.1.4;13.1.2;${randomString(40)};network/wifi;model/iPhone8,1;addressid/;appBuild/167814;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1`
}
function randomString(e) {
    e = e || 32
    let t = 'abcdef0123456789', a = t.length, n = ''
    for (i = 0; i < e; i++)
        n += t.charAt(Math.floor(Math.random() * a))
    return n
}

function jsonParse(str) {
    if (typeof str == 'string') {
        try {
            return JSON.parse(str)
        } catch (e) {
            console.log(e)
            $.msg($.name, '', '请勿随意在BoxJs输入框修改内容\n建议通过脚本去获取cookie')
            return []
        }
    }
}

// prettier-ignore
function Env(t,e){'undefined'!=typeof process&&JSON.stringify(process.env).indexOf('GITHUB')>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e='GET'){t='string'==typeof t?{url:t}:t;let s=this.get;return'POST'===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,'POST')}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile='box.dat',this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator='\n',this.startTime=(new Date).getTime(),Object.assign(this,e),this.log('',`🔔${this.name}, 开始!`)}isNode(){return'undefined'!=typeof module&&!!module.exports}isQuanX(){return'undefined'!=typeof $task}isSurge(){return'undefined'!=typeof $httpClient&&'undefined'==typeof $loon}isLoon(){return'undefined'!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata('@chavy_boxjs_userCfgs.httpapi');i=i?i.replace(/\n/g,'').trim():i;let r=this.getdata('@chavy_boxjs_userCfgs.httpapi_timeout');r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split('@'),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:'cron',timeout:r},headers:{'X-Key':o,Accept:'*/*'}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require('fs'),this.path=this.path?this.path:require('path');const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require('fs'),this.path=this.path?this.path:require('path');const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,'.$1').split('.');let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):'';if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,''):e}catch(t){e=''}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?'null'===o?null:o||'{}':'{}';try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require('got'),this.cktough=this.cktough?this.cktough:require('tough-cookie'),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers['Content-Type'],delete t.headers['Content-Length']),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{'X-Surge-Skip-Scripting':!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on('redirect',(t,e)=>{try{if(t.headers['set-cookie']){const s=t.headers['set-cookie'].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers['Content-Type']&&(t.headers['Content-Type']='application/x-www-form-urlencoded'),t.headers&&delete t.headers['Content-Length'],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{'X-Surge-Skip-Scripting':!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method='POST',this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={'M+':s.getMonth()+1,'d+':s.getDate(),'H+':s.getHours(),'m+':s.getMinutes(),'s+':s.getSeconds(),'q+':Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+'').substr(4-RegExp.$1.length)));for(let e in i)new RegExp('('+e+')').test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:('00'+i[e]).substr((''+i[e]).length)));return t}msg(e=t,s='',i='',r){const o=t=>{if(!t)return t;if('string'==typeof t)return this.isLoon()?t:this.isQuanX()?{'open-url':t}:this.isSurge()?{url:t}:void 0;if('object'==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t['open-url'],s=t.mediaUrl||t['media-url'];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t['open-url']||t.url||t.openUrl,s=t['media-url']||t.mediaUrl;return{'open-url':e,'media-url':s}}if(this.isSurge()){let e=t.url||t.openUrl||t['open-url'];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=['','==============📣系统通知📣=============='];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join('\n')),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log('',`❗️${this.name}, 错误!`,t.stack):this.log('',`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log('',`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}

