import mongoose from "mongoose";  // Importing mongoose for MongoDB interactions
import dotenv from "dotenv";      // Importing dotenv for loading environment variables

dotenv.config();  // Initialize dotenv to access/load environment variables from .env file
const dbUri = process.env.DB_URL;  // Fetching MongoDB connection URL from environment variable

// Function to establish a connection to MongoDB using Mongoose
export const connectToDBUsingMongoose = async () => {
    try {
         // Attempt to establish a connection with MongoDB
        await mongoose.connect(dbUri);

        // Log success message if the connection is established
        console.log("Successfully connected to MongoDB using Mongoose..!");
    } catch (error) {
        // Log an error message if the connection fails
        console.error("Database connection failed..!", error);
    }
};
