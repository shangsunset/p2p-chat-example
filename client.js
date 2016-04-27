const net = require('net')
const jsonStream = require('duplex-json-stream')

const username = process.argv[2] || 'guest'

let socket = net.connect(8888)
socket = jsonStream(socket)

process.stdin.on('data', data => {

  const message = data.toString().trim()
  socket.write({username, message})
})

socket.on('data', data => {
  process.stdout.write(data)
})
