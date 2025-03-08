import passport from 'passport';  // Importing passport for authentication
import express from 'express';    // Importing express for the web framework or to create the authentication router
import { GoogleSignInController } from '../controllers/authController.js';  // Importing the Google sign-in controller for handling Google Sign-In logic
import dotenv from 'dotenv';      // Importing dotenv for loading environment variables

dotenv.config();  // Initialize dotenv to access/load environment variables from .env file

const authRouter = express.Router(); // Creating an instance of express Router for handling authentication routes
const googleSignIn = new GoogleSignInController(); // Creating an instance of GoogleSignInController  for handling sign-in actions

// Initiate OAuth2 login with Google
authRouter.get("/google", passport.authenticate('google', { scope: ['email', 'profile'] }));

// Google OAuth2 callback after authentication
authRouter.get("/google/callback",
    passport.authenticate("google", {
        successRedirect: process.env.CLIENT_URL, // Redirect to client app on successful authentication
        failureRedirect: "/login/failed"         // Redirect to failure route if authentication fails
    })
);

// Routes for handling successful login and login failures
authRouter.get("/login/success", googleSignIn.signInSuccess);
authRouter.get("/login/failed", googleSignIn.signInFailed);

export default authRouter; // Exporting the Auth Router
