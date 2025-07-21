import { Schema, model, Document } from "mongoose";

interface IKnowledge extends Document {
  question: string;
  answer: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

const KnowledgeSchema = new Schema<IKnowledge>(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const KnowledgeModel = model<IKnowledge>("Knowledge", KnowledgeSchema);

export default KnowledgeModel;
