const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
        },
        address: {
            type: String,
        },
        dateOfBirth: {
            type: Date,
        },
        age: {
            type: String,
            enum: ['Male','Female'],
        }
    }
);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);