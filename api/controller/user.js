const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../model/User");
const nodemailer = require("nodemailer");
const Professional = require("../model/professional.model");
const Patient = require("../model/patient.model");

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Helper function to send email
const sendVerificationEmail = async (email, verificationCode) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification",
    text: `Your verification code is: ${verificationCode}`,
  };

  return transporter.sendMail(mailOptions);
};

// Calculate profile completion percentage
const calculateProfileCompletion = (profile) => {
  const fields = ["firstName", "lastName", "dateOfBirth", "gender", "insuranceProvider"];
  const filledFields = fields.filter((field) => profile[field]);
  return (filledFields.length / fields.length) * 100;
};

// User Controller
const userCtrl = {
  register: asyncHandler(async (req, res) => {
    let { email, password, firstName, lastName, userType } = req.body;

    if (!email || !password || !firstName || !lastName || !userType) {
      throw new Error("All fields are required, including userType.");
    }

    const userExists = await User.findOne({ email: String(email) });
    if (userExists) {
      throw new Error("User already exists.");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expirationTime = Date.now() + 15 * 60 * 1000;

    const userCreated = await User.create({
      username: `${firstName} ${lastName}`,
      firstName,
      lastName,
      password: hashedPassword,
      email: String(email),
      verificationCode,
      verificationCodeExpires: expirationTime,
      isVerified: false,
      userType,
    });

    if (userType === "professional") {
      await Professional.create({
        firstName,
        lastName,
        user: userCreated._id,
      });
    } else if (userType === "patient") {
      await Patient.create({
        name: `${firstName} ${lastName}`,
        email: String(email),
        userId: userCreated._id,
      });
    } else {
      throw new Error("Invalid userType. Must be 'professional' or 'patient'.");
    }

    res.status(201).json({
      message: "User registered successfully",
      userId: userCreated._id,
    });
  }),

  // Login Functionality
  login: asyncHandler(async (req, res) => {
    let { email, password } = req.body;

    const user = await User.findOne({ email: String(email) });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    if (user.loginMethod === "google") {
      throw new Error("Please use Google login to access your account.");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "30d" });

    const { password: _, ...userWithoutPassword } = user.toObject();

    let professionalId = null;
    if (user.userType === "professional") {
      const professional = await Professional.findOne({ user: user._id });
      if (professional) {
        professionalId = professional._id;
      }
    }

    res.json({
      message: "Login success",
      token,
      user: userWithoutPassword,
      professionalId,
    });
  }),

  // Remaining methods (profile, googleLogin, verifyEmail, etc.)...

  updatePatientProfile: asyncHandler(async (req, res) => {
    const { userId, fullName, preferences, ...otherFields } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const [firstName, lastName] = fullName ? fullName.split(" ") : [user.firstName, user.lastName];
    user.firstName = firstName;
    user.lastName = lastName;

    Object.assign(user, otherFields);

    if (preferences) {
      user.preferences = {
        ...user.preferences,
        ...preferences,
      };
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user,
    });
  }),

  
  googleLogin: asyncHandler(async (req, res) => {
    const { email, firstname, lastname } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        username: `${firstname} ${lastname}`,
        firstName: firstname,
        lastName: lastname,
        email,
        password: "", // No password for Google login
        isVerified: true, // Set verified status to true
        loginMethod: "google", // Set login method to Google
      });
    } else {
      if (user.loginMethod !== "google") {
        throw new Error("Please use your registered login method.");
      }
      user.isVerified = true; // Ensure existing users are verified
      await user.save();
    }
    const token = jwt.sign({ id: user._id }, "anyKey", { expiresIn: "30d" }); // Ensure token expiration is set correctly
    res.json({
      message: "Login success",
      token,
      id: user._id,
      email: user.email,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      userId: user._id, // Include userId in the response
    });
  }),

  profile: asyncHandler(async (req, res) => {
    if (!req.user || !req.user.id) {
      res.status(400).json({ message: "User ID is missing" });
      return;
    }
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json({ user: user || null });
  }),

  setPassword: asyncHandler(async (req, res) => {
    const { userId, password } = req.body;
    if (!password) {
      throw new Error("Password is required");
    }
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();
    res.json({ message: "Password set successfully" });
  }),

  verifyEmail: asyncHandler(async (req, res) => {
    try {
      const { email, verificationCode } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ error: 'Invalid email' });
      }

      // Check if the code is correct and not expired
      if (user.verificationCode !== verificationCode) {
        return res.status(400).json({ error: 'Invalid verification code' });
      }

      if (Date.now() > user.verificationCodeExpires) {
        return res.status(400).json({ error: 'Verification code has expired' });
      }

      user.isVerified = true;
      user.verificationCode = undefined;
      user.verificationCodeExpires = undefined; // Clear the expiration time
      await user.save();

      res.status(200).json({ message: 'Email verified successfully!' });
    } catch (error) {
      console.log("Error verifying email", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }),

  updateProfile: asyncHandler(async (req, res) => {
    const {
      userId,
      fullName,
      email,
      phoneNumber,
      profileImage,
    } = req.body;

    // Ensure that the user exists in the database
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Update user profile with the provided data
    user.fullName = fullName || user.fullName;
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.profileImage = profileImage || user.profileImage;

    // Save the updated user profile
    await user.save();

    // Send a success response with the updated data
    res.json({
      message: "Profile updated successfully",
      profileImage: user.profileImage,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
  }),

  updatePatientProfile: asyncHandler(async (req, res) => {
    const { userId, fullName, dateOfBirth, gender, insuranceProvider, insuranceNumber, groupNumber, policyholderName, relationshipToPolicyholder, effectiveDate, expirationDate, insuranceCardImage, preferences, address, phoneNumber, emergencyContact } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Split fullName into firstName and lastName
    const [firstName, lastName] = fullName.split(" ");

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.dateOfBirth = dateOfBirth || user.dateOfBirth;
    user.gender = gender || user.gender;
    user.insuranceProvider = insuranceProvider || user.insuranceProvider;
    user.insuranceNumber = insuranceNumber || user.insuranceNumber;
    user.groupNumber = groupNumber || user.groupNumber;
    user.policyholderName = policyholderName || user.policyholderName;
    user.relationshipToPolicyholder = relationshipToPolicyholder || user.relationshipToPolicyholder;
    user.effectiveDate = effectiveDate || user.effectiveDate;
    user.expirationDate = expirationDate || user.expirationDate;
    user.insuranceCardImage = insuranceCardImage || user.insuranceCardImage;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.emergencyContact = emergencyContact || user.emergencyContact;

    if (address) {
      user.address = {
        street: address.street || user.address.street,
        city: address.city || user.address.city,
        state: address.state || user.address.state,
        zipCode: address.zipCode || user.address.zipCode,
      };
    }

    if (preferences) {
      user.preferences = {
        emailNotifications: preferences.emailNotifications !== undefined ? preferences.emailNotifications : user.preferences.emailNotifications,
        pushNotifications: preferences.pushNotifications !== undefined ? preferences.pushNotifications : user.preferences.pushNotifications,
      };
    }

    await user.save();

    const profileCompletion = calculateProfileCompletion(user);

    res.json({
      message: "Profile updated successfully",
      profileCompletion,
    });
  }),

  requestPasswordReset: asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    // Generate a verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expirationTime = Date.now() + 15 * 60 * 1000; // Set expiration time to 15 minutes

    // Update the user with the verification code and expiration time
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = expirationTime;
    await user.save();

    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    res.status(200).json({ message: 'Verification code sent to email!' });
  }),

  resetPassword: asyncHandler(async (req, res) => {
    const { email, newPassword, verificationCode } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email' });
    }

    // Check if the verification code is correct and not expired
    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    if (Date.now() > user.verificationCodeExpires) {
      return res.status(400).json({ error: 'Verification code has expired' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear the verification code and expiration time
    user.verificationCode = undefined;
    user.verificationCodeExpires = undefined;

    // Save the updated user
    await user.save();

    res.status(200).json({ message: 'Password reset successfully!' });
  }),
};



module.exports = userCtrl;
