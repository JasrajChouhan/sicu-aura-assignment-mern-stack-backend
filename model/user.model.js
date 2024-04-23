import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: true,
        lowercase: true
    },
    password: {
        type: String,
        minlength: [8, "Password must contain at least 8 characters"],
        required: [true, "Password is required"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"],
        trim: true,
    },
    address: {
        type: String,
        required: true,
        unique: false,
    },
    city: {
        type: String,
        required: [true, "Please provide city name"]
    },
    state: {
        type: String,
        required: [true, "Please provide state name"]
    },
    pincode: {
        type: String,
        minlength: [6, 'Pincode must be 6 digits'],
        maxlength: [6, 'Pincode must be 6 digits'],
        required: [true, 'Please enter your pincode']
    },
    registrationDate: {
        type: String,
        required: [true, 'Please provide the date of registration of the hospital'],
    },
    numberOfAmbulance: {
        type: String,
        default: 0,
        required: [true, 'Please provide the number of ambulances you have'],
    },
    phoneNumber: {
        type: String,
        required: true,
        minlength: [10, 'Phone number must be 10 digits'],
        maxlength: [10, 'Phone number must be 10 digits'],
        unique: true
    },
    registrationNumber: {
        type: String,
        uppercase: true,
        required: true,
        unique: true
    },
    emergencyWardNumber: {
        type: String,
        required: true,
    },
    specialAccessCode: {
        type: String,
        default: "1234"
    },
    avatar: {
        public_id: {
            type: String,
            // required: true
        },
        url: {
            type: String,
            // required: true,
        }
    },
    registrationCertificatePublicId: {
        type: String,
        
    } ,
    registrationCertificate: {
        type: String,
        required: true
    }
}, { timestamps: true });



// Hash the password before saving it to the database
userSchema.pre("save", async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        return next(err);
    }
});

// Compare the password with the hashed one in the database
userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Generate the JWT token for authentication
userSchema.methods.getJWTTOKEN = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};

const User = mongoose.model('User', userSchema);

export default User;
