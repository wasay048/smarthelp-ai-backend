import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { json } from "body-parser";
import authRoutes from "./routes/auth.routes";
import chatRoutes from "./routes/chat.routes";
import knowledgeRoutes from "./routes/knowledge.routes";
import embedRoutes from "./routes/embed.routes";
import errorMiddleware from "./middleware/error.middleware";
import environment from "./config/environment";

const app = express();

// Validate environment variables
if (!environment.OPENAI_API_KEY) {
  console.error(
    "ERROR: OPENAI_API_KEY is required but not set in environment variables"
  );
  console.error("Please add your OpenAI API key to the .env file");
  process.exit(1);
}

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    credentials: true,
  })
);
app.use(json());

// Connect to MongoDB
mongoose
  .connect(environment.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/knowledge", knowledgeRoutes);
app.use("/api/embed", embedRoutes);

// Error handling middleware
app.use(errorMiddleware);

// Start the server
const PORT = environment.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(
    `OpenAI API Key configured: ${environment.OPENAI_API_KEY ? "Yes" : "No"}`
  );
});

export default app;
