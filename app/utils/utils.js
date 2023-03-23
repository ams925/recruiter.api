const bcrypt = require('bcryptjs')
exports.HashPass = async (password) => {
    const s = 10
    var hashpw = await bcrypt.hash(password, s)
    return hashpw
}

exports.ComparePass = async (hash, userpass) => {
    const isValid = await bcrypt.compare(userpass, hash)
    return isValid
}

exports.GenerateOTP = (length = 6) => {
    let otp = ''
    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    for (let i = 0; i < length; i++) {
        const index = Math.floor(Math.random() * characters.length)
        otp += characters[index]
    }

    return otp
}

exports.CheckError = (err, message) => {
    if (err !== null && err != '') {
        console.log(`Error in ${message}: ${err.message}`)
    }
}