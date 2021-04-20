const express = require('express');
const app = express();
const expressWS = require('express-ws')(app);

app.get('/', (req, res) => {
  res.send(`
    <div id="messages">
    </div>
    <input id="name" placeholder="name" />
    <input id="message" placeholder="message" />
    <button onclick="sendMessage()">Send</button>
    <script>
      const socket = new WebSocket('ws:localhost:8000/');
      socket.onmessage = data => {
        const elem = document.createElement('div');
        data = JSON.parse(data.data);
        elem.textContent = data.name + ': ' + data.message;
        document.querySelector('#messages').appendChild(elem);
      };
      function sendMessage() {
        socket.send(JSON.stringify({
          name: document.querySelector('#name').value,
          message: document.querySelector('#message').value
        }));
      }
    </script>
  `);
});

let sockets = [];

app.ws('/', (ws, req) => {
  sockets.push(ws);
  ws.on('message', data => {
    sockets.forEach(socket => {
      socket.send(data);
    });
  });
});

app.listen(8000, () => {
  console.log('Listening on http://localhost:8000');
});