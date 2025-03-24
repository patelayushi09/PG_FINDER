const Tenant = require('../models/tenantModel')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const otpModel = require('../models/otpModel');
require('dotenv').config()

// Tenant signup
const tenantSignup = async (req, res) => {
    try {
        const { firstName, lastName, email, phoneno, gender, status, createPassword, confirmPassword } = req.body;

        if (!firstName || !lastName || !email || !phoneno || !gender || !status || !createPassword || !confirmPassword) {
            return res.status(400).json({ error: true, message: "All fields are required" });
        }

        if (createPassword !== confirmPassword) {
            return res.status(400).json({ error: true, message: "Passwords do not match" });
        }

        const existingTenant = await Tenant.findOne({ email });
        if (existingTenant) {
            return res.status(400).json({ error: true, message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(createPassword, 10);

        const newTenant = new Tenant({
            firstName,
            lastName,
            email,
            phoneno,
            gender,
            status,
            createPassword: hashedPassword,
            confirmPassword: hashedPassword,
        });

        await newTenant.save();
        
        // Send Welcome Email
        await sendWelcomeEmail(email, firstName);

        const accessToken = jwt.sign(
            { tenantId: newTenant._id, email: newTenant.email, role: "tenant" },
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

// tenant login
const tenantLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ error: true, message: "Email and password are required" });
    }

    const tenant = await Tenant.findOne({ email });

    if (!tenant) {
        return res.json({ error: true, message: "Invalid email" });
    }

    // Ensure that createPassword is defined
    const storedPassword = tenant.createPassword;

    if (!storedPassword) {
        return res.json({ error: true, message: "No password found in database" });
    }

    const match = await bcrypt.compare(password, storedPassword);

    if (!match) {
        return res.json({ error: true, message: "Invalid password" });
    }

    const accessToken = jwt.sign(
        { tenantId: tenant._id, email: tenant.email, role: "tenant" },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
    );

    return res.status(200).json({
        error: false,
        message: "Login successful",
        accessToken: accessToken,
        tenantId: tenant._id,
        tenantName: {
            firstName: tenant.firstName,
            lastName: tenant.lastName
        }
    });
};



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

    const tenant = await Tenant.findOne({ email: email });

    if (!tenant) {
        return res.json({ error: true, message: "Invalid email" });
    }
    else {

        const otp = generateOTP();


        const otpExpires = Date.now() + 60000; // OTP expires in 1 minute

        const tenant = await otpModel.findOne({ email: email });
        const existingOtp = await otpModel.findOne({ email });
        if (existingOtp) {
            // Update existing OTP
            await otpModel.updateOne({ email }, { otp, otpExpires });
        } else {
            // Create new OTP record
            const newOtp = new otpModel({ email, otp, otpExpires });
            await newOtp.save();
        }

        if (tenant) {
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

    await Tenant.findOneAndUpdate(
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
            subject: "🎉 Welcome to PG Finder!",
            text: `Hello ${firstName},\n\nWelcome to PG Finder! We are excited to have you on board.\n\nStart exploring and find the best PGs around you!\n\nHappy Searching!\nPG Finder Team`
        };

        await transporter.sendMail(mailOptions);
        console.log("Welcome email sent successfully to", email);
    } catch (error) {
        console.error("Error sending welcome email:", error);
    }
};

module.exports = {
    tenantLogin,
    tenantSignup,
    sendOTP,
    validateOTP,
    changePassword,
};