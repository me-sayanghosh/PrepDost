const mongoose = require('mongoose');



const userSchema = new mongoose.Schema({
    username: {
        type: String,
       required: [true, 'Username is already taken'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Account already exists with this email'],
        unique: true,
    },
    password: {
        type: String,
        required: [function() { return !this.googleId; }, 'Password is required'],   
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    }
});


const usermodel = mongoose.model('User', userSchema);

module.exports = usermodel;