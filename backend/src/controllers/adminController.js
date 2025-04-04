const Admin = require('../models/adminModel')
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const otpModel = require('../models/otpModel')
const Tenant = require('../models/tenantModel')
const Landlord = require('../models/landlordModel')
const Property = require('../models/propertyModel')
const Booking = require('../models/bookingModel')
require('dotenv').config()


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

    const admin = await Admin.findOne({ email: email });

    if (!admin) {
        return res.json({ error: true, message: "Invalid email" });
    }
    else {

        const otp = generateOTP();


        const otpExpires = Date.now() + 60000; // OTP expires in 1 minute

        const admin = await otpModel.findOne({ email: email });
        const existingOtp = await otpModel.findOne({ email });
        if (existingOtp) {
            // Update existing OTP
            await otpModel.updateOne({ email }, { otp, otpExpires });
        } else {
            // Create new OTP record
            const newOtp = new otpModel({ email, otp, otpExpires });
            await newOtp.save();
        }

        if (admin) {
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

    await Admin.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true } // Returns the updated document
    );

    return res.json({ error: false });
}


//admin login
const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ error: true, message: "Email and password are required" });
    }

    const admin = await Admin.findOne({ email: email });

    if (!admin) {
        return res.json({ error: true, message: "Invalid email" });
    }

    const match = await bcrypt.compare(password, admin.password);

    if (!match) {
        return res.json({ error: true, message: "Invalid password" });
    }

    const accessToken = jwt.sign({ adminId: admin._id, email: admin.email, role: "admin" }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1d",
    });

    return res.status(200).json({
        error: false,
        message: "Login successful",
        accessToken
    });
}


