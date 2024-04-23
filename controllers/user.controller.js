import User from "../model/user.model.js";
import multer from "multer";
import { catchAsync } from "../middlewares/catchAsync.js";
import ErrorHandler from "../middlewares/errorHandler.js";
import { sendToken } from "../utils/jwt.js";

import {uploadOnCloudinary} from '../utils/cloudnairy.js'



export const signup = catchAsync(async (req, res, next) => {


    const {
        username,
        email,
        password,
        address,
        city,
        state,
        pincode,
        registrationDate,
        numberOfAmbulance,
        phoneNumber,
        registrationNumber,
        emergencyWardNumber,
        specialAccessCode,
    } = req.body;

    if (!username ||
        !email ||
        !password ||
        !address ||
        !specialAccessCode ||
        !emergencyWardNumber ||
        !registrationNumber ||
        !city ||
        !state ||
        !pincode ||
        !registrationDate ||
        !numberOfAmbulance ||
        !phoneNumber) {
        return next(new ErrorHandler('Please provide all required information.', 400));
    }



    // Check if user with same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new ErrorHandler('Email is already in use.', 400));
    }

    

    const {secure_url , public_id} = await uploadOnCloudinary(req.file.path);


    const createdUser = await User.create({
        username,
        email,
        password,
        address,
        city,
        state,
        pincode,
        registrationDate,
        numberOfAmbulance,
        phoneNumber,
        registrationNumber,
        emergencyWardNumber,
        specialAccessCode,
        registrationCertificate: secure_url,
        registrationCertificatePublicId : public_id
    });

    sendToken(createdUser, res, 201, 'User created successfully.');

    res.status(201).json({
        status: 'success',
        message: 'User created successfully!',
        data: createdUser,
    });

    console.log(req);
    
});




/* ------------------------------- signin user ------------------------------ */

/* 
username 
email
password
specialAccessCode
*/
export const signin = catchAsync(async (req, res, next) => {
    const { email, password, specialAccessCode, username } = req.body;

    if (!email || !password || !specialAccessCode || !username) {
        return next(new ErrorHandler('Please provide all information', 400));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new ErrorHandler('Invalid email or password', 404));
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    if(user.specialAccessCode !== specialAccessCode){
        return next(new ErrorHandler("You don't have permission to access this service", 403))
    }

    // Upload avatar to Cloudinary
    const { secure_url, public_id } = await uploadOnCloudinary(req.file.path);
    console.log("secure_url: ", secure_url);
    console.log("public_id: ", public_id);

    // Update user's avatar details
    user.avatar = {
        url: secure_url,
        public_id: public_id
    };
    await user.save();

    // Generate JWT token for the user
    sendToken(user, res, 200, 'User successfully logged in');

    res.status(200).json({
        success: true,
        message: 'User signed in successfully!',
        token,
        user
    });
});


export const logout = catchAsync((req , res , next) => {
    res.status(201)
    .cookie("token" , "" , {
        httpOnly : true,
        expires : new Date (Date.now())
    })
    .json({
        success : true,
        message : "User successfully logged out !"
    })
})


export const getuser = catchAsync(async (req , res , next) =>{

    try {

        const user = req.user;
        console.log(user);

        res.status(200).json({
            success : true ,
            data : user
        })
        
    } catch (error) {
        return next(new ErrorHandler(
            'some error occoured during get user' , 400
        ))
        
    }

    
    
})