import { Request, Response } from "express";

export const generateEmbedCode = (req: Request, res: Response) => {
  const { siteId } = req.body;

  if (!siteId) {
    return res.status(400).json({ message: "Site ID is required" });
  }

  const embedCode = `<iframe src="https://your-chatbot-url.com/${siteId}" width="350" height="500" frameborder="0"></iframe>`;

  return res.status(200).json({ embedCode });
};
