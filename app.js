// Node.jsの標準ライブラリであるhttpとexpressをインポート
var http = require('http');
var express = require('express');

// Expressのインスタンスであるapp
var app = express()

// appにミドルウェアを設定(様々なミドルウェアを追加し、Webアプリを作成)
// 応答用メソッドres.sendやres.render
app.get("/",function(req, res, next){
    return res.send('Hello World');
});

app.get("/hoge",function(req, res, next){
    return res.send('Hoge');
});

//Node.jsで定義したhttpサーバーにappを設置
var server = http.createServer(app);

// Node.jsのサーバーをローカルホストの3000ポートに関連付ける
server.listen('3000');