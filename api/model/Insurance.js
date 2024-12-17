const mongoose = require('mongoose');

const InsuranceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Insurance', InsuranceSchema);
