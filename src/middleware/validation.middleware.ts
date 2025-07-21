import { Request, Response, NextFunction } from "express";
import { body, validationResult } from "express-validator";

export const validateUpload = [
  body("content")
    .notEmpty()
    .withMessage("Content is required")
    .isString()
    .withMessage("Content must be a string"),
  body("file")
    .optional()
    .custom((value, { req }) => {
      if (!req.file) {
        throw new Error("File is required if no content is provided");
      }
      return true;
    }),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Additional validation middleware can be added here as needed.
