import { Schema, model, Document } from "mongoose";

// Interface da sessão
interface ISession extends Document {
  phoneNumber: string;
  status: "active" | "inactive";
  sessionId: string;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<ISession>({
  phoneNumber: { type: String, required: true, unique: true },
  status: { type: String, enum: ["active", "inactive"], required: true },
  sessionId: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Session = model<ISession>("session", SessionSchema);

export default Session;
