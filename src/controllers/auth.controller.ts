import { Request, Response } from "express";
import User from "../models/User.model";
import { hashPassword, comparePassword } from "../utils/validation.util";
import { generateToken } from "../utils/response.util";
import { AuthRequest } from "../types/auth.types";

export class AuthController {
  // Register a new user
  public async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const username = email;
      // Check if user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: "User already exists",
        });
        return;
      }

      const hashedPassword = await hashPassword(password);
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();

      const token = generateToken(newUser._id.toString());

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        user: {
          id: newUser._id,
          username: newUser.username,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error registering user",
        error: (error as Error).message,
      });
    }
  }

  // Login user
  public async login(req: Request, res: Response): Promise<void> {
    try {
      console.log("req.body", req.body);
      const { email, password } = req.body;

      const user = await User.findOne({ username: email });
      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      const isMatch = await comparePassword(password, user.password);
      if (!isMatch) {
        res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
        return;
      }

      const token = generateToken(user._id.toString());
      res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user._id,
          username: user.username,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error logging in",
        error: (error as Error).message,
      });
    }
  }

  // Get current user
  public async getCurrentUser(req: AuthRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Not authenticated",
        });
        return;
      }

      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        user: {
          id: user._id,
          username: user.username,
          role: user.role,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching user",
        error: (error as Error).message,
      });
    }
  }

  // Logout user
  public async logout(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  }
}
