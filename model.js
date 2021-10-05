const { MongoClient } = require("mongodb");
const express = require('express');
const mqtt = require('mqtt');

// oz14ttRl6YWoISrD : insert_user
const uri =
  "mongodb+srv://insert_user:oz14ttRl6YWoISrD@cn466midterm.1lueq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// The database to use
const dbName = "SensorData";
const collectionName = "IncubatorDatabase";

const mqttClient = mqtt.connect("mqtt://broker.hivemq.com");

mqttClient.on("connect", () => {
  console.log("HIVEMQ connected");
  mqttClient.subscribe(["cn466/sensors/cucumber_2/#"], () => {
    console.log("Topic subscribed");
  });
});

mqttClient.on("message", async (topic, payload) => {

  // Data from payload
  let data = JSON.parse(payload);
  delete data['acceleration'];
  delete data['angular_velocity'];

  data['timestamp'] = new Date().toLocaleString('th')
  data['IncubatorID'] = Math.round(Math.random() * (3 - 1) + 1)
  
  try {
    await client.connect();
    await client.db(dbName).collection(collectionName).insertOne(data, (err, response) => {
      if (err) throw err;
      console.log("Document inserted!", JSON.stringify(data))
    });
  } catch (err) {
    console.log(err.stack);
  }
});

client.close();
