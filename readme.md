# cn466-midterm-backend

## About

This repository is made for `cn466:IoT` as a backend API using express.js, mongodb.js and mqtt.js provided by **Poonnatuch B.**

Postman API document can be found [here](https://documenter.getpostman.com/view/17798233/UUy4eRtE).<br>
Frontend github repo provided by **Yodsatorn P.** can be found [here](https://github.com/yodsatorn/cn466-midterm-frontend).<br>
Line Chatbot repo provided by **Rathapol P.** can be found [here](https://github.com/Rathapol-Putharaksa/linebot_CN466).

## Detail

This project's agenda is to study Internet of Thing, We setup a ESP32S2 board inside an incubator to detect Temparature, Pressure, Humidity, angular velocity and acceleration to make a smart incubator that can be track on a website and Chatbot.

This repository is made for IoT backend API using Express.js as a web framework workflow and overview of this project is describe by picture below.

![cn466-midterm-present](https://user-images.githubusercontent.com/61135042/136645960-f30a5384-ab80-4246-8372-ca2d90a7a831.png)

My responsibility is to provide API that

1. Subscribe to HiveHQ using MQTT.js and insert published data to MongoDB.
2. API for reading data from Atlas MongoDB(Clond).
3. Calculate and send alert message to Line Chatbot if the incubator's door is opened.

## Team

1. 6110613095 : Yodsatorn Pantongkam
2. 6110613129 : Rathapol Putharaksa
3. 6110613228 : Poonnatuch Boonyarattanasoontorn
