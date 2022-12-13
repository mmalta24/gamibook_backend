const jwt = require("jsonwebtoken");
const config = require("../config/config");

exports.verifyToken = (req, res, next) => {
    const header = req.headers["x-access-token"] || req.headers.authorization;
    if (typeof header == "undefined")
        return res.status(401).json({
            success: false,
            message: "Must be authenticated with a token to access this information!",
        });
    const bearer = header.split(" "); // Authorization: Bearer <token>
    const token = bearer[1];
    console.log(token);
    try {
        let decoded = jwt.verify(token, config.SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized!"
        });
    }
};