const CustomError = require('../errors');
const { isTokenValid } = require('../utils/jwt');

const authenticateUser = async (req, res, next) => {
  let token;
  // check header
  // console.log(45)
  const authHeader = await req.headers.authorization;
  // console.log(authHeader ,"from-authHeader")
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
    // console.log(token,"from if")
  }
  // check cookies
  else if (req.cookies.token) {
      token = req.cookies.token;
      // console.log(token,"from elseif")
    }
    
    // console.log('outside the if')
    if (!token) {
    // console.log(token, "from !token")
    throw new CustomError.UnauthenticatedError('Authentication invalid');

  }
  try {
    const payload = await isTokenValid(token);
    // console.log(payload)

    // Attach the user and his permissions to the req object
    req.user = {
      userId: payload.user.userId,
      role: payload.user.role,
    };

    next();
  } catch (error) {
    throw new CustomError.UnauthenticatedError('is it from here');
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        'Unauthorized to access this route'
      );
    }
    next();
  };
};

module.exports = { authenticateUser, authorizeRoles };
