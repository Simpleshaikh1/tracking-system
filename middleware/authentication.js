const CustomError = require('../errors');
const { isTokenValid } = require('../utils');
const Token = require('../models/Token.model');
const { attachCookiesToResponse } = require('../utils');


const authenticateUsers = async (req, res, next) => {
  const { refreshToken, accessToken } = req.signedCookies;
  // console.log('abeg work na')
  try {
    // console.log(1)
    if (accessToken) {
      const payload = await isTokenValid(accessToken);
      req.user = payload.user;
      return next();
    }
    const payload = isTokenValid(refreshToken);

    const existingToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken,
    });
    // console.log(2)


    if (!existingToken || !existingToken?.isValid) {
      throw new CustomError.UnauthenticatedError('Authentication Invalid');
    }

    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });

    req.user = payload.user;
    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError('Authentication Invalid');
  }
};

const authorizePermissions = (...roles) => {
  // console.log(2)
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        'Unauthorized to access this route'
      );
    }
    next();
  };
};

module.exports = {
  authenticateUsers,
  authorizePermissions,
};
