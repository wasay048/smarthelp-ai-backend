import bcrypt from "bcrypt";
import { Request } from "express";
type MulterFile = Express.Multer.File;

export const validateUpload = (file: MulterFile): boolean => {
  const allowedTypes = ["application/pdf", "text/plain"];
  return allowedTypes.includes(file.mimetype);
};

export const validateTextContent = (text: string): boolean => {
  return text.trim().length > 0;
};

export const validateFAQData = (faqData: any): boolean => {
  if (!faqData || typeof faqData !== "object") return false;
  const { question, answer } = faqData;
  return validateTextContent(question) && validateTextContent(answer);
};

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  // At least 8 characters, containing at least one letter and one number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validateUsername = (username: string): boolean => {
  // 3-20 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};
