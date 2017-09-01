var {  path,  express,  socketIO,  http,  app,  publicPath,  server,  io,  generateMsg,  User} = require('./serverConfig.js');

// var https = require('https');
// var fs=require('fs');
// var privateKey  = fs.readFileSync(__dirname+'/keys/key.pem', 'utf8');
// var certificate = fs.readFileSync(__dirname+'/keys/server.crt', 'utf8');
//
// var credentials = {key: privateKey, cert: certificate};
// var httpsServer = https.createServer(credentials, app);

var port=process.env.PORT || 3000;

var users = new User();

io.on('connection', (socket) => {

  socket.on('join', (user) => {
    users.addUser(socket.id, user.name, user.room);
    socket.join(user.room);

    socket.emit('newMsg',generateMsg('Admin','Welcome to chat'));
    socket.broadcast.to(user.room).emit('newMsg',generateMsg('Admin',`${user.name} join chat`));
    io.to(user.room).emit('usersUpdate',users.getUsersList(user.room));
  });

  socket.on('createMsg', (msg) => {
    var user = users.getUser(socket.id);
    io.to(user.room).emit('newMsg', generateMsg(user.name, msg.text));
  });

  socket.on('createLocationMsg', (locationMsg, callback) => {
    var user = users.getUser(socket.id);
    var url = `http://maps.google.com/?q=${locationMsg.lat},${locationMsg.long}`;
    io.to(user.room).emit('newLocationMsg', generateMsg(user.name, url));
    callback();
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);
    socket.broadcast.to(user.room).emit('newMsg', generateMsg('Admin', `${user.name} leave chat`));
    io.to(user.room).emit('usersUpdate',users.getUsersList(user.room));
  });

});

app.post('/checkUser', function(req, res){
  var name=req.body.name;
  users.checkUserName(name,(user)=>{
    if(user){
      res.send(true);
    }else{
      res.send(false);
    }
  });
});

server.listen(port, () => {
  console.log('Server has started');
});

// httpsServer.listen(port,()=>{
//   console.log('Https server has started');
// });
