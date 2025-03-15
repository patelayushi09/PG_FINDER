const Inquiry = require('../models/inquiryModel')

//add Inquiry 
const addInquiry  = async (req, res) => {
    try {

        const savedInquiry  = await Inquiry.create(req.body);
        res.status(201).json({
            message: "Inquiry  added successfully",
            data: savedInquiry
        })
    } catch (err) {
        res.status(500).json({ message: err });
    }
};

//get Inquiry 
const getInquiries = async (req, res) => {
    try {
        const inquiries  = await Inquiry.find();
        res.status(200).json({
            message: "All Inquiries fetched successfully",
            data: inquiries,
        });
    } catch (err) {
        res.status(500).json({ message: err });
    }
};


module.exports = {
    addInquiry,
    getInquiries,
};