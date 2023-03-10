const User = require('../models/User.model');
const {StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const path = require('path');

const {
    createTokenUser,
    attachCookiesToResponse,
    checkPermissions,
} = require('../utils');

const getAllUsers = async(req, res)=>{
    // console.log(1)
    const users = await User.find({role:'user'}).select('-password');

    res.status(StatusCodes.OK).json({users})
};

const getSingleUser = async(req,res)=>{
    const user = await User.findOne({_id: req.params.id}).select('-password');

    if(!user){
        throw new CustomError.NotFoundError(`No user with id: ${req.params.id}`);
    }
    checkPermissions(req.user, user._id);
    res.status(StatusCodes.OK).json({user});
};

const showCurrentUser = async(req, res)=>{
    res.status(StatusCodes.OK).json({user: req.user})
};

const updateUser = async(req, res) =>{
    const {email, name, phone, address, location, gender, birthday, skills, tools, profilePicture, aboutMe} = req.body

    if(!email || !name){
        throw new CustomError.BadRequestError('Please provide all values');
    }

    const user = await User.findOne({ _id: req.user.userId });

     user.email = email;
     user.name = name;
     user.phone = phone;
     user.location = location, 
     user.gender = gender,
     user.address = address,
     user.birthday = birthday,
     user.skills = skills,
     user.tools = tools,
     user.profilePicture = profilePicture,
     user.aboutMe = aboutMe,

     await user.save();

     const tokenUser = createTokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({ user: tokenUser });
};

const updateUserPassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      throw new CustomError.BadRequestError('Please provide both values');
    }
    const user = await User.findOne({ _id: req.user.userId });
  
    const isPasswordCorrect = await user.comparePassword(oldPassword);
    if (!isPasswordCorrect) {
      throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    user.password = newPassword;
  
    await user.save();
    res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated.' });
  };


  module.exports = {
    getAllUsers,
    getSingleUser,
    showCurrentUser,
    updateUser,
    updateUserPassword,
  };