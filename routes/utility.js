// middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    return next();
}
module.exports = {
    isLoggedIn

}