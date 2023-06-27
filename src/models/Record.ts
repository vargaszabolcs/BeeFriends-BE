import mongoose from "mongoose";

export interface IRecord extends mongoose.Document {
    type: "harvest" | "feeding" | "inspection" | "treatment" | "other";
    amount: number;
    date: Date;
    description: string;
    beehive: mongoose.RefType;
    owner: mongoose.RefType;
}

const recordSchema = new mongoose.Schema<IRecord>({
    type: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    beehive: {
        type: mongoose.Types.ObjectId,
        ref: "Beehive",
    },
});

export const Record = mongoose.model<IRecord>("Record", recordSchema);
