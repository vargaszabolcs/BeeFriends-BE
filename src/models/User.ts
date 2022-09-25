import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends mongoose.Document {
    email: string;
    full_name: string;
    password: string;
    registrationDate: Date;
    comparePasswords(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
    email: {
        type: String,
        unique: true,
        required: true
    },
    full_name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    registrationDate: {
        type: Date,
        default: Date.now
    }
});

userSchema.pre("save", function (next) {
    if (!this.isModified("password")) {
        return next();
    }

    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            return next(err);
        }

        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) {
                return next(err);
            }

            this.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePasswords = function(candidatePassword: string) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
            if (err) {
                return reject(err);
            }

            if (!isMatch) {
                return reject(false);
            }

            resolve(true);
        });
    });
};

export const User = mongoose.model<IUser>("User", userSchema);
