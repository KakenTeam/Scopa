const PORT = 3000; //Đặt địa chỉ Port được mở ra để tạo ra chương trình mạng Socket Server
var express = require('express'),
  app = express(),
  http = require('http').Server(app),
  io = require('socket.io')(http);
var ip      = require('ip');
var bodyParser = require('body-parser');

var { mongoose } = require('./db/mongoose');
var { User } = require('./models/user');

console.log("Server nodejs chay tai dia chi: " + ip.address() + ":" + PORT)
http.listen(3000, function () {
  console.log("On server");
});
app.use(bodyParser.json());

function ParseJson(jsondata) {
  try {
    return JSON.parse(jsondata);
  } catch (error) {
    return null;
  }
}

function sendTime() {

  //Đây là một chuỗi JSON
  var json = {
    name: 'thuan', //kiểu chuỗi
    ESP8266: 12, //số nguyên
    soPi: 3.14, //số thực
    time: new Date() //Đối tượng Thời gian
  }
  io.sockets.emit('atime', json);
}
//Khi có mệt kết nối được tạo giữa Socket Client và Socket Server
io.on('connection', function (socket) {
  //hàm console.log giống như hàm Serial.println trên Arduino
  console.log("Connected"); //In ra màn hình console là đã có một Socket Client kết nối thành công.

  socket.emit('welcome', {
    message: "Connected !!!"
  })

  socket.on('connection', function (message) {
    console.log(message);
  });

  socket.on('atime', function (data) {
    sendTime();
    console.log(data);
  });

  socket.on('arduino', function (data) {
    io.sockets.emit('arduino', {
      message: 'R0'
    });
    console.log(data);
  });
  //Khi socket client bị mất kết nối thì chạy hàm sau.
  socket.on('disconnect', function () {
    console.log("disconnect") //in ra màn hình console cho vui
    clearInterval(interval1) //xóa chu kỳ nhiệm vụ đi, chứ không xóa là cái task kia cứ chạy mãi thôi đó!
  })
});

// app.post('/users', (req, res) => {
//   var user = new User({
//     username: req.body.username,
//     password: req.body.password
//   });
  
//   user.save().then((doc) => {
//     res.send(doc);
//   }, (e) => {
//     res.status(400).send(e);
//   });
// });

