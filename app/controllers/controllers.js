const { us } = require('../models/');
const utils = require('../utils/utils')
const validator = require("email-validator")
const DB = require('../db/db');
const { GenerateJWT, GenerateAT, GenerateRT } = require('../auth/jwt');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const { SendMail } = require('../utils/mail');
const { parse, stringify } = require('uuid')

require('dotenv').config();
const p = process.env
exports.notimplemented = (req, res) => {
    res.json({
        data: {
            "app_name": p.APP_NAME,
            "app_version": p.APP_VERSION,
            "app_author": p.APP_AUTHOR,
            "message": p.APP_MESSAGE,
            "status": 200,
        }
    })
}

exports.Home = (req, res) => {
    res.json({
        data: {
            message: "welcome to home Bruh!!"
        }
    })
}

exports.Registration = async (req, res) => {
    if (Object.keys(req.body).length === 0) {
        res.status(400).json({
            error: "body not found",
            status: 400
        })
    } else {
        if (req.body.password.length < 6) {
            res.status(403).json({
                error: "we dont ask for your dicks size. please write a valid password.",
                status: 403
            })
        }
        const hashPass = await utils.HashPass(req.body.password)
        validator.validate(req.body.email)
        const isExist = DB.CheckUserExist(res, req.body.email)
        const otp = utils.GenerateOTP(6)
        const newUser = new us({
            name: req.body.name,
            gender: req.body.gender,
            skill: req.body.skill,
            email: req.body.email,
            password: hashPass,
            otp: otp,
        })
        const Save = newUser.save()
        const user = DB.GetUserByEmail(res, req.body.email)
        Save.then((doc) => {
            if (doc) {
                SendMail(doc.name, doc.email, "Activate your account", res, otp, doc._id)
                res.status(200).json({
                    data: {
                        id: doc._id,
                        name: doc.name,
                        skills: doc.skill,
                        gender: doc.gender,
                        email: doc.email,
                    },
                    message: "please active your account",
                })
            }
        }).catch((err) => {
            utils.CheckError(err, "Active Account handler")
            res.status(500).json({
                error: err.message,
                status: 500
            })
        })
    }
}

exports.ActiveAccount = async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) {
            res.status(400).json({
                error: "body not found",
                status: 400
            })
        } else {
            const userotp = req.body.otp
            if (userotp === "") {
                res.status(401).json({
                    error: "otp must not be empty",
                    status: 401
                })
            }
            const userid = req.params.userid.trim()
            if (userid === "") {
                res.status(401).json({
                    error: "userid missing!!",
                    status: 401
                })
            }
            const user = DB.GetUserByUserId(res, userid)
            user.then((use) => {
                if (use.otp != userotp) {
                    res.status(400).json({
                        error: "user otp not matched",
                        status: 400
                    })
                } else {
                    if (use.active) {
                        res.status(400).json({
                            error: "otp expired",
                            status: 400
                        })
                    }
                    const filter = { _id: userid }
                    const update = { active: true }
                    const ua = DB.UserActive(filter, update)
                    ua.then((doc) => {
                        if (doc) {
                            res.status(200).json({
                                message: "user activated.please login",
                                status: 200
                            })
                        }
                    }).catch(err => {
                        utils.CheckError(err.message, "User Active")
                        res.status(404).json({
                            error: "user not found",
                            status: 404
                        })
                    })
                }
            }).catch(err => {
                utils.CheckError(err, "Active account handler user")
                res.status(500).json({
                    error: "body not found",
                    status: 500
                })
            })
        }
    } catch (err) {
        utils.CheckError(err, "Active Account handler")
        res.status(500).json({
            error: "Internal server error",
            status: 500
        })
    }
}

