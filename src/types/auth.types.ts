import { Request } from "express";

export interface AuthUser {
  id: string;
  username: string;
  role: string;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export type UserCredentials = {
  username: string;
  password: string;
};

export type UserRegistration = {
  username: string;
  password: string;
  email?: string;
};

export type AuthResponse = {
  token: string;
  user: {
    id: string;
    username: string;
    role?: string;
  };
};

export type AuthError = {
  message: string;
  statusCode: number;
};

export interface JWTPayload {
  userId: string;
  iat?: number;
  exp?: number;
}
