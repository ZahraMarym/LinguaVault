const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  name: { type: String, required: true },
  cnic: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  audios: { type: [String], default: [] }, // Storing file paths as strings
});

module.exports = mongoose.model('Record', recordSchema);
