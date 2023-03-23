const jwt = require("jsonwebtoken");
const ExtractToken = require("./jwt");

exports.IsAuth = async (req, res, next) => {
    let cookies = {}
    try {
        const tokenArray = req.headers.cookie.split(";");
        tokenArray.forEach((cookie) => {
            const [key, value] = cookie.trim().split('=');
            cookies[key] = decodeURI(value);
        });
        const access_token = cookies["access_token"]
        if (access_token === "") {
            res.send(401).send({
                "error": "unauthorized",
                "status": 401,
            })
        }
        const newToken = access_token.split(" ")
        if (newToken.length === 2) {
            const claims = await jwt.verify(newToken[1], process.env.APP_SECRET)
            if (claims.exp < Date.now() / 1000) {
                res.status(401).json({
                    error: "invalid or expired JWT",
                    status: 401
                })
            }
        }
        return next();
    } catch (err) {
        res.status(401).json({
            error: "Missing or mlaformed token",
            status: 401,
        })
    }
}