import { Schema, model, Document } from "mongoose";

// Interface do log
interface ILog extends Document {
  id_message: string;
  type: string;
  message: string | null;
  prev_message: string | null;
  extra: string | null;
  from: string | null;
}

const messagesSchema = new Schema<ILog>({
  id_message: { type: String, required: true },
  type: { type: String, required: true },
  message: { type: String, required: true, allowNull: true },
  prev_message: { type: String, default: null },
  extra: { type: String, default: null },
  from: { type: String, default: null },
}, { timestamps: true });

const Log = model<ILog>("messages", messagesSchema);

export default Log;
