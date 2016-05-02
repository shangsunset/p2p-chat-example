const topology = require('fully-connected-topology')
const jsonStream = require('duplex-json-stream')
const streamSet = require('stream-set')

const username = process.argv[2]
const me = process.argv[3]
const peers = process.argv.slice(4)

const swarm = topology(me, peers)
let connections = streamSet()
let received = {}
let seq = 0
const id = Math.random()

swarm.on('connection', (socket, userAddress) => {
  console.log(`new connection from ${userAddress}, total connections: ${connections.size}`)

  socket = jsonStream(socket)
  connections.add(socket)

  socket.on('close', () => {
    console.log(`${userAddress} left`);
    console.log(`total connections: ${connections.size}`)
  })

  socket.on('data', data => {

    if (data.seq <= received[data.id] ) {
      return 
    } else {
      
      received[data.id] = data.seq
      process.stdout.write(`${data.username}(${data.seq}): ${data.message}\n`)
      connections.forEach(connection => {
        connection.write(data)
      })
    }
  })
})

process.stdin.on('data', data => {
  const message = data.toString().trim()
  connections.forEach(connection => {

    connection.write({username, message, seq: seq++, id})
  })
})
