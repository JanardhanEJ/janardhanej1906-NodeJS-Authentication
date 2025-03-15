import nodemailer from 'nodemailer';  // Importing nodemailer for email sending functionality
import dotenv from 'dotenv';          // Importing dotenv for loading environment variables

dotenv.config();  // Loading environment variables from .env file

// Creating a transporter using nodemailer
export const transporter = nodemailer.createTransport({
    //service: 'gmail',  // Using Gmail as the email service provider
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL,     // Fetching email address from environment variable
        pass: process.env.PASSWORD   // Fetching email password from environment variable
    }
});
