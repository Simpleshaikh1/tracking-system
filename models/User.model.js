const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: [true, 'Please provide name'],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'Email is required'],
    validate: {
      validator: validator.isEmail,
      message: 'Check your email field',
    },
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
  confirmPassword: {
    type: String,
    // required: [true, 'confirm your password is correct']

  },
  profilePicture: {
    type: String,
    default: 'default.png'
  },
  phone: {
    type: Number
  },
  birthday: {
    type:String
  },
  address: {
    type: String
  },
  gender: {
    type:String
  },
  location: {
    type:String
  },
  skills: {
    type: String
  },
  tools: {
    type:String
  },
  aboutMe: {
    type: String
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    // default: 'user',
  },
  verificationToken: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  verified: Date,
  passwordToken: {
    type: String,
  },
  passwordTokenExpirationDate: {
    type: Date,
  },
});

UserSchema.pre('save', async function () {
  
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  this.confirmPassword = undefined
});

UserSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', UserSchema);
