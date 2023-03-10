const CustomApiError = require('../errors');

const checkPermissions = (requestUser, resourceUserId) => {
    if(requestUser.role === 'admin') return;
    if(requestUser.userId === resourceUserId.toString()) return;

    throw new CustomApiError.UnauthorizedError(
        'Not authorized to access this route'
    );
};

module.exports = checkPermissions;