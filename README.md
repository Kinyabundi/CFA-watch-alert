
# Forest Cover Reporting Tool

This is a tool aimed at individuals and organiz
ations concerned with identifying and monitoring the extent of Forest Cover Loss.



# How it works
The Forest Cover Reporting tool consists of a dashboard that receives alerts on forest cover loss from the Global Forest Watch (an external API) and an SMS module that relays alerts as text messages to the concerned Community Forest Association Representatives. CFA Reps will receive points based on their activity over time. These points will translate to cryptocurrency tokens, farming implements, or direct cash to the CFA Reps’ mobile number.

The dashboard is intended for use by an Administrator from one of the organizations earlier described, who:
- Views all alerts received from GFW
- Adds, and manages CFA Reps
- Views and Exchanges feedback with CFA Reps

The SMS module serves as the reporting channel that: 
- Relays alerts from the Dashboard to the CFA Reps
- Aggregates feedback from CFA Reps

# How it was built
 # Backend Setup and Configuration
Backend was built using Node.js and Express.js.  The backend connects to a MongoDB database and performs various operations, including fetching and storing data.

## Prerequisites

Before running the backend server, make sure you have the following:

- Node.js installed on your system
- MongoDB Atlas account or a local MongoDB server running

## Installation

To install and run the backend, follow these steps:

1. Clone the repository to your local machine.
2. Open a terminal and navigate to the project's root directory.
3. Install the dependencies by running the following command:

   ```shell
   yarn or npm install
   ```

4. Create a `.env` file in the project's root directory and add the following environment variables:

   ```plaintext
   MONGO_URI=<your_mongodb_uri>
   API_KEY=<your_api_key>
   GEOCODER_API_KEY=<your_geocoder_api_key>
   AFRICASTALKING_USERNAME=<your_africastalking_username>
   AFRICASTALKING_APIKEY=<your_africastalking_apikey>
   ```

   Replace `<your_mongodb_uri>` with the connection URI for your MongoDB database. If you don't have one, you can create a free account on MongoDB Atlas (https://www.mongodb.com/cloud/atlas) and obtain the connection URI there. Also, provide the necessary API keys for your application.

5. Start the server by running the following command:

   ```shell
   yarn backend
   ```

   The server should now be running on `http://localhost:5000`.

## API Endpoints

The backend server exposes the following API endpoints:

- `GET /` - Returns a simple "Hello World!" message to verify the server's connectivity.
- `POST /add-cfaMember` - Adds a new CFA (Conservancy Forest Association) member to the database.
- `GET /get-all-cfas` - Retrieves all CFA members from the database.
- `GET /get-alerts` - Retrieves all fire alerts from the database.

## Background Process

The backend includes a background process that runs periodically using `node-cron` library. This process performs the following tasks:

1. Query fire alerts from an external API(https://data-api.globalforestwatch.org/) using an API key. The external API is Global Forest Watch API for remote sensing for forest cover loss.
2. Process the returned data and predict the counties for each fire alert.
3. Remove duplicate alerts and store the unique alerts in the database.
4. Get the unique counties from the alerts and fetch corresponding CFA members from the database.
5. Send SMS notifications to the CFA members using the Africastalking API (implemented in `sendSMS.mjs`).

The background process is scheduled to run at regular intervals and automatically handle fire alerts and CFA member notifications.

## Additional Files

The repository includes additional files that provide utility functions:

- `utils.mjs` - Contains utility functions used by the background process, including predicting counties, processing data, and removing duplicates.
- `connectdb.mjs` - Establishes a connection to the MongoDB database using Mongoose.
- `sendSMS.mjs` - Implements the logic for sending SMS notifications to CFA members using the Africastalking API.
- `data/counties.json` - A JSON file containing county data used for predicting the counties of fire alerts.

## Conclusion

This backend application provides the necessary APIs and background processes to handle CFA member registration, fire alert processing, and CFA member notifications. With the server running, you can integrate it with a frontend application to create a complete web application for managing CFA members and fire alerts.
   

