import mongoose from "mongoose";

const AlertsSchema = new mongoose.Schema(
    {
        date: {
            type: String,
            required: true,
        },
        Time: {
            type: String,
            required: true,
        },
        Longitude: {
            type: String,
            required: true,
        },
        Latitude: {
            type: String,
            required: true,
        },
        Count: {
            type: Number,
            required: true, 
        },
    },
);

const Alerts = mongoose.model('Alerts', AlertsSchema);

export default Alerts;