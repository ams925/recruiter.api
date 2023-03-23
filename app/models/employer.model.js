const mongoose = require("mongoose")
const { v4: uuidv4 } = require('uuid');

const Employer = mongoose.Schema({
    _id: {
        type: String,
        default: uuidv4(),
        unique: true
    },
    username: {
        type: String,
        required: [true, "Please provide a unique username"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        unique: false,
    },
    company_name: {
        type: String,
        required: [true, "Please provide a company name"],
    },
    situated: {
        type: Date,
        required: [true, "Please provide a establishment date"],
    },
    address: {
        type: String,
        required: [true, "Please provide a address"],
    },
    company_type: {
        type: Array,
        "default": ["Accounting/Finance", "Bank/Non-Bank Fin. Institution", "Supply Chain/Procurement", "Education/Training", "Engineer/Architect", "Garments/ Textile", "General Management/Admin", "General Management/Admin", "IT/Telecommunication", "Marketing/Sales", "Media/Advertisement/Event Mgt.", "Medical/Pharma", "NGO/Development", "Research/Consultancy", "Secretary/Receptionis", "Data Entry/Operator/BPO", "Customer Service/Call Centre", "Design/Creative", "Production/Operation", "Security/Support Service", "Commercial", "Law/ Legal", "Electrician/ Construction/ Repair", "Driving/Motor Technician", "Agro (Plant/Animal/Fisheries)"],
    },
    company_description: {
        type: String,
        required: [true, "Please provide a description"],
    },
    contact_email: {
        type: String,
        required: [true, "Please provide a email"],
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
module.exports = Employer;