const jwt = require("jsonwebtoken");
const blacklistmodel = require("../models/blacklist.model");





async function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization || "";
    const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;
    const token = req.cookies?.token || bearerToken;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }


    const isTokenBlacklisted = await blacklistmodel.findOne({ token });

    if (isTokenBlacklisted) {
        return res.status(401).json({ message: "Token has been invalidated" });
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded user information to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }   
}

module.exports = {authMiddleware};
