// const AfricasTalking = require('africastalking');

import AfricasTalking from "africastalking";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, ".env") });

const africastalking = AfricasTalking({
  apiKey: process.env.AFRICASTALKING_APIKEY,
  username: process.env.AFRICASTALKING_USERNAME,
});

export default async function sendSMS(msg, to) {
  // TODO: Send message
  try {
    const result = await africastalking.SMS.send({
      to: [to],
      message: msg,
      from: "VibraniumID",
    });
    
    console.log(result);
  } catch (ex) {
    console.error(ex);
  }
}
