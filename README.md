# API para controlar dispositivos mediante MQTT

Esta aplicación basada en Node.js permite recibir y enviar información a traves del protocolo MQTT, para controlar dispositivos conetados a internet por medio de alguna placa de desarrollo.


## Calls
Controla las llamadas a la API para publicar los estados de los pines digitales en las placas de desarrollo.

Status:

[GET] `http://localhost:3002/api`

-------------------

### Mostrando todos los registros:

[GET] `http://localhost:3002/api/devices`

[Respuesta]

```javascript 
  {
  "_id": "5d435387e2ca495655cf4d9d",
  "name": "light-003",
  "type": "light",
  "status": 0,
  "topic": "lights",
  "__v": 0,
  "pin": 8,
  "device": esp8266-001
  }
```
-------------------

### Crear nuevo registro:

[POST] `http://localhost:3002/api/devices/write`

Parametros

"name"   > String
"type"   > String
"device" > String
"pin"    > Number
"status" > Number
"topic"  > String

-------------------

### Mostrando registro por ID:

[POST] `http://localhost:3002/api/device/:deviceId`

-------------------

### Actualizando registro por ID:

[PUT] `http://localhost:3002/api/device/:deviceId`

"name"
"type"
"pin"
"status"
"topic"


-------------------

### Actualizando status de registro por ID:

[POST] `http://localhost:3002/api/update/:deviceId/:status`

"status" > Number > 0 or 1

-------------------

### Obteniendo datos de Temperatura:

[POST] `http://localhost:3002/api/temperature`


