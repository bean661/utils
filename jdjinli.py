# -*- coding: UTF-8 -*-
# @File  : 京东锦鲤红包.py
# @Date  :  2021/08/20
'''
cron: 5 0 * * *
new Env('安静的锦鲤');
入口: 京东首页>领券>锦鲤红包
变量: JD_COOKIE, kois, Rabbit_Url
export JD_COOKIE="第1个cookie&第2个cookie"
export kois=" 第1个cookie的pin & 第2个cookie的pin "
环境变量kois中填入需要助力的pt_pin，有多个请用 '@'或'&'或空格 符号连接,不填默认全部账号内部随机助力
脚本内或环境变量填写，优先环境变量
'''
import json
import math
import random
import re
import time
# pip3 install requests
import requests
import logging  # 用于日志输出
import os
#starttime = 1652198401000  #https://tool.lu/timestamp/

if "LOG_DEBUG" in os.environ:  # 判断调试模式变量
    logging.basicConfig(level=logging.DEBUG, format='%(message)s')  # 设置日志为 Debug等级输出
    logger = logging.getLogger(__name__)  # 主模块
    logger.debug("\nDEBUG模式开启!\n")  # 消息输出
else:  # 判断分支
    logging.basicConfig(level=logging.INFO, format='%(message)s')  # Info级日志
    logger = logging.getLogger(__name__)  # 主模块
# 获取pin
cookie_findall = re.compile(r'pt_pin=(.+?);')

def get_pin(cookie):
    try:
        return cookie_findall.findall(cookie)[0]
    except:
        logger.info('ck格式不正确，请检查')
# 要助力的ck
mycookies = []

#工具人ck
cookies =[]

atime = 0
tag = 0
global log_list

log_list = []

def get_log_list(num):
    for i in range(num):
        if i%20 == 0 :
            logger.info(f'{i}条log获取完毕')
        url = f'http://115.227.17.82:5701/log'
        res = requests.get(url=url).json()
        log_list.append(res)

def randomString(e):
    t = "0123456789abcdef"
    a = len(t)
    n = ""
    for i in range(e):
        n = n + t[math.floor(random.random() * a)]
    return n


def Ua():
    UA = f'jdltapp;iPhone;3.1.0;{math.ceil(random.random() * 4 + 10)}.{math.ceil(random.random() * 4)};{randomString(40)}'

    return UA


def res_post(functionId, cookie, body, ua):
    url = f'https://api.m.jd.com/client.action/api?appid=jinlihongbao&functionId={functionId}&loginType=2&client=jinlihongbao&clientVersion=10.1.4&osVersion=-1'
    headers = {
        "Cookie": cookie,
        "origin": "https://h5.m.jd.com",
        "referer": "https://h5.m.jd.com/babelDiy/Zeus/2NUvze9e1uWf4amBhe1AV6ynmSuH/index.html",
        'Content-Type': 'application/x-www-form-urlencoded',
        "X-Requested-With": "com.jingdong.app.mall",
        "User-Agent": ua
    }
    data = f"body={json.dumps(body)}"
    try:
        res = requests.post(url=url, headers=headers, data=data).json()
        return res
    except:
        return -1


def launch_id(mycookie):
    user = log_list[random.randint(0, len(log_list) - 1)]
    body = {"followShop": 1,
            "random": user["random"],
            "log": user["log"],
            "sceneid": "JLHBhPageh5"
            }
    res = res_post('h5launch', mycookie, body, Ua())
    if res != -1:
        if res['rtn_code'] == 403:
            logger.info('h5launch,log失效，获取redPacketId失败')
            return -1
        elif res['rtn_code'] == 0:
            if res['data']['result']['status'] == 1:
                logger.info('号黑了，锦鲤活动打不开了')
                return -1
            elif res['data']['result']['status'] == 2:
                redPacketId = get_id(mycookie)
                if redPacketId != -1 and redPacketId != 1:
                    return redPacketId
                else:
                    return -1
            else:
                redPacketId = res['data']['result']['redPacketId']
                return redPacketId
    else:
        logger.info('h5launch,请求失败，获取redPacketId失败')
        return -1


