const Landlord = require('../models/landlordModel')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer');
const otpModel = require('../models/otpModel');
const Property = require('../models/propertyModel')
const Booking = require('../models/bookingModel')
const Tenant = require('../models/tenantModel')
require('dotenv').config()

// Landlord signup
const landlordSignup = async (req, res) => {
    try {
        const { name, email, phoneno, agencyName, licenseNo, experienceYears, rating, address, status, createPassword, confirmPassword } = req.body;

        if (!name || !email || !phoneno || !agencyName || !licenseNo || !experienceYears || !rating || !address || !status || !createPassword || !confirmPassword) {
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
            status,
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
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: true, message: "Email and password are required" });
        }

        const landlord = await Landlord.findOne({ email });

        if (!landlord) {
            return res.status(401).json({ error: true, message: "Invalid email or password" });
        }

        const match = await bcrypt.compare(password, landlord.createPassword);

        if (!match) {
            return res.status(401).json({ error: true, message: "Invalid email or password" });
        }

        const accessToken = jwt.sign(
            { landlordId: landlord._id, email: landlord.email, role: "landlord" },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "1d" }
        );

        return res.status(200).json({
            error: false,
            message: "Login successful",
            accessToken,
            landlordId: landlord._id,
            landlordName: landlord.name, // Fix: Correctly return landlord name
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Server error", details: error.message });
    }
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


// Add Property
const addProperty = async (req, res) => {
    if (!req.user || req.user.role !== "landlord") {
        return res.status(403).json({ error: true, message: "Unauthorized - Invalid Role in Route" });
    }
    try {


        const { title, propertyName, address, stateId, cityId, areaId, bedrooms, bathrooms, rating, description, basePrice, furnishingStatus, availabilityStatus, image } = req.body;

        if (!req.user.landlordId) {
            return res.status(403).json({ error: true, message: "Unauthorized - landlordId missing" });
        }

        const newProperty = new Property({
            title,
            propertyName,
            landlordId: req.user.landlordId, // Ensure this is available
            address,
            stateId,
            cityId,
            areaId,
            bedrooms,
            bathrooms,
            rating,
            description,
            basePrice,
            furnishingStatus,
            availabilityStatus,
            image,
        });

        await newProperty.save();
        res.status(201).json({ success: true, message: "Property added successfully", data: newProperty });

    } catch (error) {
        console.error("Error adding property:", error);
        return res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Get All Properties
const getProperties = async (req, res) => {
    try {


        if (!req.user.landlordId) {
            return res.status(403).json({ success: false, message: "Unauthorized - landlordId missing" });
        }

        // Fetch properties belonging to the logged-in landlord
        const properties = await Property.find({ landlordId: req.user.landlordId })
            .populate("stateId")
            .populate("cityId")
            .populate("areaId");

        res.json({ success: true, data: properties });
    } catch (error) {
        console.error("Error fetching properties:", error);
        res.status(500).json({ success: false, message: "Error fetching properties", error });
    }
};


// Get Property by ID
const getPropertyById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || id.length !== 24) {
            return res.status(400).json({ error: "Invalid property ID" });
        }

        const property = await Property.findById(id).populate("categoryId cityId stateId areaId tenantId");

        if (!property) {
            return res.status(404).json({ error: "Property not found" });
        }

        return res.status(200).json(property);
    } catch (error) {
        console.error("Error fetching property:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// Update Property
const updateProperty = async (req, res) => {
    try {
        const { id } = req.params; // Extract _id from URL
        const updatedData = req.body;

        // Validate ID format
        if (!id || id.length !== 24) {
            return res.status(400).json({ error: "Invalid property ID" });
        }

        // Find and update the property
        const updatedProperty = await Property.findByIdAndUpdate(id, updatedData, { new: true });

        if (!updatedProperty) {
            return res.status(404).json({ error: "Property not found" });
        }

        res.status(200).json(updatedProperty);
    } catch (error) {
        console.error("Error updating property:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

// Delete Property
const deleteProperty = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProperty = await Property.findByIdAndDelete(id);

        if (!deletedProperty) {
            return res.status(404).json({ error: "Property not found" });
        }

        return res.status(200).json({ message: "Property deleted successfully" });
    } catch (error) {
        console.error("Error deleting property:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

// get bookings
const getLandlordBookings = async (req, res) => {
    try {
        const { landlordId } = req.params;
        console.log("Fetching bookings for landlord:", landlordId);

        const bookings = await Booking.find({ landlordId }) // Fetch all bookings for this landlord
            .populate('tenantId', 'firstName lastName email phoneno') // Get tenant details
            .populate({
                path: 'propertyId',
                select: 'propertyName image basePrice cityId stateId',
                populate: [
                    { path: 'cityId', select: 'name' }, // Populate city name
                    { path: 'stateId', select: 'name' } // Populate state name
                ]
            })
            .populate('landlordId', 'name email phoneno'); // Get landlord details

        if (!bookings.length) {
            return res.status(404).json({
                error: true,
                message: 'No bookings found'
            });
        }

        res.status(200).json({
            error: false,
            data: bookings
        });

    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({
            error: true,
            message: 'Failed to fetch bookings'
        });
    }
};

// update booking status
const updateBookingStatus = async (req, res) => {
    try {


        const { bookingId } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ error: true, message: "Status is required" });
        }

        const booking = await Booking.findById(bookingId)
            .populate("tenantId", "firstName lastName email")
            .populate("propertyId", "propertyName");

        if (!booking) {
            return res.status(404).json({ error: true, message: "Booking not found" });
        }

        console.log("✅ Booking found:", booking);

        booking.status = status;
        await booking.save();

        console.log("✅ Booking status updated:", booking.status);

        const tenantEmail = booking.tenantId?.email;
        const tenantName = `${booking.tenantId?.firstName || ""} ${booking.tenantId?.lastName || ""}`;
        const propertyName = booking.propertyId?.propertyName || "Unknown Property";

        console.log("📧 Tenant Email:", tenantEmail);

        if (!tenantEmail) {
            console.warn("⚠️ No tenant email found! Skipping email sending.");
        } else {
            // ✅ Setup Email Transporter inside the function
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.PASS_KEY,
                },
            });

            let subject, message;
            if (status === "confirmed") {
                subject = "Booking Request Accepted ✅";
                message = `Hello ${tenantName},\n\nYour booking request for "${propertyName}" has been accepted!\n\nThanks,\nPG Finder Team`;
            } else if (status === "rejected") {
                subject = "Booking Request Rejected ❌";
                message = `Hello ${tenantName},\n\nUnfortunately, your booking request for "${propertyName}" has been rejected.\n\nYou may try another property.\n\nPG Finder Team`;
            }

            console.log("📤 Sending email with subject:", subject);

            if (subject && message) {
                try {
                    let info = await transporter.sendMail({
                        from: process.env.EMAIL_USER,
                        to: tenantEmail,
                        subject,
                        text: message,
                    });

                    console.log(" Email sent successfully:", info.messageId);
                } catch (emailError) {
                    console.error(" Error sending email:", emailError);
                }
            }
        }

        res.status(200).json({ error: false, message: `Booking ${status} successfully` });
    } catch (error) {
        console.error(" Error updating booking status:", error);
        res.status(500).json({ error: true, message: "Failed to update booking status" });
    }
};

// get all landlords
const getLandlord = async (req, res) => {
    try {
        const landlords = await Landlord.find();
        res.json({ success: true, data: landlords });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }

}

// dashboard data
const dashboardData = async (req, res) => {
    try {
        const landlordId = req.params.landlordId; // Get landlordId from request params

        // Validate landlord existence
        const landlord = await Landlord.findById(landlordId);
        if (!landlord) {
            return res.status(404).json({ error: "Landlord not found" });
        }

        // Fetch total counts
        const totalProperties = await Property.countDocuments();
        const totalLandlords = await Landlord.countDocuments();
        const totalTenants = await Tenant.countDocuments();
        const activeBookings = await Booking.countDocuments({ status: "confirmed" });

        // Fetch previous stats (Example placeholders)
        const previousStats = {
            totalProperties: totalProperties - 5,
            totalLandlords: totalLandlords - 2,
            totalTenants: totalTenants - 10,
            activeBookings: activeBookings - 3
        };

        // Fetch properties owned by the logged-in landlord and populate city & state
        const properties = await Property.find({ landlordId })
            .populate("cityId", "name")  // Only fetch the 'name' field
            .populate("stateId", "name"); // Only fetch the 'name' field

        res.json({
            success: true,
            data: {
                stats: {
                    totalProperties,
                    totalLandlords,
                    totalTenants,
                    activeBookings
                },
                previousStats,
                properties
            }
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        res.status(500).json({ error: "Server error" });
    }
};

//getConfirmedTenants 
const getConfirmedTenants = async (req, res) => {
    try {
        const confirmedBookings = await Booking.find({ status: "confirmed" })
          .populate("tenantId", "firstName lastName phoneno email")
          .populate("propertyId", "propertyName");
    
        if (confirmedBookings.length === 0) {
          return res.status(404).json({ success: false, message: "No confirmed tenants found" });
        }
    
        const tenants = confirmedBookings.map((booking) => ({
          id: booking.tenantId._id,
          name: `${booking.tenantId.firstName} ${booking.tenantId.lastName}`,
          contact: booking.tenantId.phoneno,  // Ensure this field exists
          email: booking.tenantId.email,
          propertyName: booking.propertyId?.propertyName || "N/A",  // Handle missing property data
          joinDate: booking.checkInDate.toISOString().split("T")[0], // Format date correctly
        }));
    
        res.status(200).json({ success: true, tenants });
      } catch (error) {
        console.error("Error fetching confirmed tenants:", error);
        res.status(500).json({ success: false, error: "Server error" });
      }
}

module.exports = {
    landlordSignup,
    landlordLogin,
    sendOTP,
    validateOTP,
    changePassword,
    deleteProperty,
    updateProperty,
    getPropertyById,
    getProperties,
    addProperty,
    getLandlordBookings,
    updateBookingStatus,
    getLandlord,
    dashboardData,
    getConfirmedTenants

};