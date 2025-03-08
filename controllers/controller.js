import mongoose from "mongoose";  // Importing mongoose for MongoDB interactions
import User from "../models/userModel.js";  // Importing User model
import bcrypt from "bcrypt";  // Importing bcrypt to securely hash passwords
import { transporter } from "../config/nodemailerConfig.js";  // Importing configured nodemailer transporter for sending emails
import dotenv from "dotenv";  // Importing dotenv for loading environment variables

dotenv.config();  // Initialize dotenv to access/load environment variables from .env file

export  class UserGetController {
    getSignUpPage = (req, res) => {
        res.render("signup",{ message: "" });
    }

    getSignInPage = (req, res) => {
        res.render("signin", { message: "" });
    }

    homePage = (req, res) => {
        const email = req.session.userEmail;
        if (!email) {
            return res.status(404).render("signin",{message:"Please sign-in to view the homepage..!"});
        }
        res.render("homepage");
    }

    getForgotPassword = (req, res) => {
        res.render("forgot-password", { message: "" });
    }

    getChangePassword = (req, res) => {
        const email = req.session.userEmail;
        if (!email) {
            return res.status(404).render("signin",{message:"Please Sign-in to change the password..!"});
        }
        res.render("change-password", { message: "" });
    }

    logoutUser = (req, res) => {
        // req.logout();
        req.session.destroy((err) => {
            if (err) {
                console.error('Error signing out:', err);
                res.status(500).send('Error signing out');
            } else {
                res.status(201).render('signin',{message:"You have been logged out successfully..!"}); // Redirect to the sign-in page after signing out
            }
        });
    }

}

export  class UserPostController {
    
    //sign up Function
    createUser = async (req, res) => {
        const { username, email, password,cpassword } = req.body; // Extract user details from the request body

        // Check if the provided passwords match
        if (password !== cpassword) {
            return res.status(400).render("signup",{message:"Passwords do not match. Please try again..."});
        }

        // Verify if an account already exists with the given email
        const user = await User.findOne({ email: email });
        if (user) {
            return res.status(400).render("signup",{message:"An account with this email already exists..!"});
        }

        // Hash the user's password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email,password:hashedPassword });

        try {
            // Save the new user to the database
            await newUser.save();

            // Redirect to the sign-in page with a success message
            res.status(201).render("signin",{message:"Account created successfully. Please Sign in..!"});
        } catch (error) {
            // Handle errors and send an appropriate response
            res.status(409).json({ message: error.message });
        }
    };

    //sign in Function
    signInUser = async (req, res) => {
        const { email, password } = req.body; // Extract email and password from the request body

        // Validate reCAPTCHA response
        const recaptcha = req.body['g-recaptcha-response'];
        if (recaptcha === undefined || recaptcha === '' || recaptcha === null) {
            return res.status(404).render("signin",{message:"Please complete the reCAPTCHA verification..!"});
        }

        try {
            // Check if a user with the provided email exists
            const user = await User.findOne({ email: email});
            
            //If user is not found, return an error response
            if (!user) {
                return res.status(404).render("signin",{message:"User doesn't exist..!"});
            }
            
            // Compare the entered password with the stored hashed password
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            // If the password does not match, return an error response
            if (!isPasswordCorrect) {
                return res.status(400).render("signin",{message:"Invalid credentials || Incorrect Email or Password..!"});
            }

            // Store user email in session after successful authentication
            req.session.userEmail = email;

            // Redirect the user to their homepage upon successful login
            res.redirect('/user/homepage');
            
        }
        catch (error) {
            // Handle any unexpected server errors
            res.status(500).render("signin",{message:error.message});
            
        }
    };

    //forgot password Function
    forgotPassword = async (req, res) => {
        const { email } = req.body; // Extract the email from the request body

        try {
            // Check if a user with the provided email exists in the database
            const user = await User.findOne({ email: email });
            //If user is not found, return an error response
            if (!user) {
                return res.status(404).render("forgot-password",{message:"User doesn't exist..!"});
            }

            // Generate a temporary random password (8-character alphanumeric string)
            const tempPassword = Math.random().toString(36).slice(-8);

            // Hash the temporary password before storing it in the database
            const hashedPassword = await bcrypt.hash(tempPassword, 10);

            try{
                // Send an email with the newly generated temporary password
                await transporter.sendMail({
                    from: process.env.EMAIL, // Sender email from environment variable
                    to: email, // Recipient email
                    subject: 'Password Reset...', // Email subject
                    text: `Your new password is: ${tempPassword}` // Email content with the new temporary password
                    });
            }catch(error){
                console.log(error); // Log error for debugging
                return res.status(404).render("forgot-password",{message:"Failed to send email. Please try again..."+ error});
            }

            // Update user's password with the new hashed password
            user.password = hashedPassword;
            await user.save(); // Save the updated password in the database
            
            // Redirect user to the sign-in page with a success message
            res.status(201).render("signin",{message:"A new password has been sent to your email..!"});
        }
        catch (error) {
            // Handle unexpected server errors
            res.status(500).render("forgot-password",{message:error.message});
        }
    };

    //change password Function
    changePassword = async (req, res) => {
        const { oldPassword, newPassword } = req.body; // Extract old and new passwords from request body

        try {
            const userEmail = req.session.userEmail; // Retrieve logged-in user's email from session
            const user = await User.findOne({ email: userEmail }); // Find the user in the database

            // If user is not found, return an error response
            if (!user) {
                return res.status(404).render("change-password",{message:"User doesn't exist..!"});
            }

            // Compare the provided old password with the stored hashed password
            const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
            // If the old password does not match, return an error response
            // This prevents unauthorized password changes and ensures security
            if (!isPasswordCorrect) {
                return res.status(400).render("change-password",{message:"Invalid credentials || Incorrect Email or Password..!"});
            }

            // Hash the new password before saving it
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save(); // Save the updated password in the database

            // Redirect user to sign-in page with a success message
            res.status(201).render("signin",{message:"Password changed successfully..!"});
        }
        catch (error) {
            // Handle any errors and send an appropriate response
            res.status(500).render("change-password",{message:error.message});
        }
    };

};
