
import mongoose from "mongoose";
import { type IUser } from "./user.dto";
import UserSchema from "./user.schema";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export const createUser = async (data: IUser) => {
    const result = await UserSchema.create({ ...data, active: true });
    return result;
};

export const updateUser = async (id: string, data: IUser) => {
    const result = await UserSchema.findOneAndUpdate({ _id: id }, data, {
        new: true,
    });
    return result;
};

export const editUser = async (id: string, data: Partial<IUser>) => {
    const result = await UserSchema.findOneAndUpdate({ _id: id }, data);
    return result;
};

export const deleteUser = async (id: string) => {
    const result = await UserSchema.deleteOne({ _id: id });
    return result;
};

export const getUserById = async (id: string) => {
    const result = await UserSchema.findById(id).lean();
    return result;
};

export const getAllUser = async () => {
    const result = await UserSchema.find({}).lean();
    return result;
};
export const getUserByEmail = async (email: string) => {
    const result = await UserSchema.findOne({ email }).lean();
    return result;
}

export const generateAuthToken = (userId: string, role: string) => {
    const token = jwt.sign({ _id: userId, role: role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    return token;
};


export const generateRefreshToken = (userId: string) => {
    const refreshToken = jwt.sign({ _id: userId }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });
    return refreshToken;
};


export const comparePasswords = async (plainPassword: string, hashedPassword: string) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};



export const findUserByEmail = async(email: string) => {
    const result = await UserSchema.findOne({email})
    return result
};

// Define the RefreshToken schema
const RefreshTokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now, expires: "7d" }, // Automatically deletes after 7 days
});

const RefreshTokenModel = mongoose.model("RefreshToken", RefreshTokenSchema);

/**
 * Save a refresh token to the database
 * @param {string} userId - The user ID
 * @param {string} token - The refresh token
 * @returns {Promise<any>} - The saved refresh token document
 */
export const saveRefreshToken = async (userId: string, token: string): Promise<any> => {
    const refreshToken = new RefreshTokenModel({ userId, token });
    const result = await refreshToken.save();
    return result;
};

/**
 * Verify a refresh token
 * @param {string} token - The refresh token to verify
 * @returns {Promise<any>} - Decoded token if valid, otherwise throws an error
 */
// export const verifyRefreshToken = async (token: string): Promise<any> => {
//     try {
//         const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
//         const savedToken = await RefreshTokenModel.findOne({ token });
//         if (!savedToken) {
//             throw new Error("Invalid refresh token");
//         }
//         return decoded;
//     } catch (error) {
//         throw new Error("Invalid or expired refresh token");
//     }
// };
export const verifyRefreshToken = async (token: string): Promise<any> => {
    try {
        // Ensure the secret exists
        const secret = process.env.REFRESH_TOKEN_SECRET;
        if (!secret) {
            throw new Error("Refresh token secret is not defined in the environment variables");
        }

        // Verify the token
        const decoded = jwt.verify(token, secret);

        // Check if the token exists in the database
        const savedToken = await RefreshTokenModel.findOne({ token });
        if (!savedToken) {
            throw new Error("Invalid refresh token");
        }

        return decoded;
    } catch (error) {
        throw new Error("Invalid or expired refresh token");
    }
};

/**
 * Delete a specific refresh token from the database
 * @param {string} token - The refresh token to delete
 * @returns {Promise<any>} - The result of the delete operation
 */
export const deleteRefreshToken = async (token: string): Promise<any> => {
    const result = await RefreshTokenModel.deleteOne({ token });
    return result;
};

/**
 * Delete all refresh tokens associated with a user
 * @param {string} userId - The user ID
 * @returns {Promise<any>} - The result of the delete operation
 */
export const deleteAllRefreshTokensForUser = async (userId: string): Promise<any> => {
    const result = await RefreshTokenModel.deleteMany({ userId });
    return result;
};

