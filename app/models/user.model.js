const mongoose = require("mongoose")
const { v4: uuidv4 } = require('uuid');

const user =
    new mongoose.Schema({
        _id: {
            type: String,
            default: uuidv4(),
            unique: true
        },
        name: String,
        gender: {
            type: String,
            required: [true, "Please provide a gender"],
        },       
        skill: {
            type : Array,
            //default : ["Accounting/Finance","Bank/Non-Bank Fin. Institution","Supply Chain/Procurement","Education/Training","Engineer/Architect","Garments/ Textile","General Management/Admin","General Management/Admin","IT/Telecommunication","Marketing/Sales","Media/Advertisement/Event Mgt.","Medical/Pharma","NGO/Development","Research/Consultancy","Secretary/Receptionis","Data Entry/Operator/BPO","Customer Service/Call Centre","Design/Creative","Production/Operation","Security/Support Service","Commercial","Law/ Legal","Electrician/ Construction/ Repair","Driving/Motor Technician","Agro (Plant/Animal/Fisheries)"],
            default: [],
        },  
        email: {
            type: String,
            required : [true, "Please provide a unique email"],
            unique: true,
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
            unique : false,
        },
        otp: {
            type: String,
            unique: true,
            default: 0,
        },
        active: {
            type: Boolean,
            default: false,
        },
        create_at: {
            type: Date,
            default: Date.now,
        },
        updated_at: {
            type: Date,
            default: Date.now,
        },
    })

module.exports = user;