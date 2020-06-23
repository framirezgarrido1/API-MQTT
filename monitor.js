var mqtt = require('mqtt')

var client  = mqtt.connect('mqtt://broker.hivemq.com')
topic = 'costanera1980/devices/ESP32/ESP32-001/'

client.on('connect', ()=> {
  client.subscribe(topic)
})

client.on('message', function (topic, message) {
  console.log(message.toString())
})
