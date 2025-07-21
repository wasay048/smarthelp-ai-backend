import jwt, { JwtPayload } from "jsonwebtoken";
import { Response } from "express";

// Types for response utilities
export interface ApiResponse<T = any> {
  status: "success" | "error";
  message: string;
  data?: T;
  error?: any;
  errors?: any;
}

export interface TokenPayload extends JwtPayload {
  userId: string;
}

export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || "your-secret-key";
  const expiresIn = process.env.JWT_EXPIRES_IN || "24h";

  return jwt.sign({ userId }, secret, { expiresIn } as jwt.SignOptions);
};

export const verifyToken = (token: string): TokenPayload => {
  const secret = process.env.JWT_SECRET || "your-secret-key";
  return jwt.verify(token, secret) as TokenPayload;
};

export const successResponse = <T = any>(
  res: Response,
  data: T,
  message: string = "Success"
): Response<ApiResponse<T>> => {
  return res.status(200).json({
    status: "success",
    message,
    data,
  });
};

export const errorResponse = (
  res: Response,
  error: any,
  message: string = "An error occurred"
): Response<ApiResponse> => {
  return res.status(500).json({
    status: "error",
    message,
    error: error.message || error,
  });
};

export const notFoundResponse = (
  res: Response,
  message: string = "Resource not found"
): Response<ApiResponse> => {
  return res.status(404).json({
    status: "error",
    message,
  });
};

export const validationErrorResponse = (
  res: Response,
  errors: any
): Response<ApiResponse> => {
  return res.status(400).json({
    status: "error",
    message: "Validation error",
    errors,
  });
};

export const unauthorizedResponse = (
  res: Response,
  message: string = "Unauthorized"
): Response<ApiResponse> => {
  return res.status(401).json({
    status: "error",
    message,
  });
};

export const forbiddenResponse = (
  res: Response,
  message: string = "Forbidden"
): Response<ApiResponse> => {
  return res.status(403).json({
    status: "error",
    message,
  });
};

export const createResponse = <T = any>(
  res: Response,
  data: T,
  message: string = "Resource created successfully"
): Response<ApiResponse<T>> => {
  return res.status(201).json({
    status: "success",
    message,
    data,
  });
};

export const noContentResponse = (res: Response): Response => {
  return res.status(204).send();
};
