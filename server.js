// 当用户登录后 返回一个标识 cookie

let express = require("express");
let app = express();
let path = require("path"); // 帮我们拼接路径
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname)));
let cookieParser = require("cookie-parser");
app.use(cookieParser()) // req.cookies
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
  { username: "zfpx", content: "欢迎大家参加珠峰架构课" },
  { username: "zs", content: "进阿里 选珠峰" },
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

app.listen(3000);
