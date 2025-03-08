import express from 'express';    // Importing express for the web framework or to create the authentication router
import { UserGetController, UserPostController } from '../controllers/controller.js';  // Importing controllers for handling GET and POST requests

const router = express.Router();  // Creating an instance of express Router for defining API routes
const UserGetControllerInstance = new UserGetController();  // Creating an instance of UserGetController for handling GET requests
const UserPostControllerInstance = new UserPostController();  // Creating an instance of UserPostController for handling POST requests

// ==============
// GET REQUESTS
// ==============

// Route definitions for GET requests
router.get('/signup', UserGetControllerInstance.getSignUpPage);  // Route to render sign-up page
router.get('/signin', UserGetControllerInstance.getSignInPage);  // Route to render sign-in page
router.get('/homepage', UserGetControllerInstance.homePage);  // Route to render homepage after successful login
router.get('/signout', UserGetControllerInstance.logoutUser);  // Route to log the user out and destroy the session
router.get('/forgot-password', UserGetControllerInstance.getForgotPassword);  // Route to render the forgot password page
router.get('/change-password', UserGetControllerInstance.getChangePassword);  // Route to render the change password page

// ===============
// POST REQUESTS
// ===============

// Route definitions for POST requests
router.post('/signup', UserPostControllerInstance.createUser);  // Route to handle user registration (sign-up)
router.post('/signin', UserPostControllerInstance.signInUser);  // Route to handle user authentication and login (sign-in)
router.post('/forgot-password', UserPostControllerInstance.forgotPassword);  // Route to handle forgot password resquests
router.post('/change-password', UserPostControllerInstance.changePassword);  // Route to handle change password requests

export default router;  // Exporting the router instance for use in other modules of the application
