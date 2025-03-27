import { Schema, model, Document } from "mongoose";

// Interface do log
interface ILog extends Document {
  message: string;
  timestamp: Date;
}

const LogSchema = new Schema<ILog>({
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const Log = model<ILog>("Log", LogSchema);

export default Log;
