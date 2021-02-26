// 当用户登录后 返回一个标识 cookie

let express = require("express");
let app = express();
let path = require("path"); // 帮我们拼接路径
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname)));

app.listen(3001);
