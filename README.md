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
      "_id": "5e87a6501df56d53253e6556",
      "name": "Regador Jardín",
      "type": "plant",
      "pin": 14,
      "status": 1,
      "topic": "costanera1980/devices/ESP32/ESP32-001/",
      "device": "ESP32",
      "timeon": "10:00",
      "timeoff": "11:30",
      "days": "all",
      "__v": 0
   }
```
-------------------

### Crear nuevo registro:

[POST] `http://localhost:3002/api/devices/write`

Parametros

"name"   > String

"type"   > String   [gpio,temperature,plant,light]

"pin"    > Number

"status" > Number   [0,1]

"topic"  > String

"device" > String

"timeon" > String

"timeoff"> String

"days"   > String   [all,week,none]


-------------------

### Mostrando registro por ID:

[POST] `http://localhost:3002/api/device/:deviceId`

-------------------

### Actualizando registro por ID:

[PUT] `http://localhost:3002/api/device/:deviceId`

Parametros

-------------------

### Actualizando status de registro por ID:

[POST] `http://localhost:3002/api/update/:deviceId/:status`

"status" > Number > 0 or 1

-------------------

### Obteniendo datos de Temperatura:

[GET] `http://localhost:3002/api/temperature`

-------------------

### Delete registro:

[DELETE] `http://localhost:3002/api/delete/:deviceId`

-------------------

### Diagrama de comunicación

![Screenshot](diagrama.png)
