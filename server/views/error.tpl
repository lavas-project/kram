{{target: error}}
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui">
    <title>Baidu PWA</title>
    <style>
        body {
            font-family: 'Microsoft YaHei', 'Hiragino Sans GB', 'Helvetica Neue', Arial, sans-serif;
        }
        #main {
            margin: 100px auto;
        }
        .info {
            margin: 0 auto;
        }
        .info p {
            text-align: center;
            font-size: 14px;
        }
        .info img {
            display: block;
            margin: 0 auto;
        }
        .info .msg {
            text-align: center;
            font-size: 20px;
            color: #2196f3;
        }
        a:visited, a:active, a:hover {
            color: #2196f3;
        }
    </style>
  </head>
  <body>
    <div id="main">
        <div class="info">
            <img src="//www.baidu.com/img/baidu_jgylogo3.gif" alt="">
            <p class="msg">${message}</p>
            <p>您的访问出错了，<a href="/">回到首页</a></p>
        </div>
    </div>
  </body>
</html>
