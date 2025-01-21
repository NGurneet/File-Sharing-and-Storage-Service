
import mongoose from "mongoose";
import { type IUser } from "./user.dto";
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

/**
 * Hashes the password using bcrypt.
 * @param {string} password - The plain text password.
 * @returns {Promise<string>} - The hashed password.
 */
const hashPassword = async (password: string): Promise<string> => {
    const hash = await bcrypt.hash(password, 12);
    return hash;
};

/**
 * User schema definition for MongoDB.
 * @type {mongoose.Schema}
 */
const UserSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    active: { type: Boolean, required: false, default: true },
    role: { type: String, required: true, enum: ["USER", "ADMIN"], default: "USER" },
    password: { type: String, required: true },
}, { timestamps: true });

/**
 * Pre-save middleware to hash the password before saving.
 * @function
 * @param {Function} next - The next middleware function.
 */
UserSchema.pre("save", async function (next) {
    if (this.password) {
        this.password = await hashPassword(this.password);
    }
    next();
});

/**
 * User model based on the User schema.
 * @typedef {mongoose.Model<IUser>} UserModel
 */
export default mongoose.model<IUser>("user", UserSchema);

