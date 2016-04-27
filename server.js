const net = require('net')
const streamSet = require('stream-set')
const jsonStream = require('duplex-json-stream')

let clients = streamSet()
const server = net.createServer(socket => {
  socket = jsonStream(socket)
  console.log(socket);
  clients.forEach(client => {

    socket.on('data', data => {
      client.write(`${data.username}: ${data.message}\n`)
    })
    client.on('data', data => {
      socket.write(`${data.username}: ${data.message}\n`)
    })
  })
  clients.add(socket)
})

server.on('error', (err) => {
  console.log(err)
})

server.listen(8888)
