网站常见的 2 种攻击

- xss (casading style sheets) 跨站脚本攻击，很像 sql 注入，在某些网站上注入非法的脚本
- csrf (cross-site request forgery) 跨站请求伪造，冒充用户的身份做一些事情。比如一个交友网站，访问之后可以记录你的身份冒充你。

例子 特点 解决方式

后台 express，前台 jquery

实现一个登陆功能
通过 cookie 校验身份，cookie 可能会被盗走

