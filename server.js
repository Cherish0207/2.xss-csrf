// 当用户登录后 返回一个标识 cookie

let express = require("express");
let app = express();
let path = require("path"); // 帮我们拼接路径
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname)));

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
    console.log(cardId);
    res.cookie(SESSION_ID, cardId);
    res.json({ code: 0 });
  } else {
    res.json({ code: 1, error: "用户不存在" });
  }
});
app.listen(3000);
