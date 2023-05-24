import axios from "axios";
import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import connectDB from "./connectdb.mjs";
import mongoose from "mongoose";
import CFA from "./models/cfa_member.mjs";
import Alerts from "./models/alertsInfo.mjs";
import {
  bulk_predict1,
  getCounties,
  removeDuplicates,
} from "./utils.mjs";
import cron from "node-cron";
import sendSMS from "./sendSMS.mjs";

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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const ApiKey = process.env.API_KEY;
const geocodeApi = process.env.GEOCODER_API_KEY;

app.post("/add-cfaMember", async (req, res) => {
  const cfaInfo = req.body;
  const location = req.body.location;
  console.log(location);
  const response = await axios.get(
    `https://api.geoapify.com/v1/geocode/search?text=${location}%20county%2C%20Kenya&limit=1&format=json&apiKey=${geocodeApi}`
  );
  const data = await response.data;
  const longitude = data.results[0].lon;
  const latitude = data.results[0].lat;
  try {
    const CFAMember = CFA.create({ ...cfaInfo, longitude, latitude });
    const result = await (await CFAMember).save();
    //console.log(result);
    res.status(201).json({
      status: "ok",
      data: result,
      msg: "CFA member added successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: "error",
      msg: "Error adding CFA member",
    });
  }
});

app.get("/get-all-cfas", async (req, res) => {
  try {
    const cfa_member = await CFA.find();
    //console.log(cfa_member);
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
});

const getCFA = async (countyName) => {
  try {
    const cfa = await CFA.find({ $text: { $search: countyName } });
    return cfa;
  } catch (err) {
    console.error(err);
  }
};

//check if the alert object is unique
const saveAlertsToDB = async (items) => {
  const savedItems = [];
  for (const item of items) {
    try {
      const { date, time } = item;
      const existingItem = await Alerts.findOne({ date, time });
      if (!existingItem) {
        const alert = await Alerts.create(item);
        const savedAlert = await alert.save();
        savedItems.push(savedAlert);
        console.log("Saved item:", savedAlert);
      }
    } catch (error) {
      console.log("Error saving item:", error);
    }
  }
  return savedItems;
};


const query_Alerts = async () => {
  let data = JSON.stringify({
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          [36.45967072012695, 0.7796484821584784],
          [36.45967072012695, -1.8457405568735936],
          [38.67890900137752, -1.8457405568735936],
          [38.67890900137752, 0.7796484821584784],
          [36.45967072012695, 0.7796484821584784],
        ],
      ],
    },
    sql: "SELECT longitude, latitude, alert__date, alert__time_utc, alert__count FROM results WHERE alert__date >= '2021-01-10' AND alert__date <= '2023-01-01' ",
  });

  const url =
    "https://data-api.globalforestwatch.org/dataset/nasa_viirs_fire_alerts/latest/query";

  let config = {
    headers: {
      "x-api-key": ApiKey,
      "Content-Type": "application/json",
    },
  };

  const response = await axios.post(url, data, config);
  //console.log(response.data);

  const returndata = response.data?.data; // array of objects



  const locationsInfo = await bulk_predict1(returndata);

  const uniqueItems = removeDuplicates(locationsInfo);

//save alerts to database

const savedItems = await saveAlertsToDB(uniqueItems);
console.log("Saved items:", savedItems);


  const counties = getCounties(uniqueItems);

   // using Promise.all get all CFA members

   const cfaMembers = [];

   await Promise.allSettled(
     counties.map(async (county) => {
       const cfa = await getCFA(county);
 
       cfaMembers.push(cfa?.[0]);
     })
   );
    // remove undefined items by filtering
  const filteredCFAs = cfaMembers.filter((item) => item !== undefined);
 console.log(filteredCFAs)
  // if filtered CFA length is greater than 1 send an sms
  if (filteredCFAs.length > 1) {
    await Promise.all(
      filteredCFAs.map(async (cfa) => {
        //save the sms 
        //save feedback 
        //add reply option 
        await sendSMS(`Hello ${cfa.name}. A fire alert for ${cfa.location} forest has been triggered. You are requested to please confirm and reply with either 1, 2, or 3. 1 for Illegal activity (non-licensed logging), 2 for a Natural occurrence, 3 for Legal activity (licensed logging)`,
        cfa.phoneNo);
      })
    );
  }

};


// cron.schedule("**/1 * * * *", function () {
//   query_Alerts();
// });
query_Alerts();

// get all alerts
app.get("/get-alerts", async (req, res) => {
  try {
    const alerts = await Alerts.find();
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

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
