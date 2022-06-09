import json
import math
import random
import threading
import time
import datetime
# pip3 install requests
import requests
import os
'''
#9.9秒杀
10-2 7/10/16/20
key=99E9BFB397BB9E081C3D211644F4D63B80C6629BF10290DBE13C6C11E1DF025FE3774FB37875ED1B720ABB1A6023D3B4_bingo,roleId=3FE9EECAAA41B666E4FFAF79F20E21129412DAD4469A00C14E234FFC59430A3B03E9CF1047D2889AA3D9F3A3AC9845F06DD6177A62EF3A4A570EC8E5C227CE0E4892C7A1A2B984AB9B022706661B4828BA6ED364141E21A7499FE93EB659B4824F445AC4EAB78AF162CA2B7289EDF2DB3F8144DBC4D261FB9826BF7F88790CF94A2ADC829BEE300EB9E27DAD459EA19FE22F265CEE7EE1E0E926357D049A9C9A01413BFC73541208CCC10919AE1DD223_bingo,strengthenKey=4C8818C1732D1A7B9733D611F28BD8B57923ADE220C9B60370F65B533E02E0F8F7A8DB4211A7817EF606DDAD4FA3E67F_bingo
19-5 0/10/18/22
key=E72F2D6FD3B257AE6EAEEF81FEF44D9C3EFB9B5E0F0E11C4562D68BDA7BA69BF5C4E716FB9BBD7B1678E83551EA3A72E_bingo,roleId=3FE9EECAAA41B666E4FFAF79F20E21120520F1A5AFE5C9E8D77BD263F6726B9E3576C6C5571777201DA90CF204F2336AB211D7BA6D0E7255BAFF71BCC9ED7782F4BB5E97DDCA47183788BB228E79E0C34E78DF222617DBB46340CDD576D690369CEEB51EF2CC0DA24F159511AE4AD2EEF70B78A6287ED7D00634575733C0075CBA0ADD06A277A0DF84645DB74FF0C01DCED7EA5DCB5577E762C4029AD5172CE71951D9E209BD08E2DA0A722CF6411B58_bingo,strengthenKey=4C8818C1732D1A7B9733D611F28BD8B57923ADE220C9B60370F65B533E02E0F8E6A0FEFA632101D3D5409FE4F92580CF_bingo
#夏香节
5-2 9/12/18/22
key=BCE52145EC2FBDDE212899674C8CA1C12A3A133EEA5D70CB9D998AF6B3F4648C22AC20BFEB2B797D1292322C150A0DC2_bingo,roleId=3FE9EECAAA41B666E4FFAF79F20E211241BC51D1C03478640D4EF32FA22832B7C93468B462C8C368D7E33CA18F54891E8F724E3FA38C39E3AFF697601E6A963307103764559652634BA6CCE6381F1828DFFEA73CB1112D3B93F9141F71E772892890D12BAB366ADD8CB74520EFA0FDB0B46FCC528187867EF0EAB793451D2FFE1C4D4F8720CBC88786C9BFFE59122E55363C69842BD1673DD4A73213F87E6D0D714352B5F3FE5B0BCF0235EB9CB43C5C_bingo,strengthenKey=4C8818C1732D1A7B9733D611F28BD8B57923ADE220C9B60370F65B533E02E0F82F810FA48DCD7A31F76CAE44623F2470_bingo
15-8 9/12/15/18/20
key=DDF1B71D0AF91A8547973CE5362A890F18C8E73AAC10BA9179CE5D2D745E95AC9AC125029761397270C947AC9F5E11CE_bingo,roleId=3FE9EECAAA41B666E4FFAF79F20E2112EC5A32B22271AD04523B3C66AE5807591E0DB913F0F40F86F97AAA49D12C568D47FEEE50418AD25C6B23D81C476A40CB07BCCE74C4EDAD2E0D1BCF515F06DECE783A16EA99A0959CAC63BDF9BD9A9037450AB25EE84616EF9E65486A529F6690F93EA6903FF6754FD22FD39B43821B0041487D3996E0CF72C487DD107C4D0F13EA507700B35B495859747F1E700186EA385A46F6ED361FE40B11663D21263EB1_bingo,strengthenKey=4C8818C1732D1A7B9733D611F28BD8B57923ADE220C9B60370F65B533E02E0F823A5E9624E2105020B0FB67EE3BFC671_bingo
19-5 0/10/18/20
key=CB80DDB21929DB2DB9849A60F929CCB99B3BF927A75E71562ADB7CEC61846545338F6E4517C1973762A51B43E2C88518_bingo,roleId=3FE9EECAAA41B666E4FFAF79F20E21120520F1A5AFE5C9E8D77BD263F6726B9E5E06C7051840093D00E358BF32A400ED69C31825CC6E0B4002396D97E04CBE9B95BD50D3490D09DC4746C78A5C257455D11BB1F359F00BC8367524EC3D44EDDA221AD90D25402C0AED4BCE9EFBC506428188DEBB9A3B93AA72D7CF3C822077B7D4A2456215E02A8A3DA720FF426525BC40D44921C13A1FE2CDFEDBB98CF065955FEED95F578D1A7D0C8ED8051EBD5E53_bingo,strengthenKey=4C8818C1732D1A7B9733D611F28BD8B57923ADE220C9B60370F65B533E02E0F8E6A0FEFA632101D3D5409FE4F92580CF_bingo
'''


