const PORT = 3001; //Đặt địa chỉ Port được mở ra để tạo ra chương trình mạng Socket Server

var http = require('http') //#include thư viện http - Tìm thêm về từ khóa http nodejs trên google nếu bạn muốn tìm hiểu thêm. Nhưng theo kinh nghiệm của mình, Javascript trong môi trường NodeJS cực kỳ rộng lớn, khi bạn bí thì nên tìm hiểu không nên ngồi đọc và cố gắng học thuộc hết cái reference (Tài liêu tham khảo) của nodejs làm gì. Vỡ não đó!
var socketio = require('socket.io') //#include thư viện socketio

var ip = require('ip');
var app = http.createServer(); //#Khởi tạo một chương trình mạng (app)
var io = socketio(app); //#Phải khởi tạo io sau khi tạo app!
app.listen(PORT); // Cho socket server (chương trình mạng) lắng nghe ở port 3484
console.log("Server nodejs chay tai dia chi: " + ip.address() + ":" + PORT)

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