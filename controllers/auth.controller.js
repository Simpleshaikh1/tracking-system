const User = require('../models/User.model');
const Token = require('../models/Token.model');
const {StatusCodes} = require('http-status-codes');
const CustomError = require('../errors');
const nodemailer = require('nodemailer')

const {
    attachCookiesToResponse,
    createTokenUser,
    sendVerificationEmail,
    sendResetPasswordEmail,
    createHash,
} = require('../utils');

const crypto = require('crypto');

// Resgister user with email and password

const register = async (req, res) =>{
    // console.log(11)
    const {email, password} = req.body;
    // console.log()

    const emailAlreadyExist = await User.findOne({email})
    // console.log(emailAlreadyExist)
    if(emailAlreadyExist){
        // console.log(1)
        // res.json({
        //   msg: 'email exists' 
        // })
        throw new CustomError.BadRequestError('Email Already Exist');
    }
    // console.log(24)

    // first logged in user should be admin
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';
    
    const verificationToken = crypto.randomBytes(40).toString('hex');
    
    const user = await User.create({
      email, 
      password,
      role,
      verificationToken
    });
    // send email
    // const origin = 'http://localhost:5000'
    
    // await sendVerificationEmail({
    //   email: user.email,
    //   verificationToken: user.verificationToken,
    //   origin,
    // });
    //send verification token back only while testing in postman
    res.status(StatusCodes.CREATED).json({
        email: user.email,
        msg: 'Success, please check your email to verify',
        verificationToken,
        // info
    });
};

// Verify Email Route

const verifyEmail = async (req, res) =>{

    const {verificationToken, email} = req.body;

    const user = await User.findOne({email});

    // console.log(user)
    if(!user){
      throw new CustomError.UnauthenticatedError('Verification failed');
    }

    if(user.verificationToken !== verificationToken){
        throw new CustomError.UnauthenticatedError('Verification failed');
    }

    (user.isVerified = true), (user.verified = Date.now());

    user.verificationToken = '';

    await user.save();

    res.status(StatusCodes.OK).json({ 
      msg: 'Email Verified' 
    });
};

// Login after email verification

//issue withh my login and logout to be resolved

const login = async (req, res, next) =>{
    const {email, password} = req.body;

    if(!email || !password){
        throw new CustomError.BadRequestError('Please provide email and password');
    }
    const user = await User.findOne({email});
    
    if(!user){
      throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    
    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect){
      throw new CustomError.UnauthenticatedError('Invalid Credentials');
    }
    
    if (!user.isVerified) {
      throw new CustomError.UnauthenticatedError('Please verify your email');
    }
    
    let tokenUser = createTokenUser(user);
    
    let  refreshToken = '';
    
    const existingToken = await Token.findOne({user: user._id});
    // console.log(existingToken)
    
    if(existingToken){
      const {isValid} = existingToken;
      if(!isValid){
        throw new CustomError.UnauthenticatedError('Invalid Credentials')
      }
      // console.log(1)
      // console.log(1)
      refreshToken = existingToken.refreshToken;
      attachCookiesToResponse({res,  user: tokenUser, refreshToken });

      //where cant set header bug is
      // res.status(StatusCodes.OK).json({user: tokenUser});
      return;

    }
  refreshToken = crypto.randomBytes(40).toString('hex');
  const userAgent = req.headers['user-agent'];
  const ip = req.ip;
  const userToken = { refreshToken, ip, userAgent, user: user._id };

  await Token.create(userToken);

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });

  // res.status(StatusCodes.OK).json({ user: tokenUser });
    
    
    
    // res.status(StatusCodes.OK).json({ user: tokenUser });
   
};

//Logout Route

const logout = async (req, res) => {

  await Token.findOneAndDelete({ user: req.user.userId });
  
  res.cookie('accessToken', 'logout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  
  // console.log('logout')
    res.cookie('refreshToken', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now()),
    });
    res.status(StatusCodes.OK).json({ msg: 'user logged out!' });
};

//FOrgot Password Route

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
      throw new CustomError.BadRequestError('Please provide valid email');
    }
  
    const user = await User.findOne({ email });
  
    const passwordToken = crypto.randomBytes(70).toString('hex');
    if (user) {

      // send email

    // const origin = 'http://localhost:5000';
    // await sendResetPasswordEmail({
    //   email: user.email, 
    //   token: passwordToken,
    //   origin,
    // });
      
    
      const tenMinutes = 1000 * 60 * 10;
      const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

  
      user.passwordToken = createHash(passwordToken);
      user.passwordTokenExpirationDate = passwordTokenExpirationDate;
      await user.save();
      // console.log(2)
    }
  
    res
      .status(StatusCodes.OK)
      .json({ msg: 'Please check your email for reset password link', token:passwordToken});

};

//Reset Password Route

const resetPassword = async ({body}, res) => {
    const { token, password } = body;
    if (!token ||  !password) {
      throw new CustomError.BadRequestError('Please provide all values');
    }
    const user = await User.findOne({ email });
  
    if (user) {
      const currentDate = new Date();
  
      if (
        user.passwordToken === createHash(token) &&
        user.passwordTokenExpirationDate > currentDate
      ) {
        user.password = password;
        user.passwordToken = null;
        user.passwordTokenExpirationDate = null;
        await user.save();
      }
    }
  
    res.status(StatusCodes.OK).json('Password reset successfully');
};


module.exports = {
    register,
    login,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
  };


