import { Request, Response, NextFunction } from "express";
import User from "../models/User.model";
import { AuthRequest } from "../types/auth.types";
import {
  verifyToken,
  unauthorizedResponse,
  forbiddenResponse,
} from "../utils/response.util";

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) {
      unauthorizedResponse(res, "Access token required");
      return;
    }

    const decoded = verifyToken(token);

    // Verify user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      unauthorizedResponse(res, "User not found");
      return;
    }

    req.user = {
      id: decoded.userId,
      username: user.username,
      role: user.role || "user",
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    forbiddenResponse(res, "Invalid or expired token");
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      unauthorizedResponse(res, "Authentication required");
      return;
    }

    if (!roles.includes(req.user.role)) {
      forbiddenResponse(res, "Insufficient permissions");
      return;
    }

    next();
  };
};

export const optionalAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (token) {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId);

      if (user) {
        req.user = {
          id: decoded.userId,
          username: user.username,
          role: user.role || "user",
        };
      }
    }

    next();
  } catch (error) {
    // For optional auth, we don't fail on invalid tokens
    console.log("Optional auth failed:", error);
    next();
  }
};
