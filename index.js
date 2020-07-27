const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose')


var mqtt = require('mqtt')

// Public Broker
var client  = mqtt.connect('mqtt://broker.hivemq.com:1883')

const Devices = require('./models/devices.js')

let productDevice

const app = express();



app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// configurar cabeceras http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
 
    next();
});


app.get('/api', function(req, res) {
	res.send('Hi from x.Home');
});	

// Mostrando todos los registros
app.get('/api/devices', function(req, res) {

	Devices.find((err, device ) => {
		if (err) return res.status(500).send({ message: `Error al realizar la petición` })
		if (!device) return res.status(500).send({ message: `No existen dispositivos` })

		res.status(200).send({ device })
	})

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
  devices.device = req.body.device
  devices.timeon = req.body.timeon
  devices.timeoff = req.body.timeoff
  devices.days = req.body.days
  devices.creationDate = new Date()

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
		if (!device) return res.status(400).send({ message: `El ID del dispositivos no existe` })

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
		console.log(device.topic)

		const message = `${device.pin}-${req.params.status}-${device.type}`


		//Publish in MQTT
		//DeviceID
		//StatusID

		let now = new Date();

		//Publicando en TOPIC guardado en el objeto
		client.publish(`${device.topic}`, message)

	})
});


// Mostrando todos los sensores de temperatura
app.get('/api/devices/stype=:type', function(req, res) {

	let type = req.params.type

	Devices.find({type:type}, (err, device ) => {
		if (err) return res.status(500).send({ message: `Error al realizar la petición` })
		if (!device) return res.status(400).send({ message: `El ID del dispositivos no existe` })

		res.status(200).send({ device })
	})

});


// Eliminar registro por ID
app.delete('/api/delete/:deviceId', function(req, res) {

	let deviceId = req.params.deviceId

	Devices.findByIdAndRemove(deviceId, (err, device ) => {
		if (err) return res.status(500).send({ message: `Error al realizar la petición` })
		if (!device) return res.status(400).send({ message: `El ID del dispositivos no existe` })

		const response = {
			message: "Device eliminado con exito"
		}

		res.status(200).send("Device eliminado con exito")
	})

});


})

mongoose.connect("mongodb://localhost:27017/storage_devices", (err, res) => {
  if (err) throw err 
  console.log('Conexion MongoDB OK')

  app.listen(3002, () => {
    console.log("El servidor está inicializado en el puerto 3002");
  })

})