# 可以改的参数
if 'quan_key' in os.environ:
    args=os.environ["quan_key"]
else:
    args = 'key=DDF1B71D0AF91A8547973CE5362A890F18C8E73AAC10BA9179CE5D2D745E95AC9AC125029761397270C947AC9F5E11CE_bingo,roleId=3FE9EECAAA41B666E4FFAF79F20E2112EC5A32B22271AD04523B3C66AE5807591E0DB913F0F40F86F97AAA49D12C568D47FEEE50418AD25C6B23D81C476A40CB07BCCE74C4EDAD2E0D1BCF515F06DECE783A16EA99A0959CAC63BDF9BD9A9037450AB25EE84616EF9E65486A529F6690F93EA6903FF6754FD22FD39B43821B0041487D3996E0CF72C487DD107C4D0F13EA507700B35B495859747F1E700186EA385A46F6ED361FE40B11663D21263EB1_bingo,strengthenKey=4C8818C1732D1A7B9733D611F28BD8B57923ADE220C9B60370F65B533E02E0F823A5E9624E2105020B0FB67EE3BFC671_bingo'

    
print("key:"+args)
cookies =[ '' ]
cookies =os.environ["JD_COOKIE"].split('&')
cookies=[cookies[0],cookies[1],cookies[2],cookies[3],cookies[4],cookies[5]]
#starttime = 1652428798000 # 开始时间戳 13位 网址：https://tool.lu/timestamp/   5/8 5/7 23:59:58

range_n = int(len(cookies)) *10  # 线程个数
range_sleep = 0.04  # 间隔时间

# 没用的参数
log_list = []
atime = 0


#获取下一个时间戳
def get_next_timeStamp():
    # 当前时间
    now_time = datetime.datetime.now()
    # 把根据当前时间计算下一个整点时间戳
    integer_time = (now_time + datetime.timedelta(hours=1)).strftime("%Y-%m-%d %H:00:00")
    time_array = time.strptime(integer_time, "%Y-%m-%d %H:%M:%S")
    time_stamp = int(time.mktime(time_array))
    return time_stamp


def get_log_list(num):
    global log_list
    try:
        for i in range(num):
            url = f'http://log.creamk.eu.org/log'
            res = requests.get(url=url).json()
            log_list.append(res)
    except:
        log_list = []
    return log_list


def randomString(e):
    t = "0123456789abcdef"
    a = len(t)
    n = ""
    for i in range(e):
        n = n + t[math.floor(random.random() * a)]
    return n


def Ua():
    UA = f'jdapp;iPhone;10.2.0;13.1.2;{randomString(40)};M/5.0;network/wifi;ADID/;model/iPhone8,1;addressid/2308460611;appBuild/167853;jdSupportDarkMode/0;Mozilla/5.0 (iPhone; CPU iPhone OS 13_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;supportJDSHWK/1;'
    return UA


def qiang_15_8(cookie, i):
    url = 'https://api.m.jd.com/client.action?functionId=lite_newBabelAwardCollection&client=wh5'
    headers = {
        "Accept": "*/*",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-cn",
        "Connection": "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded",
        'origin': 'https://pro.m.jd.com',
        "Referer": "https://pro.m.jd.com/jdlite/active/3H885vA4sQj6ctYzzPVix4iiYN2P/index.html?lng=106.476617&lat=29.502674&sid=fbc43764317f538b90e0f9ab43c8285w&un_area=4_50952_106_0",
        "Cookie": cookie,
        "User-Agent": Ua()
    }

    body = json.dumps({"activityId": "vN4YuYXS1mPse7yeVPRq4TNvCMR",
                       "scene": "1",
                       "args": args,
                       "log": log_list[i]['log'],
                       "random": log_list[i]['random']}
                      )
    data = f"body={body}"
    try:
        res = requests.post(url=url, headers=headers, data=data).json()
        if res['code'] == '0':
            print(res['subCodeMsg'])
        else:
            print(res['errmsg'])
    except:
        pass

def jdtime():
    url = 'http://api.m.jd.com/client.action?functionId=queryMaterialProducts&client=wh5'
    headers = {
        "user-agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36'
    }

    try:
        res = requests.get(url=url, headers=headers, timeout=1).json()
        return int(res['currentTime2'])
    except:
        return 0


if __name__ == '__main__':
    print('极速版抢券准备...')

    print('开始获取log...')
    get_log_list(range_n)
    print('log获取完毕!\n')

    print('开始配置线程...')
    tasks = list()
    if len(log_list) != 0:
        print(f'{len(log_list)}条log获取完毕') 
        j=0
        for i in range(int(range_n)):
            tasks.append(threading.Thread(target=qiang_15_8, args=(cookies[j], i)))
            j=j+1
            j=j%len(cookies)
    else:
        print('暂无可用log')
    print('线程配置完毕!\n')

    print('开始等待...')
    starttime =get_next_timeStamp()*1000-2000
    while True:
        if starttime - int(time.time()*1000) <= 1000:
            break
        else:
            if int(time.time()*1000) - atime >= 30000:
                atime = int(time.time()*1000)
                print(f'还差{int((starttime - int(time.time()*1000)) / 1000)}秒!')   


    print('开始喽!!')
    while True:
        if jdtime() >= starttime:
                for task in tasks:
                    task.start()
                    time.sleep(range_sleep)
                for task in tasks:
                    task.join()
                break
    print('抢券结束')