exports.Login = async (req, res) => {
    try {
        try {
            if (Object.keys(req.body).length === 0) {
                res.status(400).json({
                    error: "body not found",
                    status: 400
                })
            } else {
                if (req.body.email === "" || req.body.password == "") {
                    res.send(204).json({
                        error: "all field must not be empty",
                        status: 204,
                    })
                } else {
                    validator.validate(req.body.email)
                    const user = await DB.GetUserByEmail(res, req.body.email)
                    bcrypt.compare(req.body.password, user.password).then(isValid => {
                        if (!isValid) {
                            res.send(401).json({
                                error: "Inavlid password"
                            })
                        } else {
                            let date = new Date();
                            if (!user.active) {
                                res.status(401).json({
                                    error: "active your account first.check your email",
                                    status: 401
                                })
                            } else {
                                let atoken = GenerateAT(user._id, user.email)
                                let rtoken = GenerateRT(user._id)
                                res.cookie("access_token", "Bearer " + atoken, {
                                    expires: new Date(moment().add(15, 'minutes').toDate()),
                                    httpOnly: true,
                                })
                                res.cookie("refresh_token", "Bearer " + rtoken, {
                                    expires: new Date(moment().add(1, 'months').toDate()),
                                    httpOnly: true,
                                })
                                res.status(200).json({
                                    message: "success",
                                    status: 200,
                                })
                            }

                        }
                    })
                }
            }
        } catch (err) {
            utils.CheckError(err.message, "login")
            res.status(500).json({
                error: "wrong credentials combination"
            })
        }
    } catch (error) {
        utils.CheckError(error.message, "Login ")
        return error;
    }
}

exports.SendOTP = async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) {
            res.status(400).json({
                error: "body not found",
                status: 400
            })
        } else {
            const email = req.body.email
            validator.validate(email)
            if (email === "") {
                res.status(400).json({
                    error: "email must not be empty!!",
                    status: 400
                })
            }
            const otp = utils.GenerateOTP(6)
            const filter = { email: email }
            const update = { otp: otp, updated_at: Date.now() }
            const ua = await DB.UserActive(filter, update)
            const isUser = DB.CheckUserExist(res, email)
            isUser.then((user) => {
                if (user) {
                    SendMail(user.name, user.email, "Forgot your account Password", res, otp, user._id)
                }
            }).catch(err => {
                utils.CheckError(err)
                res.status(404).json({
                    error: "no user associated with that email",
                    status: 404
                })
            })
        }
    } catch (err) {
        utils.CheckError(err.message, "send otp")
        res.status(400).json({
            error: "something is fishy",
            status: 400
        })
    }
}

exports.ForgotPassword = async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) {
            res.status(400).json({
                error: "body not found",
                status: 400
            })
        } else {
            const userotp = req.body.otp
            if (userotp === "") {
                res.status(401).json({
                    error: "otp must not be empty",
                    status: 401
                })
            }
            const userid = req.params.userid.trim()
            if (userid === "") {
                res.status(401).json({
                    error: "userid missing!!",
                    status: 401
                })
            }
            const user = DB.GetUserByUserId(res, userid)
            user.then((use) => {
                if (use.otp != userotp) {
                    res.status(400).json({
                        error: "user otp not matched",
                        status: 400
                    })
                } else {
                    const f = { _id: userid }
                    const u = { otp: 0 }
                    const _ = DB.UserActive(f, u)
                    if (req.body.password != req.body.cpassword) {
                        res.status(400).json({
                            error: "password does not match",
                            status: 400
                        })
                    } else {
                        const hashPass = utils.HashPass(req.body.password)
                        hashPass.then(pass => {
                            const filter = { _id: userid }
                            const update = { password: pass, updated_at: Date.now() }
                            const ua = DB.UserActive(filter, update)
                            ua.then((doc) => {
                                if (doc) {
                                    res.status(200).json({
                                        message: "password changed",
                                        status: 200
                                    })
                                }
                            }).catch(err => {
                                utils.CheckError(err.message, "forget pass")
                                res.status(404).json({
                                    error: "user not found",
                                    status: 404
                                })
                            })
                        }).catch(err => {
                            res.status(400).json({
                                error: "bad request",
                                status: 400
                            })
                        })
                    }
                }
            }).catch(err => {
                utils.CheckError(err, "forget pass user")
                res.status(500).json({
                    error: "body not found",
                    status: 500
                })
            })
        }
    } catch (err) {
        utils.CheckError(err.message, "forgot pass")
        res.status(400).json({
            error: "something is fishy",
            status: 400
        })
    }
}

exports.Logout = (req, res) => {
    res.cookie("access_token", "", {
        expires: new Date(moment().subtract(15, 'minutes').toDate()),
        httpOnly: true,
    })
    res.cookie("refresh_token", "", {
        expires: new Date(moment().subtract(1, 'months').toDate()),
        httpOnly: true,
    })
    res.status(200).json({
        succes: "success",
        status: 200
    })
}