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
 
  insuranceProvider: { type: String },
  insuranceNumber: { type: String },
  groupNumber: { type: String },
  policyholderName: { type: String },
  relationshipToPolicyholder: { type: String },
  effectiveDate: { type: String },
  expirationDate: { type: String },
  insuranceCardImage: { type: String, default: null },
 
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Insurance', InsuranceSchema);
