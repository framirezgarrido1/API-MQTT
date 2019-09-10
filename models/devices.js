'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DevicesSchema = Schema ({
	name: String,
	type: String,
	pin: Number,
	status: Number,
	topic: String
})

module.exports = mongoose.model('Devices', DevicesSchema)