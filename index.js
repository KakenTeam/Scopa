const PORT = process.env.PORT || 3001;
var express   = require('express'),
    http      = require('http'),
    socketIO  = require('socket.io'),
    ip        = require('ip'),
    bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var server = http.createServer(app);
var io  = socketIO(server);
var _ = require('lodash');

var { mongoose } = require('./db/mongoose');
var { User } = require('./models/user');
var { Order } = require('./models/order');
var { State } = require('./models/state');

console.log("Server nodejs chay tai dia chi: " + ip.address() + ":" + PORT)
server.listen(PORT, function () {
  console.log(`Server is up on ${PORT}`);
});
app.use(cors({origin: '*'}));
app.use(bodyParser.json());

function ParseJson(jsondata) {
  try {
    return JSON.parse(jsondata);
  } catch (error) {
    return null;
  }
}

io.on('connection', function (socket) {
  
  console.log("Connected"); 

  socket.on('connection', function (message) {
    console.log(message);
    set_state_arduino(false);
  });

  socket.on("done", (order_id) => {
    set_state_arduino(false);
    console.log(order_id);
    set_has_served_order(order_id.message);
    serve_another_order();
  })

  socket.on('disconnect', function () {
    console.log("disconnect with arduino!") 
  })
});

function serve_another_order() {
  console.log("Server another order");
  Order.find({ is_served: false}).lean().exec(function(err, results) {
    if (results.length > 0) {
      var json = {
        type_water: results[0].id_water,
        order_id: results[0]._id
      }
      var channel_user = 'users' + results[0].owner;
      io.sockets.emit(channel_user, json);
    }
  });
}

function set_has_served_order(order_id) {
  Order.findOneAndUpdate(
    { _id: order_id },
    {
      $set: {
        is_served: true 
      }
    },
    { new: true }, function (err, doc) {
      if (err) {
        console.log("Something wrong when updating order served!");
      }

      console.log("updated served order " + order_id);
    });
}

function set_state_arduino(value_state) {
  var state_id = "5ac43bb01566211f10f38fac";
  State.findOneAndUpdate(
    { _id: state_id },
    {
      $set:
        {
          is_busy: value_state
        }
    },
    { new: true }, function (err, doc) {
      if (err) {
        console.log("Something wrong when updating data!");
      }

      console.log("State arduino now: ", doc.is_busy);
    });
};

function getStateArduino() {
  var state_id = "5ac43bb01566211f10f38fac";
  var state = State.findOne({ _id: state_id}, function(err, result) {
    if (err) {
      console.log("CAN NOT FIND");
    }
    return result.is_busy;
  });
}

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

app.get('/users/:id', (req, res) => {
  User.findById(req.params.id, function(err, user) {
    res.send({ username: user.username});
  })
})

app.post('/login', (req, res) => {
  var info = _.pick(req.body, ['username', 'password']);
  User.findOne(info)
      .then(user => {
        if (!user) {
          return res.status(400).send({
            message: "Invalid login credentials. Please try again."
          });
        }
        res.send(user);
      })
      .catch((e) => {
         res.status(400).send({
           message: "Invalid login credentials. Please try again."
         });
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
      order.save();
      var json = {
        type_water: req.body.id_water,
        order_id: order._id
      }
      
      var state_id = "5ac43bb01566211f10f38fac";
      State.findOne({ _id: state_id }, function (err, result) {
        if (err) {
          console.log("CAN NOT FIND");
        }
        var state_arduino = result.is_busy;
        if (state_arduino) {
          res.status(200).send({ message: "wait", order_id: order._id });
        } else {
          set_state_arduino(true);
          io.sockets.emit('drop_water', json);
          res.status(200).send({ message: "Sent successfully" });
        }
      });
      
    }
  })
})

app.get('/orders', (req, res) => {
  var orders = Order.find({ is_served: true }).populate('owner', 'username')
  .exec(function (err, orders) {
    if (err) return res.sendStatus(400);
    res.send({ orders: orders });
  });
})

app.get('/orders/:id/serve', (req, res) => {
  var order_id = req.params.id;
  Order.findById(order_id, function(err, order) {
    var json = {
      type_water: order.id_water,
      order_id: order._id
    }
    io.sockets.emit('drop_water', json);
    res.status(200).send({ message: "Sent" });
  })
})

app.get('/users/:id/orders', (req, res) => {
  var user_id = req.params.id;
  Order.find({ owner: user_id, is_served: true}).lean()
       .exec(function(err, orders) {
          res.send({ orders: orders } );
       });
})

app.delete('/orders/:id', (req, res) => {
  var order_id = req.params.id;
  Order.findByIdAndRemove(order_id, function(err, order) {
    if (err) console.log(err);
    serve_another_order();
    res.send({ message: "canceled order"});
  })
})
