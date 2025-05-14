const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema({
    title: String,
    date: Date,
    location: String,
    ticketPrice: Number,
    capacity: Number,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}
, { timestamps: true });
const Event = mongoose.model('Event', eventSchema);
module.exports = Event; 