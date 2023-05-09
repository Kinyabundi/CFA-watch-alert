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
import { url } from 'inspector';

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

  try {
    const CFAMember = CFA.create(cfaInfo);
    const result = await (await CFAMember).save();
    console.log(result);
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


const queryAlerts = async () => {

  let data = JSON.stringify({
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            34.573606904790495,
            4.270479062477051
          ],
          [
            34.573606904790495,
            4.230025232393615
          ],
          [
            34.88042812147856,
            4.230025232393615
          ],
          [
            34.88042812147856,
            4.270479062477051
          ],
          [
            34.573606904790495,
            4.270479062477051
          ]
        ]
      ]
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
  const response = await axios.post(url, data, config)
  console.log(response.data);
  //return response.data;
};


// cron.schedule("* */5 * * * *", function () {
//  queryAlerts();
// });

const query_Alerts = async () => {

  let data = JSON.stringify({
    "geometry": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            34.573606904790495,
            4.270479062477051
          ],
          [
            34.573606904790495,
            4.230025232393615
          ],
          [
            34.88042812147856,
            4.230025232393615
          ],
          [
            34.88042812147856,
            4.270479062477051
          ],
          [
            34.573606904790495,
            4.270479062477051
          ]
        ]
      ]
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
  //console.log(response.data)
  returndata.forEach(async (item) => {
   // console.log(item)
    let Lat = item.latitude
    let Long = item.longitude
   // console.log(Long)
    const location = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${Lat}&lon=${Long}&type=city&lang=en&limit=3&format=json&apiKey=${geocodeApi}`);
    const locationData = await location.json();
    // console.log(locationData.results[0].formatted);
  })
  let Lat = returndata[0].latitude
  let Long = returndata[0].longitude
  const location = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${Lat}&lon=${Long}&type=city&lang=en&limit=3&format=json&apiKey=${geocodeApi}`);
  const locationData = await location.json();

 
  date = response.data?.data[0].alert__date;
  Time = response.data?.data[0].alert__time_utc;
  Count = response.data?.data[0].alert__count;
  Longitude = response.data?.data[0].longitude;
  Latitude = response.data?.data[0].latitude;
  area = locationData.results[0].formatted;

  // console.log(area)


  const alertInfo = {
    date,
    Time,
    Count,
    Longitude,
    Latitude,
    area
  }
  const alert = Alerts.create(alertInfo);

  const result = await (await alert).save();

  console.log(result)

};
cron.schedule("*/15 * * * * *", function () {
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






