"use strict";

// Node.jsの標準ライブラリであるhttpとexpressをインポート
var http = require('http');
var express = require('express');
// パスの指定に必要
var path = require('path');

//POSTを受け取るためのbody-parser
var bodyparser = require('body-parser');

// mongooseを利用可能にする
var mongoose = require('mongoose');

// スキーマをインポートする
var Message = require('./schema/Message');

// Expressのインスタンスであるapp
var app = express();

// mongooseに接続
mongoose.connect('mongodb://localhost:27017/chatapp',function(err){
    if(err){
        console.error(err);
    }else{
        console.log("successfully connected to MongoDB.");
    }
});

//POSTを受け取るため、body-parserをミドルウェアとして導入
app.use(bodyparser())

//pugをテンプレートエンジンとして設定
app.set('views',path.join(__dirname,'views'));
app.set('view engine','pug');


// appにミドルウェアを設定(様々なミドルウェアを追加し、Webアプリを作成)
// 応答用メソッドres.sendやres.render(テンプレートエンジンを使う場合はこっち)
// MongoDB内のデータを参照する為のfind
app.get("/",function(req, res, next){
    Message.find({},function(err,msgs){
        if(err) throw err;
        return res.render('index',{messages:msgs});
    });
});

app.get("/update",function(req, res, next){
    return res.render('update');
});

app.post("/update",function(req, res, next){

    //スキーマにデータを格納するためのインスタンスを作成
    var newMessage = new Message({
        username: req.body.username,
        message: req.body.message
    });

    //エラーが発生した際にホーム画面にリダイレクト
    newMessage.save((err)=>{
        if(err) throw err;
        return res.redirect("/");
    });
});


//Node.jsで定義したhttpサーバーにappを設置
var server = http.createServer(app);

// Node.jsのサーバーをローカルホストの3000ポートに関連付ける
server.listen('3000');