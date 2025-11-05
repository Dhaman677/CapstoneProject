import mongoose, { Schema, Document } from "mongoose";

export interface IAudit extends Document {
  actorId: mongoose.Types.ObjectId;
  targetUserId: mongoose.Types.ObjectId;
  oldRole: string;
  newRole: string;
  timestamp: Date;
}

const AuditSchema = new Schema<IAudit>({
  actorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  targetUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  oldRole: { type: String, required: true },
  newRole: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const AuditModel = mongoose.model<IAudit>("Audit", AuditSchema);
