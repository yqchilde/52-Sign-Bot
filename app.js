// 52-Sign-Bot
const fs = require("fs")
const download = require('download')
const exec = require('child_process').execSync
const fetch = require('node-fetch')

const WUAI_COOKIE = process.env.WUAI_COOKIE
const WEICHAT_CORPID = process.env.WEICHAT_CORPID
const WEICHAT_AGENTID = process.env.WEICHAT_AGENTID
const WEICHAT_CORPSECRET = process.env.WEICHAT_CORPSECRET

async function downFile() {
    const url = `https://cdn.jsdelivr.net/gh/NobyDa/Script@master/52pojie-DailyBonus/52pojie.js`

    await download(url, "./")
}

async function ReplaceCookie() {
    let content = await fs.readFileSync('./52pojie.js', 'utf8');
    content = content.replace(/const CookieWA = ''/, `const CookieWA = '${WUAI_COOKIE}'`);

    await fs.writeFileSync('./52pojie.js', content, 'utf8')
}

async function sendNotify(content, corpid, agentid, corpsecret) {
    (async () => {
        const body = {
            corpid: corpid,
            agentid: agentid,
            corpsecret: corpsecret,
            message: content
        };

        const response = await fetch('https://api.yqqy.top/qiye_weichat', {
            method: 'post',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const json = await response.json();

        console.log(json);
    })();
}

async function start() {
    if (!WUAI_COOKIE) {
        console.log('请写入 WUAI_COOKIE 后再继续');
        return
    }

    // 下载最新代码
    await downFile();
    console.log("下载代码完毕");

    // 替换变量
    await ReplaceCookie();
    console.log("替换变量完毕");

    // 执行
    await exec("node 52pojie.js >> result.txt");
    console.log("执行完毕");

    // 微信通知
    if (WEICHAT_CORPID) {
        let path = "./result.txt";
        let content = "";

        if (fs.existsSync(path)) {
            content = fs.readFileSync(path, "utf8");
        }

        await sendNotify(content, WEICHAT_CORPID, WEICHAT_AGENTID, WEICHAT_CORPSECRET);
        console.log("发送结果完毕");
    }
}

start()