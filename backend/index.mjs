import axios from 'axios';
import qs from 'qs';
import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

let data = qs.stringify({
  'username': 'bundi.christine22@gmail.com',
  'password': 'Kinya?20!' 
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
const createAPI = async () => {

  let credentials = JSON.stringify({
    "alias": "gfw",
    "organization": "Vibranium",
    "email": "bundi.christine22@gmail.com",
    "domains": [],
    "never_expires": false
  });

  let Authorization = await getAccessToken();
  console.log(Authorization);

  let config = {
    method: 'post',
    url: 'https://data-api.globalforestwatch.org/auth/api-key',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${Authorization}`
    },
  };

    const response = await axios(config, credentials);
    // return response.data;
    console.log(response.data);

   
};

app.post('/query-alerts', async (req, res) => {

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
      'x-api-key': '421f6e25-af61-4268-bb4a-6dde0e94c216`', 
      'Content-Type': 'application/json'
    },
  };

  try{
    const response = await axios.post(url, data, config);
    console.log(response.data);

    res.status(200).json({
      data: response.data,
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







