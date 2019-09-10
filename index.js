const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose')

var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://localhost:1883')

const Devices = require('./models/devices.js')

let productDevice

const app = express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.post('/api', function(req, res) {
	res.send('Saludos desde express');
});	

// Creando nuevo device
app.post('/api/device/write', function(req, res) {
  console.log('POST /api/devices')
  console.log(req.body)

  let devices = new Devices()
  devices.name = req.body.name
  devices.type = req.body.type
  devices.pin = req.body.pin
  devices.status = req.body.status
  devices.topic = req.body.topic

  devices.save((err, productStored) => {
    if (err)
    	res.status(500).send({message:`Error al guardar ${err}`})

    res.status(200).send({Device: productStored})
  })
})

client.on("connect",function(){	
	console.log("Conexion broker MQTT OK");

// Mostrando devices for ID 
app.get('/api/device/:deviceId', function(req, res) {

	let deviceId = req.params.deviceId

	Devices.findById(deviceId, (err, device ) => {
		if (err) return res.status(500).send({ message: `Error al realizar la petición` })
		if (!device) return res.status(400).send({ message: `El ID del producto no existe` })

		res.status(200).send({ device })
	})

});

// Actualizado devices for ID 
app.put('/api/device/:deviceId', function(req, res) {

	let deviceId = req.params.deviceId
	let update = req.body

	Devices.findByIdAndUpdate(deviceId, update, (err, device ) => {
		if (err) return res.status(500).send({ message: `Error al realizar la petición` })

		res.status(200).send({ device })
	})

});

// Actualizado status in devices for ID 
app.put('/api/update/:deviceId/:status', function(req, res) {

	let deviceId = req.params.deviceId
	let update = JSON.parse(req.params.status);


	Devices.findByIdAndUpdate(deviceId, { status: `${req.params.status}`}, (err, device ) => {
		if (err) return res.status(500).send({ message: `Error al realizar la petición` })

		res.status(200).send({ device })

		console.log({ device })

		//Publish in MQTT
		//DeviceID
		//StatusID

		client.publish('esp32/status/', `${deviceId}-${req.params.status}`)

	})
});


// Mostrando todos los registros
app.get('/api/devices', function(req, res) {

	Devices.find((err, device ) => {
		if (err) return res.status(500).send({ message: `Error al realizar la petición` })
		if (!device) return res.status(500).send({ message: `No existen productos` })

		res.status(200).send({ device })
	})

});	

})

mongoose.connect('mongodb://localhost:27017/storage_devices', (err, res) => {
  if (err) throw err 
  console.log('Conexion MongoDB OK')

  app.listen(3002, () => {
    console.log("El servidor está inicializado en el puerto 3002");
  })

})