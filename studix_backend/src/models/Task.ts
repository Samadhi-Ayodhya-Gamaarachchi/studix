import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  completed: boolean;
  dueDate?: Date;
}

const TaskSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  dueDate: { type: Date }
}, { timestamps: true });

export default mongoose.model<ITask>("Task", TaskSchema);
