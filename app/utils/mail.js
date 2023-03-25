const nm = require('nodemailer')
const { CheckError, GenerateOTP } = require('./utils')

exports.SendMail = (user, email, sub, res, otp, userid) => {
    var tp = nm.createTransport({
        service: "gmail",
        auth: {
            user: 'projectrec69@gmail.com',
            pass: 'qdvepmykmcvtcdcw',
        }
    })
    
    var options = {
        from: 'noreply@mrkala.dev',
        to: email,
        subject: sub,
        html: `Hello ${user},<br/>
               Your code is ${otp}<br/>
               <a href="http://localhost:3000/active-user/${userid}">Click here</a> Activate your account.`
    }

    try {
        tp.sendMail(options, (err, info) => {
            if (err) {
                CheckError(err, "send mail")
            } else {
                console.log(info.response)
                res.status(200).json({
                    message: "Check your inbox for Account Recovery",
                    status: 200
                })
            }
        })
    } catch (err) {
        CheckError(err, "Mail")
    }
}