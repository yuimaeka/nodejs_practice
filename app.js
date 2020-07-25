// Node.jsの標準ライブラリであるhttpとexpressをインポート
var http = require('http');
var express = require('express');
// パスの指定に必要
var path = require('path');

// mongooseを利用可能にする
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/chatapp',function(err){
    if(err){
        console.error(err);
    }else{
        console.log("successfully connected to MongoDB.")
    }
});


// Expressのインスタンスであるapp
var app = express()

//pugテンプレートエンジンとして設定
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');


// appにミドルウェアを設定(様々なミドルウェアを追加し、Webアプリを作成)
// 応答用メソッドres.sendやres.render(テンプレートエンジンを使う場合はこっち)
app.get("/",function(req, res, next){
    return res.render('index',{title:'Hello World'});
});

app.get("/hoge",function(req, res, next){
    return res.send('Hoge');
});

//Node.jsで定義したhttpサーバーにappを設置
var server = http.createServer(app);

// Node.jsのサーバーをローカルホストの3000ポートに関連付ける
server.listen('3000');