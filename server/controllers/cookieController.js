
const cookieController = {};

cookieController.setCookie = (req, res, next) => {
    const cookieId = res.locals.userId;
    res.cookie('userId', cookieId);
    return next();
}

module.exports = cookieController;