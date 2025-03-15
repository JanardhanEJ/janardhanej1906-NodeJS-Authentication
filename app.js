import express from "express"; // Importing express for the web framework or to create the authentication router
import bodyParser from "body-parser"; // Importing bodyParser for parsing incoming request bodies
import ejsLayouts from "express-ejs-layouts"; // Importing express-ejs-layouts for layout support with EJS
import path from "path"; // Importing path for handling Built-in module file paths
import dotenv from "dotenv"; // Importing dotenv for loading environment variables
import session from "express-session"; // Importing express-session for session management
import passport from "passport"; // Importing passport for authentication
import { Strategy as GoogleStrategy } from "passport-google-oauth20"; // Importing Google OAuth 2.0 strategy for passport

import { connectToDBUsingMongoose } from "./config/mongodb.js"; // Importing MongoDB database connection function
import router from "./routes/routes.js"; // Importing main application routes
import authrouter from "./routes/authRoutes.js"; // Importing authentication-related routes

dotenv.config(); // Initialize dotenv to access/load environment variables from .env file
const app = express(); // Initializing express application instance


// ---- SESSION CONFIGURATION ----
app.use(
  session({
    secret: "SecretKey",  // Use a secure secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// ---- MIDDLEWARE ----
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(bodyParser.json()); // Parse JSON data

// ---- PASSPORT SETUP ----
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL:
        "http://localhost:3000/auth/google/callback",
      scope: ["profile", "email"],
    },
    function (accessToken, refreshToken, profile, callback) {
      callback(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// ----  SET TEMPLATES ----
app.set("view engine", "ejs"); // Define template engine
app.use(ejsLayouts); // Use EJS layouts for consistent templates
app.set("views", path.join(path.resolve(), "views")); // Define template directory

// ---- CONNECT TO DATABASE ----
connectToDBUsingMongoose();

// ---- ROUTES ----
app.get("/", (req, res) => {
  res.send("Welcome!! Visit /user/signin for the login page...");
});
app.use("/user", router);
app.use("/auth", authrouter);

// ---- STATIC FILES ----
app.use(express.static("public"));

// ---- SERVER LISTENING ----
app.listen(process.env.PORT, () => {
  console.log(`Server running on http://localhost:${process.env.PORT}`);
});
