const path=require('path');
const express=require('express');
const socketIO=require('socket.io');
const http=require('http');
const bodyParser=require('body-parser');

var {generateMsg}=require('./utils/generateMsg.js');
var {User}=require('./utils/users.js');

var app=express();
const publicPath=path.join(__dirname+'/../public');
var server=http.createServer(app);

app.use(express.static(publicPath));
app.use(bodyParser.json());
app.use((req, res, next)=> {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
var io=socketIO(server);


module.exports={path,express,socketIO,http,app,publicPath,server,io,generateMsg,User};
