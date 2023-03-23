const mongoose = require("mongoose")
const { v4: uuidv4 } = require('uuid');


const job_post = new mongoose.Schema({
        _id: {
            type: String,
            default: uuidv4(),
            unique: true
        },
        job_title: {
            type: String,
            required : [true, "Please provide a job title"],
        },
        vacancies: {
            type: Number,
            required : [true, "Please provide a job title"],
        },
        job_type: {
            type : Array,
            "default" : ["Accounting/Finance","Bank/Non-Bank Fin. Institution","Supply Chain/Procurement","Education/Training","Engineer/Architect","Garments/ Textile","General Management/Admin","General Management/Admin","IT/Telecommunication","Marketing/Sales","Media/Advertisement/Event Mgt.","Medical/Pharma","NGO/Development","Research/Consultancy","Secretary/Receptionis","Data Entry/Operator/BPO","Customer Service/Call Centre","Design/Creative","Production/Operation","Security/Support Service","Commercial","Law/ Legal","Electrician/ Construction/ Repair","Driving/Motor Technician","Agro (Plant/Animal/Fisheries)"],
        },
        job_status: {
            type : Array,
            "default" : ["Full time","Part Time","Contractual","Internship","Freelance"],
        },
        deadline: {
            type: Date,
            required:[true, "Please provide a deadline"],
        },
        resume: {
            type: String,
            required:[true, "Please provide a resume"],
        },
        job_level: {
            type: Array,
            "default" : ["Entry", "Mid", "Top"],
        },
        job_desc: {
            type: String,
            required:[true, "Please provide a description"],
        },
        job_responsibilities: {
            type: String,
            required:[true, "Please provide a responsibility"],
        },
        job_workplace: {
            type: Array,
            "default": ["Office","At home"],
            required:[true, "Please provide a workplace"],
        },
        job_location: {
            type: String,
            required:[true, "Please provide a location"],
        },
        job_salary: {
            type: Number,
            "default": [0]
        },
        job_benefits: {
            type: Array,
            "default": ["Mobile Bill","Pension Policy","Credit Card","Medical Allowance","Bonus","Over time allowance","Gratuity",]
        },
        pref_degree: {
            type: Array,
            "default": ["Secondary","Higner Secondary","Diploma","Bachelors/Honors","Masters","PhD"]
        },
        pref_instituition: {
            type: String,
            required:[true, "Please provide a instuition"],
        },
        prof_certification: {
            type: String,
        },
        experience: {
            type: Array,
            "default": ["No Experience Required","Experience Required"]
        },                                                                                  //Care
        perf_gender: {
            type: Array,
            "default": ["Male","Female","Others"]
        },                                                                                  
        perf_age: {
            type: Number,
            required:[true, "Please provide a age"],
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

module.exports = job_post