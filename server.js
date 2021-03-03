// 当用户登录后 返回一个标识 cookie

let express = require("express");
let svgCaptcha = require("svg-captcha");
let app = express();
let path = require("path"); // 帮我们拼接路径
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname)));
let cookieParser = require("cookie-parser");
app.use(cookieParser()); // req.cookies
let bodyParser = require("body-parser"); // 处理浏览器发过来的请求体
app.use(bodyParser.urlencoded({ extended: true })); // a=1&b=2 = {a:1,b:2} =  req.body
let userList = [
  { username: "cherish", password: "1234", money: 10000 },
  { username: "silence", password: "5678", money: 20 },
];
let SESSION_ID = "connect.sid";
let session = {};
app.post("/api/login", function (req, res) {
  let { username, password } = req.body;
  let user = userList.find(
    (user) => user.username === username && user.password === password
  );
  if (user) {
    // 服务器需要在用户登录后 给一个信息  cookie 珠峰:110
    let cardId = Math.random() + Date.now();
    session[cardId] = { user };
    // 一般情况下会让cookie在前端不可以获取
    // 并不是解决xss的方案 只是降低受损的范围
    // httpOnly: true 禁止浏览器访问这个cookie
    // --> 虽然阻止了黑客，但用户也访问不了了，而且依然没有根本上阻止脚本注入
    res.cookie(SESSION_ID, cardId);
    res.json({ code: 0 });
  } else {
    res.json({ code: 1, error: "用户不存在" });
  }
});
// 反射型xss  http://localhost:3000/welcome?type=<script>alert(document.cookie)</script>
// chrome 发现路径存在异常（注入js脚本） 会有xss屏蔽功能
// 诱导用户自己点开(一次性)
// 查询参数 可以加上 encodeURIComponent 方式解决
app.get("/welcome", function (req, res) {
  res.send(`${encodeURIComponent(req.query.type)}`);
});
// 用户评论信息
let comments = [
  { username: "zfpx", content: "欢迎大家参加珠峰架构课", money: 10000 },
  { username: "zs", content: "进阿里 选珠峰", money: 2000 },
];
app.get("/api/list", function (req, res) {
  res.json({ code: 0, comments });
});
app.post("/api/addcomment", function (req, res) {
  let r = session[req.cookies[SESSION_ID]] || {}; // {user:{username:passord}}
  let user = r.user;
  if (user) {
    comments.push({ username: user.username, content: req.body.content });
    res.json({ code: 0 });
  } else {
    res.json({ code: 1, error: "用户未登录" });
  }
});
app.get("/api/userinfo", function (req, res) {
  let r = session[req.cookies[SESSION_ID]] || {};
  let { data /*svg内容*/, text /*验证码对应的结果*/ } = svgCaptcha.create();
  r.text = text; // 下次请求时应该拿到返回的结果和上次存好的结果做对比
  // console.log(text);
  let user = r.user;
  if (user) {
    res.json({
      code: 0,
      user: {
        username: user.username,
        money: user.money,
        svg: data,
      },
    });
  } else {
    res.json({ code: 1, error: "用户未登录" });
  }
});
app.post("/api/transfer", function (req, res) {
  let { user, text } = session[req.cookies[SESSION_ID]] || {};
  if (user) {
    let { target, money, code } = req.body;
    if (code && code === text) {
      // 如果有验证码 并且验证码和我给你的一致->转钱
      money = Number(money);
      userList.forEach((u) => {
        // 当前账户扣钱
        if (u.username === user.username) {
          u.money -= money;
        }
        // 收款人收钱
        if (u.username === target) {
          u.money += money;
        }
      });
      res.json({ code: 0 });
    } else {
      res.json({ code: 1, error: "验证不正确" });
    }
  } else {
    res.json({ code: 1, error: "用户未登录" });
  }
});
app.listen(3000);
