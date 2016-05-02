const net = require('net')
const streamSet = require('stream-set')
const jsonStream = require('duplex-json-stream')
const register = require('register-multicast-dns')

const host = `${process.argv[2] || 'p2p-chat-server'}.local`
let clients = streamSet()


const server = net.createServer(socket => {
  console.log('new connection')
  socket = jsonStream(socket)
  clients.forEach(otherClient => {

    socket.on('data', data => {
      otherClient.write(`${data.username}: ${data.message}\n`)
    })
    otherClient.on('data', data => {
      socket.write(`${data.username}: ${data.message}\n`)
    })
  })
  clients.add(socket)
})

server.on('error', (err) => {
  console.log(err)
})

register(host)
server.listen(8888)
