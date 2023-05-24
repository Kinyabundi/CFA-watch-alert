import mongoose from "mongoose";

const AlertsSchema = new mongoose.Schema(
    {
        date: {
            type: String,
            required: true,
        },
        time: {
            type: String,
            required: true,
        },
        county: {
            type: String,
        },
        count: {
            type: Number,
            required: true, 
        },
    },
);

const Alerts = mongoose.model('Alerts', AlertsSchema);

export default Alerts;