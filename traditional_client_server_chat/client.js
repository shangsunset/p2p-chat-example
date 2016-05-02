const net = require('net')
const dns = require('dns')
const jsonStream = require('duplex-json-stream')

const username = process.argv[2] || 'guest'
const host = `${process.argv[3] || 'p2p-chat-server'}.local`
const port = 8888

dns.lookup(host, (err, host) => {

  console.log(`connected to ${host} on port ${port}`)
  let socket = net.connect(port, host)
  socket = jsonStream(socket)

  process.stdin.on('data', data => {

    const message = data.toString().trim()
    socket.write({username, message})
  })

  socket.on('data', data => {
    process.stdout.write(data)
  })
})
