const Landlord = require('../models/landlordModel')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const otpModel = require('../models/otpModel');
const dotenv = require('dotenv').config()

// Landlord signup
const landlordSignup = async (req, res) => {
    try {
        const { name, email, phoneno, agencyName, licenseNo, experienceYears, rating, address, createPassword, confirmPassword } = req.body;

        if (!name || !email || !phoneno || !agencyName || !licenseNo || !experienceYears || !rating || !address || !createPassword || !confirmPassword) {
            return res.status(400).json({ error: true, message: "All fields are required" });
        }

        if (createPassword !== confirmPassword) {
            return res.status(400).json({ error: true, message: "Passwords do not match" });
        }

        const existingLandlord = await Landlord.findOne({ email });
        if (existingLandlord) {
            return res.status(400).json({ error: true, message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(createPassword, 10);

        const newLandlord = new Landlord({
            name,
            email,
            phoneno,
            agencyName,
            licenseNo,
            experienceYears,
            rating,
            address,
            createPassword: hashedPassword,
            confirmPassword: hashedPassword,
        });

        await newLandlord.save();

        // Send Welcome Email
        await sendWelcomeEmail(email, name);

        const accessToken = jwt.sign(
            { landlordId: newLandlord._id, email: newLandlord.email, role: "landlord" },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(201).json({
            error: false,
            message: "Signup successful",
            accessToken
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Server error", details: error.message });
    }
};

// landlord login
const landlordLogin = async (req, res) => {
    const { email, password } = req.body;


    if (!email || !password) {
        return res.json({ error: true, message: "Email and password are required" });
    }

    const landlord = await Landlord.findOne({ email: email });


    if (!landlord) {
        return res.json({ error: true, message: "Invalid email" });
    }

    const match = await bcrypt.compare(password, landlord.createPassword || landlord.password);



    if (!match) {
        return res.json({ error: true, message: "Invalid password" });
    }

    const accessToken = jwt.sign({ landlordId: landlord._id, email: landlord.email, role: "landlord" }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
    });

    return res.status(200).json({
        error: false,
        message: "Login successful",
        accessToken
    });
}

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.PASS_KEY
    }
});

function generateOTP() {
    return Math.floor(Math.random() * 10000).toString().padStart(4, '0');
}

// send otp 
const sendOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({ error: true, message: "Email is required" });
    }

    const landlord = await Landlord.findOne({ email: email });

    if (!landlord) {
        return res.json({ error: true, message: "Invalid email" });
    }
    else {

        const otp = generateOTP();


        const otpExpires = Date.now() + 60000; // OTP expires in 1 minute

        const landlord = await otpModel.findOne({ email: email });
        const existingOtp = await otpModel.findOne({ email });
        if (existingOtp) {
            // Update existing OTP
            await otpModel.updateOne({ email }, { otp, otpExpires });
        } else {
            // Create new OTP record
            const newOtp = new otpModel({ email, otp, otpExpires });
            await newOtp.save();
        }

        if (landlord) {
            await otpModel.findOneAndUpdate(
                { email },
                { otp, otpExpires },
                { new: true } // Returns the updated document
            );
        } else {
            const newOtp = new otpModel({
                email,
                otp,
                otpExpires
            })

            await newOtp.save();
        }

        var mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'OTP',
            text: 'otp is: ' + otp
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
    return res.json({ error: false });
}


// validate otp
const validateOTP = async (req, res) => {
    const { email, otp } = req.body;

    let otp_data = await otpModel.findOne({ email: email });

    if (!otp_data) {
        return res.json({ error: true, message: "No OTP found for this email. Please request a new OTP." });
    }

    if (otp_data.otpExpires < Date.now()) {
        return res.json({ error: true, message: "Expired OTP! Please click on resend OTP." });
    }

    if (otp !== otp_data.otp) {
        return res.json({ error: true, message: "Invalid OTP" });
    }

    res.json({ error: false, message: "OTP verified" });
}


// change password
const changePassword = async (req, res) => {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    await Landlord.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true } // Returns the updated document
    );

    return res.json({ error: false });
}


// Function to send a welcome email
const sendWelcomeEmail = async (email, firstName) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "🎉 Welcome to PG Finder, Landlord!",
            text: `Hello ${firstName},\n\nWelcome to PG Finder! We are excited to have you as a part of our community.\n\nStart listing your PGs and connect with potential tenants easily!\n\nHappy Renting!\nPG Finder Team`
        };

        await transporter.sendMail(mailOptions);
        console.log("Welcome email sent successfully to", email);
    } catch (error) {
        console.error("Error sending welcome email:", error);
    }
};


module.exports = {
    landlordSignup,
    landlordLogin,
    sendOTP,
    validateOTP,
    changePassword,
};