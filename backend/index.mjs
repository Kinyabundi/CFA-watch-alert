import axios from 'axios';
import express from 'express';
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import connectDB from "./connectdb.mjs";
import mongoose from "mongoose";
import CFA from "./models/cfa_member.mjs";
import Alerts from "./models/alertsInfo.mjs";
import cron from "node-cron";
import fetch from 'node-fetch'; 
import { url } from 'inspector';
import { log } from 'console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();

connectDB();

mongoose.set("strictQuery", false);

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS,GET,POST,PUT,PATCH,DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const ApiKey = process.env.API_KEY;
const geocodeApi = process.env.GEOCODER_API_KEY

app.post('/add-cfaMember', async (req, res) => {
  const cfaInfo = req.body;
  const location = req.body.location;
  console.log(location)
  const response = await axios.get(`https://api.geoapify.com/v1/geocode/search?text=${location}%20county%2C%20Kenya&limit=1&format=json&apiKey=${geocodeApi}`);
  const data = await response.data; 
  const longitude = data.results[0].lon;
  const latitude = data.results[0].lat;
  try {
    const CFAMember = CFA.create({...cfaInfo, longitude,latitude});
    const result = await (await CFAMember).save();
    //console.log(result);
    res.status(201).json({
      status: "ok",
      data: result,
      msg: "CFA member added successfully"
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "error",
      msg: "Error adding CFA member"
    });
  }
});
app.get('/get-cfaMember', async (req,res) => {
  try {
    const cfa_member = await CFA.find();
   // console.log(cfa_member);
    res.status(200).json({
      status: "ok",
      data: cfa_member,
      msg: "CFA Info fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "error",
      msg: "Error fetching alerts",
    });
  }
})




const query_Alerts = async () => {

  let data = JSON.stringify({
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            36.45967072012695,
            0.7796484821584784
          ],
          [
            36.45967072012695,
            -1.8457405568735936
          ],
          [
            38.67890900137752,
            -1.8457405568735936
          ],
          [
            38.67890900137752,
            0.7796484821584784
          ],
          [
            36.45967072012695,
            0.7796484821584784
          ]
        ]
      ],
    },
    "sql": "SELECT longitude, latitude, alert__date, alert__time_utc, alert__count FROM results WHERE alert__date >= '2021-01-10' AND alert__date <= '2023-01-01' "
  });

  const url = 'https://data-api.globalforestwatch.org/dataset/nasa_viirs_fire_alerts/latest/query';

  let config = {
    headers: {
      'x-api-key': ApiKey,
      'Content-Type': 'application/json'
    },
  };

  let date = null;
  let Time = null;
  let Count = null;
  let Longitude = null;
  let Latitude = null;
  let area = null;


  const response = await axios.post(url, data, config);
   //console.log(response.data);


  const stateLocation = [];
 
   const returndata = response.data?.data;
   const newData = returndata.slice(0,20)
   console.log(newData)
  //  for (let i = 0; i < newData.length; i++) {
  //   let info = await axios.get(
  //     `https://api.geoapify.com/v1/geocode/reverse?lat=${newData[i].latitude}&lon=${newData[i].longitude}&type=city&lang=en&limit=3&format=json&apiKey=${geocodeApi}`
  //   );

  //   stateLocation.push(info.data.results[0].formatted);

  //   //console.log(info.data.results[0].formatted);
  // }

   let alertsInfo = []
  newData.forEach((item) => {
  alertsInfo.push ({
    date: item.alert__date,
    time: item.alert__time_utc,
    count: item.alert__count,
    Longitude:item.longitude,
    Latitude:item.latitude
  })
 })

 console.log(alertsInfo)
const bulk_ops = alertsInfo.map(doc => ({
  updateOne:{
    filter: {
      date: doc.date,
      Time: doc.time,
      Count: doc.count,
      Longitude:doc.Longitude,
      Latitude: doc.Latitude
    },
    update: doc,
    upsert: true,
  }
}))
 const alerts = await Alerts.bulkWrite(bulk_ops)
 console.log(alerts)
 
};
cron.schedule("*/1* * * * *", function () {
  query_Alerts();
});

// get all alerts
app.get("/get-alerts", async (req, res) => {
  try {
    const alerts = await Alerts.find();
    //console.log(alerts);
    res.status(200).json({
      status: "ok",
      data: alerts,
      msg: "Alerts fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "error",
      msg: "Error fetching alerts",
    });
  }
});


//send OTP
app.post("/send-otp", async (req, res) => {
  // console.log(`Received message: \n ${data}`);
  // res.sendStatus(200);
  try {
    await sendOTP(req.body.msg, req.body.to);

    res.status(200).json({
      status: "ok",
      msg: "OTP sent successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "error",
      msg: "An error was encountered",
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});






