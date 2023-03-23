const mongoose = require('mongoose')

const m = {}

const emp = require('./employer.model')
const jobP = require('./job_post.model')
const user = require('./user.model')

m.us = mongoose.model("User", user)
m.em = mongoose.model("Employer", emp)
m.jp = mongoose.model("Job_Post", jobP)

module.exports = m