const cors = require('cors');
const corsOptions = {
    origin: "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    optionsSuccessStatus: 200
}
const cookieParser = require("cookie-parser");
const ia = require('../auth/auth')

const NewRoutes = (app, express, ct, us,) => {
    app.use(cors(corsOptions))
    app.use(express.json(), cookieParser());
    app.use(express.urlencoded({ extended: true }))

    app.get('/', ia.IsAuth, ct.Home)
    app.post('/login', ct.Login)
    app.post('/signup', ct.Registration)
    app.post('/active-user/:userid', ct.ActiveAccount)
    app.post('/changePassword', ct.SendOTP)
    app.post('/forgotPassword/:userid', ct.ForgotPassword)
    app.post('/profile', ct.notimplemented)
    app.post('/jobApplication', ct.notimplemented)
    app.post('/alerts', ct.notimplemented)
    app.post('/search', ct.notimplemented)
    app.post('/chat', ct.notimplemented)
    app.post('/videoChat', ct.notimplemented)
    app.post('/reviews', ct.notimplemented)                                 //OPtional

    app.post('/logout', ct.Logout)
}

module.exports = { NewRoutes }