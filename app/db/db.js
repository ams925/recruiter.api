const p = process.env
const { us } = require('../models/');
const user = require('../models/user.model');

exports.Connect = (mongoose, utils) => {
    const dns = "mongodb://"+p.DB_HOST+":"+p.DB_PORT+"/"+p.DB_NAME
    mongoose.connect(dns)
    mongoose.connection.on('connected', () => {
        console.log(`Database connection eastablished at port: ${p.DB_PORT}`)
    })
    mongoose.connection.on('error', err => {
        utils.CheckError(err, "MongoDB")
    })
}

exports.GetUserByEmail = async (res, email) => {
    const user = await us.findOne({email: email})
    return user
}

exports.GetUserByUserId = async (res, id) => {
    const user = await us.findOne({_id: id})
    return user
}

exports.UserActive = async (filter, update) => {
    let user = await us.findOneAndUpdate(filter, update)
    return user
}

exports.CheckUserExist = async (res, email) => {
    try {
        const user = await us.findOne({email: email})
        return user
    } catch(err) {
        return err
    }
}