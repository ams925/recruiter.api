const dotenv = require('dotenv');
const jwt = require('jsonwebtoken')
const secret = process.env.APP_SECRET || "cypher"
dotenv.config();
exports.GenerateAT = (uid, email) => {
    const access_token = jwt.sign({
        user_id: uid,
        email,
    }, secret, {
        expiresIn: "15m",
    })
    return access_token
}

exports.GenerateRT = (uid) => {
    refresh_token = jwt.sign({
        user_id: uid,
    }, secret, {
        expiresIn: "1y",
    })
    return refresh_token
}

exports.ExtractToken = async (token) => {
    try {
        const claims = await jwt.verify(token, secret)
        return claims
    } catch (err) {
        return err
    }
}