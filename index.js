const express = require("express");
const app = express();
const http = require("http");
const sever = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(sever);
const mongodb = require("mongodb").MongoClient;

// connect to localhost
sever.listen(4000);

// send HTML page
app.use(express.static(__dirname));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// connect to MongoDB
mongodb.connect('mongodb://127.0.0.1/TUTORIAL', (err, client) =>{
  if(err){
    throw err;
  }
  console.log('mongodb connected');
  io.on('connection', (socket) =>{
    const chat = client.db('client');
    
    // create send status function
    sendStatus = (s) =>{
      socket.emit('status', s);
    }

    // get chat from mongo collection
    chat.collection('chat').find().sort({_id:1}).toArray((err, res)=>{
      if(err){
        throw err;
      }

      // emit the result
      socket.emit('output', res);
    });

    // handle output
    socket.on('input', (data)=>{
      const name = data.name;
      const message = data.message;
      
      if(name == '' || message == ''){
        sendStatus('please enter and chat and message');
      } else{
        chat.collection('chat').insertOne({name: name, message: message}, ()=>{
          io.emit('output', [data]);

          // Send clear status
          sendStatus({
            message: 'message sent',
            clear: true
          });
        });
      }
    });

    //handle clear
    socket.on('clear', ()=>{
      //remove chat collection
      chat.collection('chat').remove({}, ()=>{
        socket.emit('cleared');
      });
    });
  });
});

