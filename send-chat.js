// get element
const status = document.getElementById('status');
const username = document.getElementById('username');
const texting = document.getElementById('texting');
const messages = document.getElementById('messages');
const clearBtn = document.getElementById('clearBtn');

//set status default
const statusDefault = status.textContent;
const setStatus = (s)=>{
  // set status
  status.textContent = s;
  if(s != statusDefault){
    setTimeout(()=>{
      setStatus(statusDefault);
    }, 4000);
  }
}

// connect to socket.io
const socket = io.connect();
if(socket != undefined){
  console.log("connected to socket.io...");
  socket.on('output', (data)=>{
    if(data.length){
      for(var x = 0; x < data.length; ++x){
        const message = document.createElement('div');
        message.textContent = data[x].name + ": " + data[x].message;
        message.setAttribute('id', "message-" + x);
        message.setAttribute('class', "message");
        messages.appendChild(message);
      }
    }
  });

  //handle status
  socket.on('status', (data)=>{
    setStatus((typeof data === 'object') ? data.message : data);

    //check status is clear
    if(data.clear){
      texting.value = '';
    }
  });

  // handle input
  texting.addEventListener('keydown', (e)=>{
    if(e.keyCode === 13 && e.shiftKey == false){
      socket.emit('input', {
        name:username.value,
        message:texting.value
      });
    }
  });

  // handle clear
  clearBtn.addEventListener('click', ()=>{
    console.log("clear");
    socket.emit('clear');
  });

  socket.on('cleared', ()=>{
    messages.textContent = '';
  });
}
