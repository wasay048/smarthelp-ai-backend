import dotenv from "dotenv";

dotenv.config();

const environment = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI:
    process.env.MONGODB_URI || "mongodb://localhost:27017/smarthelp-ai",
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",
  OPENAI_API_URL: process.env.OPENAI_API_URL || "https://api.openai.com",
  JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
  STAGING_URL: process.env.STAGING_URL || "http://5.161.120.206/smarthelp-ai",
};

// Validate critical environment variables
if (!environment.OPENAI_API_KEY) {
  console.warn("WARNING: OPENAI_API_KEY is not set in environment variables");
}

if (!environment.MONGODB_URI) {
  console.warn("WARNING: MONGODB_URI is not set in environment variables");
}

export default environment;
