const { MongoClient } = require("mongodb");
const express = require("express");
const mqtt = require("mqtt");
const cors = require("cors");

// FILEDS
const app = express();
const port = process.env.PORT;

// Express
app.use(express.json());

// CORS
const corsOption = {
  origin: process.env.ORIGINS,
};

app.use(cors(corsOption));

// MONGODB
const dbName = process.env.DB;
const collectionName = process.env.COLLECTION;
const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// MQTT
const mqttClient = mqtt.connect("mqtt://broker.hivemq.com");

mqttClient.on("connect", () => {
  console.log("HIVEMQ connected");
  mqttClient.subscribe([process.env.TOPIC_ALL], () => {
    console.log("Topic subscribed");
  });
});

mqttClient.on("message", async (topic, payload) => {
  // Data from payload
  let data = JSON.parse(payload);
  delete data["acceleration"];
  delete data["angular_velocity"];

  data["timestamp"] = new Date().toLocaleString("th");
  data["IncubatorID"] = Math.round(Math.random() * (3 - 1) + 1);

  try {
    await client.connect();
    client
      .db(dbName)
      .collection(collectionName)
      .insertOne(data, (err, response) => {
        if (err) throw err;
      });
  } catch (err) {
    console.log(err.stack);
  }
});
// END MQTT

// API
app.get("/", (req, res) => {
  res.send({ msg: "Hello, World" });
});

app.get("/Incubator/All", async (req, res) => {
  try {
    await client.connect();
    let result = await client
      .db(dbName)
      .collection(collectionName)
      .find({})
      .sort({ timestamp: -1 })
      .toArray();
    res.send({ result: true, message: "Success", data: result });
  } catch (err) {
    console.log(err);
    res.send({ result: false, message: "Fail", data: null });
  }
});

app.get("/Incubator/Latest", async (req, res) => {
  try {
    await client.connect();
    let result = await client
      .db(dbName)
      .collection(collectionName)
      .find({})
      .sort({ timestamp: -1 })
      .toArray();
    res.send({ result: true, message: "Success", data: result[0] });
  } catch (err) {
    console.log(err);
    res.send({ result: false, message: "Fail", data: null });
  }
});

app.get("/Incubator/IncubatorID/:InID", async (req, res) => {
  try {
    await client.connect();
    let result = await client
      .db(dbName)
      .collection(collectionName)
      .find({ IncubatorID: parseInt(req.params.InID) })
      .toArray();
    res.send({ result: true, message: "Success", data: result });
  } catch (err) {
    console.log(err);
    res.send({ result: false, message: "Fail", data: null });
  }
});

app.post("/Incubator/set", async (req, res) => {
  let dataArr = [];
  for (let i = 0; i < 14; i++) {
    let data = {
      pressure: Math.random() * (10500 - 10450) + 10450,
      temperature: Math.random() * (55 - 43) + 43,
      humidity: Math.random() * (60 - 48) + 48,
      timestamp: new Date().toLocaleString("th"),
      IncubatorID: req.body.InID,
    };

    dataArr[i] = data;
    dataArr[req.body.option] = req.body.value;
  }
  res.send(dataArr);
});

app.all("*", (req, res) => {
  res.send({ message: "Invalid URL maybe you should check it." }, 404);
});

app.listen(port, () => {
  console.log(`listening on ${port}`);
});
