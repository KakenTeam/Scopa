const PORT = process.env.PORT || 3001;
var express   = require('express'),
    http      = require('http'),
    socketIO  = require('socket.io'),
    ip        = require('ip'),
    bodyParser = require('body-parser');

var app = express();
var server = http.createServer(app);
var io  = socketIO(server);
var _ = require('lodash');

var { mongoose } = require('./db/mongoose');
var { User } = require('./models/user');
var { Order } = require('./models/order');

console.log("Server nodejs chay tai dia chi: " + ip.address() + ":" + PORT)
server.listen(PORT, function () {
  console.log(`Server is up on ${PORT}`);
});
app.use(bodyParser.json());

function ParseJson(jsondata) {
  try {
    return JSON.parse(jsondata);
  } catch (error) {
    return null;
  }
}

//Khi có mệt kết nối được tạo giữa Socket Client và Socket Server
io.on('connection', function (socket) {
  
  console.log("Connected"); //In ra màn hình console là đã có một Socket Client kết nối thành công.

  socket.on('connection', function (message) {
    console.log(message);
  });

  socket.on('disconnect', function () {
    console.log("disconnect with arduino!") 
  })
});

app.post('/users', (req, res) => {
  var user = new User({
    username: req.body.username,
    password: req.body.password
  });
  
  user.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

app.post('/login', (req, res) => {
  var info = _.pick(req.body, ['username', 'password']);
  User.findOne(info)
      .then(user => {
        if (!user) {
          return res.sendStatus(404).send();
        }
        res.send(user);
      })
      .catch((e) => {
        res.status(404).send(e);
      })
});

app.post('/orders', (req, res) => {
  var owner = User.findOne({ _id: req.body.id_user })
  .exec(function (err, user) {
    if (err) {
      res.status(400).send({ message: 'Not found user'});
    } else {
      var order = new Order({
        id_water: req.body.id_water,
        owner: user._id
      })
      order.save(function (err) {
        console.log(err);
      });
      user.orders.push(order);
      user.save();
      var json = {
        type_water: req.body.id_water,
        order_id: order._id
      }
      io.sockets.emit('drop_water', json);
      res.status(200).send({ message: "Sent successfully" });
    }
  })
})

app.get('/orders', (req, res) => {
  var orders = Order.find({}).populate('owner', 'username')
  .exec(function (err, orders) {
    if (err) return res.sendStatus(400);
    res.send(orders);
  });
})