def get_id(mycookie):
    res = res_post('h5activityIndex', mycookie, {"isjdapp": 1}, Ua())
    if res != -1:
        if res['rtn_code'] == 0:
            if res['data']['biz_code'] == 20002:
                logger.info("已达拆红包数量限制")
                return 1
            else:
                redPacketId = res['data']['result']['redpacketInfo']['id']
                return redPacketId
        else:
            logger.info('锦鲤活动未开启')
            return -1
    else:
        logger.info('锦鲤活动未开启')
        return -1


def help1(redPacketId, pin):
    global tag
    for i in range(tag, len(cookies)):
        user = log_list[i]
        body = {"redPacketId": redPacketId, "followShop": 0,
                "random": user["random"],
                "log": user["log"],
                "sceneid": "JLHBhPageh5"
                }
        res = res_post('jinli_h5assist', cookies[i], body, Ua())
        # print(res)
        if res != -1:
            if res['rtn_code'] == 0:
                desc = res['data']['result']['statusDesc']
                logger.info(f'账号{i}助力{pin}：{desc}')
                if 'TA的助力已满' in desc:
                    tag = i
                    return
            elif res['rtn_code'] == 403:
                logger.info(f'账号{i}助力{pin}：助力失败，log失效')
    tag = len(cookies)


def reward(mycookie):
    sum = 0
    i = 0
    while i<20:
        i = i +1
        user = log_list[random.randint(0, len(log_list) - 1)]
        body = {
            "random": user["random"],
            "log": user["log"],
            "sceneid": "JLHBhPageh5"
        }
        ua = 'MQQBrowser/26 Mozilla/5.0 (Linux; U; Android 2.3.7; zh-cn; MB200 Build/GRJ22; CyanogenMod-7) AppleWebKit/533.1 (KHTML, like Gecko) Version/4.0 Mobile Safari/533.1'
        res = res_post('h5receiveRedpacketAll', mycookie, body, ua)
        logger.info(res)
        if res != -1:
            if res['rtn_code'] == 0 and res['data']['biz_code'] == 0:
                logger.info(f"{res['data']['biz_msg']}：{res['data']['result']['discount']}元")
                sum = sum + float(res['data']['result']['discount'])
                time.sleep(1)
            elif res['rtn_code'] == 0 and res['data']['biz_code'] == 10:
                logger.info(res['data']['biz_msg'])
                break
            elif res['rtn_code'] == 403:
                logger.info(f'reward, log失效')
                break
        else:
            continue
    logger.info(f'共获得{sum}元红包,以具体查看为准')

# 读取环境变量
def get_env(env):
    try:
        if env in os.environ:
            a = os.environ[env]
        else:
            a = ""
    except:
        a = ''
    return a


if __name__ == '__main__':
    logger.info('🔔安静的锦鲤，开始！\n')
    cookie_list = os.environ.get("JD_COOKIE", "").split("&") #所有cookie
    if not cookie_list:
        logger.info("没有找到ck")
        exit()
    logger.info(f'====================共{len(cookie_list)}京东个账号Cookie=========\n')

    debug_pin = get_env('kois')
    if debug_pin:
        cookie_list_pin = [cookie for cookie in cookie_list if get_pin(cookie) in debug_pin]
    else:
        cookie_list_pin = cookie_list #要助力的pin
    logger.info(f'开始获取{int(float(len(cookie_list)*1.2))}条log...')
    get_log_list(int(float(len(cookie_list)*1.2)))
    mycookies = cookie_list_pin
    cookies = cookie_list
    if len(log_list) != 0:
        logger.info(f'{len(log_list)}条log获取完毕')
        logger.info('*******************开始助力*******************\n')
        for mycookie in mycookies:
            redPacketId = launch_id(mycookie)
            if redPacketId != -1:
                ex = 'pt_pin=(.*);'
                try:
                    pin = re.findall(ex, mycookie)[0]
                except:
                    pin = ''
                logger.info(f"redPacketId：{redPacketId}")
                help1(redPacketId, pin)
        for mycookie in mycookies:
            logger.info("开始拆红包")
            reward(mycookie)
    else:
        logger.info('暂无可用log')
