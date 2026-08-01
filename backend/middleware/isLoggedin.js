const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
    const token = req.cokkies.token;
    if (!token) {
        req.flash("error", "You are not logged in")
        res.redirect("/")
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_KEY);
        const user = await userModel.findOne({ email: decode.email }).select("-password");
        res.user = user;
        next();
    } catch (error) {
        req.flash("error", "You are not logged in")
        res.redirect("/")
    }

}