const {StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken');
const {promisify} = require('util')

const createJWT = ({payload}) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return token;
};

const isTokenValid = async (token) =>{
 return  await promisify(jwt.verify)(token, process.env.JWT_SECRET);

};

const attachCookiesToResponse = ({res, user, refreshToken}) =>{
    // console.log(4)
    const accessTokenJWT = createJWT({payload: {user}});
    const refreshTokenJWT = createJWT({payload: {user, refreshToken}});

    const oneDay = 1000 * 60 * 60 * 24;
    const longExp = 1000 * 60 * 60 * 24 * 30;

    res.cookie('accessToken', accessTokenJWT, {
        httpOnly: true, 
        secure : process.env.NODE_ENV === 'production',
        signed: true,
        expires: new Date(Date.now() + oneDay)
    });

    res.cookie('refreshToken', refreshTokenJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        signed: true,
        expires: new Date(Date.now() + longExp),
      });

     res.status(StatusCodes.OK).json({ token: accessTokenJWT, msg: 'successfully logged in', data:user});

    //  return
    };
    // console.log('jwt')

module.exports = {
    createJWT,
    isTokenValid,
    attachCookiesToResponse,
  };