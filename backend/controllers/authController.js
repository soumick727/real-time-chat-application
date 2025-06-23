const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try{
        const { firstname, lastname, email, password } = req.body;
        if(!firstname || !lastname || !email || !password){
            return res.status(400).json({ message: 'All fields are required', success: false });
        }
        //check if email is correct or not
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({
                message: "please provide a valid gmail address",
                success: false,
            })
        }
        //check if password is strong or not
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#!$&%])[A-Za-z\d@#!$&%]{10,}$/;
        if(!passwordRegex.test(password)){
            return res.status(400).json({
                message: "Password must be at least 10 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
                success: false,
            });
        }

        //check if email already exist
        const existEmail = await User.findOne({email});
        if(existEmail){
            return res.status(400).json({
                message: 'Email already exists',
                success: false
            })
        }

        //hash then password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //create and save the user
        const newUser = new User({
            firstname,
            lastname,
            email,
            password: hashedPassword,
        });
        await newUser.save();

        //generate jwt token
        const token = jwt.sign(
            {id: newUser._id},
            process.env.JWT_SECRET_KEY,
            {expiresIn: "2d"}
        );

        //add user id to cookie
        res.cookie("token",token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict', // Helps prevent CSRF attacks
            maxAge: 2 * 24 * 60 * 60 * 1000 // 2 days
        });

        res.status(201).json({
            message: "User signup successfully",
            success: true,
            token,
            user:{
                id: newUser._id,
                firstname: newUser.firstname,
                lastname: newUser.lastname,
                email: newUser.email,  
            }
        })
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Internal server error',
        success: false });
    }
      
}

exports.login = async (req, res) => {
    try{
        const {email, password} = req.body;
        //check if both email and password are provided
        if(!email || !password){
            return res.status(400).json({
                message: "both email and password are required",
                success: false
            });
        }

        //find the user by email
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message: "user not found with this email",
                success: false
            });
        }

        //comapre the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid){
            return res.status(401).json({
                message: "Invalid Password",
                success: false
            });
        }

        //generate jwt token
        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET_KEY,
            {expiresIn: "2d"}
        );

        // set cookie
        res.cookie("token",token,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            sameSite: 'strict', // Helps prevent CSRF attacks
            maxAge: 2 * 24 * 60 * 60 * 1000 // 2 days
        });

        // send success response
        res.status(200).json({
            message: "User Logged in successfully",
            success: true,
            token,
            user:{
                id: user._id,
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,

            }
        });

    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Internal server error',
        success: false,
        error: error.message });
    }
} 

exports.logout = async (req, res) => {
    try {
        // clear the cookie
        res.clearCookie(
            "token",{
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                samSite: "strict",
            }
        );
        // send response
        res.status(200).json({
            message: 'Logged out successfully',
            success: true
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Internal server error',
            success: false
        });
    }
}

exports.checkAuth = async (req, res) => {
    try {
        if(!req.user){
            return res.status(401).json({
                message: "Unauthorized",
                success: false,
            });
        }
        // If user is authenticated, return user details
        res.status(200).json({
            message: "User is authenticated",
            success: true,
            user: req.user,
        })
    } catch (error) {
        console.error("Check Auth Error:", error);
        res.status(500).json({
            message: "internal server error",
            success: false
        })
    }
}