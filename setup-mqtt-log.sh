#!/bin/bash
sudo touch mosquitto/log/mosquitto.log
sudo chmod o+w mosquitto/log/mosquitto.log
sudo chown 1883:1883 mosquitto/log -R