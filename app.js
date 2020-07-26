"use strict";

// Node.jsの標準ライブラリであるhttpとexpressをインポート
var http = require('http');
var express = require('express');
// パスの指定に必要
var path = require('path');

// mongooseを利用可能にする
var mongoose = require('mongoose');

// 画像ファイルのアップロードを可能にする
var fileUpload = require('express-fileupload');

// スキーマをインポートする
var Message = require('./schema/Message');

// Expressのインスタンスであるapp
var app = express();

// mongooseに接続
mongoose.connect('mongodb://localhost:27017/chatapp',{useNewUrlParser: true,useUnifiedTopology: true},function(err){
    if(err){
        console.error(err);
    }else{
        console.log("successfully connected to MongoDB.");
    }
});

app.use(express.static(__dirname));

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

// multipart/form-data形式で投稿された画像データを受け取る為、fileUploadミドルウェアを追加
app.post("/update",fileUpload(),function(req, res, next){


    //投稿に画像が添付されているかで分岐
    if(req.files && req.files.image){
        // メッセージと画像を結びつける為、画像へのpassをDBに保存
        req.files.image.mv('./image/' + req.files.image.name, function(err){

            if(err) throw err;

            //console.log(__dirname);

            //スキーマにデータを格納するためのインスタンスを作成
            var newMessage = new Message({
                username: req.body.username,
                message: req.body.message,
                image_path: '/image/' + req.files.image.name
            });

            //エラーが発生した際にホーム画面にリダイレクト
            newMessage.save((err)=>{
                if(err) throw err;
                return res.redirect("/");
            });


        });

    }else{

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
    }
});


//Node.jsで定義したhttpサーバーにappを設置
var server = http.createServer(app);

// Node.jsのサーバーをローカルホストの3000ポートに関連付ける
server.listen('3000');