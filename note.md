网站常见的 2 种攻击

例子 特点 解决方式

- xss (casading style sheets) 跨站脚本攻击，很像 sql 注入，在某些网站上注入非法的脚本
- csrf (cross-site request forgery) 跨站请求伪造，冒充用户的身份做一些事情。比如一个交友网站，访问之后可以记录你的身份冒充你。
  如转账: a 给 b 转账，转账之前访问了恶意页面导致安全问题
  如钓鱼网站，给个吸引他的网站
  解决方式: 转账前输入验证码，设置 vpn 禁止访问某些网站

  怎么拿到 cookie 的？
  第三方网站 其实拿不到用户 cookie 当往 3000 端口提交内容时自动会动提交 cookie
  表单提交没有跨域问题，同源问题只在 ajax 上

  实现一个钓鱼网站，
  1.node server.csrf.js 或者 npm run csrf 开启钓鱼网站 3001 服务
  2.node server.js 或者 npm run start 开启目标 3000 服务 3.模拟用户访问 localhost:3000,登陆成功 4.模拟用户访问 localhost:3001/fish.html 钓鱼连接 5.发现账户余额减少

后台 express，前台 jquery

实现一个登陆功能
通过 cookie 校验身份，cookie 可能会被盗走

存储型 xss:
恶意的脚本存储到了服务器上，所有人访问时都会造成攻击,比反射型和 DOM-Based 范围更大
持久型/存储型: 恶意写入的信息入了数据库/服务端，所有用户请求访问都会造成攻击
微博 访问时会以自己的身份发一条恶意微博

- xss + csrf = xsrf
