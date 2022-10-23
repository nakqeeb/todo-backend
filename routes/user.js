const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const router = express.Router();

const User = require('../models/user');

const ageEnum = {
    male: 'Male',
    female: 'Female'
};

router.post('/signup', async (req, res, next) => {
    try {
        const fetchedUserByEmail = await User.findOne({ email: req.body.email });
        if (fetchedUserByEmail) {
            const error = new Error("The account already exists for this email.");
            error.statusCode = 500;
            throw error;
        }
        const fetchedUserByPhone = await User.findOne({ phoneNumber: req.body.phoneNumber });
        if (fetchedUserByPhone) {
            const error = new Error("The account already exists for this phone number.");
            error.statusCode = 500;
            throw error;
        }
        const hash = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.username,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            password: hash,
            address: req.body.address,
            dateOfBirth: req.body.dateOfBirth,
            age: req.body.age,
        });

        const signedupUser = await user.save();
        if (!signedupUser) {
            const error = new Error("Could not create the user.");
            error.statusCode = 500;
            throw error;

        }
        res.status(200).json({
            user: signedupUser,
            success: true
        });
    } catch (err) {
        if (!err.statusCode) {
            return res.status(401).json({
                message: "Unauthorized access.",
                success: false
            });
        }
        return res.status(err.statusCode).json({
            message: err.message,
            success: false
        });
    }
});


router.post('/login', async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        if (!email || !password) {
            const error = new Error("Email and password can not be empty.");
            error.statusCode = 401;
            throw error;
        }
        const user = await User.findOne({ email: email });
        if (!user) {
            const error = new Error("No user found for that email.");
            error.statusCode = 401;
            throw error;
        }
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
            const error = new Error("Wrong password provided for that user.");
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign(
            { email: user.email, userId: user._id },
            process.env.JWT_KEY,
        );
        const fetchedUser = user.toObject(); // delete password field from user before we send the response to the client
        delete fetchedUser.password;
        res.status(200).json({
            token: token,
            user: fetchedUser,
        });
    } catch (err) {
        if (!err.statusCode) {
            return res.status(401).json({
                message: "Invalid authentication credentials.",
                success: false
            });
        }
        return res.status(err.statusCode).json({
            message: err.message,
            success: false
        });
    }
});


module.exports = router;