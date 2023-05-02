import axios from 'axios';
import qs from 'qs';
import express from 'express';
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();

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

let data = qs.stringify({
  'username': process.env.GFW_USERNAME,
  'password': process.env.GFW_PASSWORD,
});

//get access token
const getAccessToken = async () => {
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://data-api.globalforestwatch.org/auth/token',
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data : data
  };
  
  const response = await axios(config)
 return response.data.data.access_token;
}

//create api
// const createAPI = async () => {

//   let credentials = JSON.stringify({
//     "alias": "gfw",
//     "organization": "Vibranium",
//     "email": "bundi.christine22@gmail.com",
//     "domains": [],
//     "never_expires": false
//   });

//   let Authorization = await getAccessToken();
//   console.log(Authorization);

//   let config = {
//     method: 'post',
//     url: 'https://data-api.globalforestwatch.org/auth/api-key',
//     headers: { 
//       'Content-Type': 'application/json', 
//       'Authorization': `Bearer ${Authorization}`
//     },
//   };

//     const response = await axios(config, credentials);
//     // return response.data;
//     console.log(response.data);

   
// };

app.get('/query-alerts', async (req, res) => {

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
  
  const url =  'https://data-api.globalforestwatch.org/dataset/nasa_viirs_fire_alerts/latest/query';

  let config = {
    headers: { 
      'x-api-key': ApiKey, 
      'Content-Type': 'application/json'
    },
  };

  try{
    const response = await axios.post(url, data, config);
    console.log(response.data)

    res.status(200).json({
      alerts: response.data?.data,
      status: "ok",
      msg: "Alerts fetched successfully"
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      status: "error",
      msg: "Error fetching alerts"
    });
  }
});

const PORT  = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});






