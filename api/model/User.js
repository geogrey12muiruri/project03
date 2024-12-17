const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    username: { type: String },
    email: { type: String, required: true },
    password: { type: String, required: false },
    verificationCode: {
      type: String,
      required: false,
    },
    verificationCodeExpires: {
      type: Date,
      required: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    loginMethod: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    dateOfBirth: { type: Date },
    gender: { type: String },
    insuranceProvider: { type: String },
    preferences: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      zipCode: { type: String },
      emailNotifications: { type: Boolean, default: true },
      pushNotifications: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

//Compile to form the model
module.exports = mongoose.model("User", userSchema);
