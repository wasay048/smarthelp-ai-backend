import { Schema, model, Document } from "mongoose";

interface IChat extends Document {
  userId: string;
  message: string;
  timestamp: Date;
}

const chatSchema = new Schema<IChat>({
  userId: { type: String, required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Chat = model<IChat>("Chat", chatSchema);

export default Chat;