// to fetch all tenants and landlords
const getUsers = async (req, res) => {
    try {
        const { role, status } = req.query;
        let tenants = [];
        let landlords = [];

        let statusFilter = status ? { status: new RegExp(`^${status}$`, "i") } : {}; // Case-insensitive filtering

        if (!role || role.toLowerCase() === "tenant") {
            tenants = await Tenant.find(statusFilter);
        }

        if (!role || role.toLowerCase() === "landlord") {
            landlords = await Landlord.find(statusFilter);
        }

        const formattedTenants = tenants.map((tenant) => ({
            _id: tenant._id,
            firstName: `${tenant.firstName}`,
            lastName: `${tenant.lastName}`,
            role: "Tenant",
            email: tenant.email,
            phoneno: tenant.phoneno,
            gender: tenant.gender,
            status: tenant.status,
        }));

        const formattedLandlords = landlords.map((landlord) => ({
            _id: landlord._id,
            name: landlord.name,
            role: "Landlord",
            email: landlord.email,
            phoneno: landlord.phoneno,
            agencyName: landlord.agencyName,
            rating: landlord.rating,
            address: landlord.address,
            licenseNo: landlord.licenseNo,
            experienceYears: landlord.experienceYears,
            status: landlord.status,
        }));

        const users = [...formattedTenants, ...formattedLandlords];


        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



// delete users
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        //  find and delete from Tenant collection
        const tenant = await Tenant.findByIdAndDelete(id);
        if (tenant) {
            return res.status(200).json({ message: "Tenant deleted successfully" });
        }

        //  find and delete from Landlord collection
        const landlord = await Landlord.findByIdAndDelete(id);
        if (landlord) {
            return res.status(200).json({ message: "Landlord deleted successfully" });
        }

        return res.status(404).json({ error: "User not found" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


// update user
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        let user = await Tenant.findById(id);
        if (user) {
            const updatedTenant = await Tenant.findByIdAndUpdate(id, updateData, { new: true });
            return res.status(200).json({ message: "Tenant updated successfully", user: updatedTenant });
        }

        user = await Landlord.findById(id);
        if (user) {
            const updatedLandlord = await Landlord.findByIdAndUpdate(id, updateData, { new: true });
            return res.status(200).json({ message: "Landlord updated successfully", user: updatedLandlord });
        }

        return res.status(404).json({ error: "User not found" });

    } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
// get user by id
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || id.length !== 24) {
            return res.status(400).json({ error: "Invalid user ID" });
        }

        let user = await Tenant.findById(id) || await Landlord.findById(id);

        if (user) {
            return res.status(200).json(user);
        }

        return res.status(404).json({ error: "User not found" });

    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};



// add users
const addUser = async (req, res) => {
    try {
        console.log("Received Data:", req.body); // ✅ Debugging

        const { role, createPassword, confirmPassword, ...userData } = req.body;

        // Validate passwords
        if (createPassword !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        // Check if email exists
        const existingUser = await Tenant.findOne({ email: userData.email }) ||
            await Landlord.findOne({ email: userData.email });

        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(createPassword, 10);

        let newUser;
        if (role === "Tenant") {
            newUser = new Tenant({ ...userData, password: hashedPassword, status: userData.status || "Active" });
        } else if (role === "Landlord") {
            newUser = new Landlord({ ...userData, password: hashedPassword, status: userData.status || "Active" });
        } else {
            return res.status(400).json({ error: "Invalid role" });
        }

        await newUser.save();
        res.status(201).json({ message: "User added successfully", user: newUser });

    } catch (error) {
        console.error("Error adding user:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

// Add Property
const addProperty = async (req, res) => {

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
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
            details: error.message,
        });
    }
};


// Get All Properties
const getProperties = async (req, res) => {
    try {
        const properties = await Property.find()
            .populate("cityId")
            .populate("areaId")
            .populate("stateId")
            .populate("landlordId", "name email phoneno");

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
        const { id } = req.params;
        const updateData = req.body;

        const updatedProperty = await Property.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedProperty) {
            return res.status(404).json({ error: "Property not found" });
        }

        return res.status(200).json({ message: "Property updated successfully", property: updatedProperty });
    } catch (error) {
        console.error("Error updating property:", error);
        return res.status(500).json({ error: "Internal Server Error" });
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


// Get All Landlords
const getLandlords = async (req, res) => {
    try {
        const landlords = await Landlord.find()
            .select('_id name email phoneno')
            .sort({ name: 1 });

        res.json({
            success: true,
            message: "Landlords fetched successfully",
            data: landlords
        });
    } catch (error) {
        console.error("Error fetching landlords:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching landlords",
            error: error.message
        });
    }
};

// get admin dashboard
const getAdminDashboard = async (req, res) => {
    try {
        // Fetch counts
        const totalTenants = await Tenant.countDocuments();
        const totalLandlords = await Landlord.countDocuments();
        const totalProperties = await Property.countDocuments();
        const totalBookings = await Booking.countDocuments();

        // Fetch recent bookings with user and PG (property) name
        const recentBookings = await Booking.find()
            .sort({ createdAt: -1 }) // Get latest bookings
            .limit(10) // Limit to 10 recent bookings
            .populate("tenantId", "firstName lastName") // Get tenant name
            .populate("propertyId", "propertyName") // Get PG name
            .select("status checkInDate tenantId propertyId");

        // Format recent bookings
        const formattedBookings = recentBookings.map(booking => ({
            id: booking._id,
            user: `${booking.tenantId.firstName} ${booking.tenantId.lastName}`,
            pg: booking.propertyId ? booking.propertyId.propertyName : "N/A",
            date: booking.checkInDate.toISOString().split("T")[0],
            status: booking.status
        }));

        res.status(200).json({
            success: true,
            data: {
                totalTenants,
                totalLandlords,
                totalProperties,
                totalBookings,
                recentBookings: formattedBookings
            }
        });
    } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
        res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

module.exports = {
    adminLogin,
    sendOTP,
    validateOTP,
    changePassword,
    getUsers,
    deleteUser,
    updateUser,
    getUserById,
    addUser,
    addProperty,
    getProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    getLandlords,
    getAdminDashboard
}