import mongoose from "mongoose";

export interface IBeehive extends mongoose.Document {
    name: string;
    location: string;
    description: string;
    color: string;
    assigned_number: number;
    population: number;
    birthday: Date;
    owner: mongoose.RefType;
}

const beehiveSchema = new mongoose.Schema<IBeehive>({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
    },
    description: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    assigned_number: {
        type: Number,
        required: true
    },
    population: {
        type: Number,
        default: 0
    },
    birthday: {
        type: Date,
        default: Date.now
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
});

export const Beehive = mongoose.model<IBeehive>("Beehive", beehiveSchema);
