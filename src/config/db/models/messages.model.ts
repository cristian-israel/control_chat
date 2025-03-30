import { Schema, model, Document } from "mongoose";

// Interface do log
interface ILog extends Document {
  id: string;
  message: string;
  type: string;
  from: string;
}

const messagesSchema = new Schema<ILog>({
  id: { type: String, required: true },
  message: { type: String, required: true }
});

const Log = model<ILog>("messages", messagesSchema);

export default Log;
