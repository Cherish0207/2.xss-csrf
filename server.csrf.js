let express = require("express");
let app = express();
let path = require("path");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname)));
let bodyParser = require("body-parser");
let cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3001);
