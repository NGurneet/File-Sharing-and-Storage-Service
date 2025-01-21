import mongoose from "mongoose";
import { type IUser } from "./user.dto";
import UserSchema from "./user.schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * Creates a new user in the database.
 * @param {IUser} data - The user data to create.
 * @returns {Promise<any>} - The created user document.
 */
export const createUser = async (data: IUser): Promise<any> => {
    const result = await UserSchema.create({ ...data, active: true });
    return result;
};

/**
 * Updates an existing user in the database by its ID.
 * @param {string} id - The ID of the user to update.
 * @param {IUser} data - The user data to update.
 * @returns {Promise<any>} - The updated user document.
 */
export const updateUser = async (id: string, data: IUser): Promise<any> => {
    const result = await UserSchema.findOneAndUpdate({ _id: id }, data, {
        new: true,
    });
    return result;
};

/**
 * Edits specific fields of a user based on its ID.
 * @param {string} id - The ID of the user to edit.
 * @param {Partial<IUser>} data - The user fields to update.
 * @returns {Promise<any>} - The updated user document.
 */
export const editUser = async (id: string, data: Partial<IUser>): Promise<any> => {
    const result = await UserSchema.findOneAndUpdate({ _id: id }, data);
    return result;
};

/**
 * Deletes a user from the database.
 * @param {string} id - The ID of the user to delete.
 * @returns {Promise<any>} - The result of the delete operation.
 */
export const deleteUser = async (id: string): Promise<any> => {
    const result = await UserSchema.deleteOne({ _id: id });
    return result;
};

/**
 * Retrieves a user by its ID from the database.
 * @param {string} id - The ID of the user to retrieve.
 * @returns {Promise<IUser | null>} - The user document if found, otherwise null.
 */
export const getUserById = async (id: string): Promise<IUser | null> => {
    const result = await UserSchema.findById(id).lean();
    return result;
};

/**
 * Retrieves all users from the database.
 * @returns {Promise<IUser[]>} - A list of all users.
 */
export const getAllUser = async (): Promise<IUser[]> => {
    const result = await UserSchema.find({}).lean();
    return result;
};

/**
 * Retrieves a user by their email.
 * @param {string} email - The email of the user to retrieve.
 * @returns {Promise<IUser | null>} - The user document if found, otherwise null.
 */
export const getUserByEmail = async (email: string): Promise<IUser | null> => {
    const result = await UserSchema.findOne({ email }).lean();
    return result;
};

/**
 * Generates an authentication token for a user.
 * @param {string} userId - The ID of the user to generate the token for.
 * @param {string} role - The role of the user.
 * @returns {string} - The generated JWT authentication token.
 */
export const generateAuthToken = (userId: string, role: string): string => {
    const token = jwt.sign({ _id: userId, role: role }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    return token;
};

/**
 * Generates a refresh token for a user.
 * @param {string} userId - The ID of the user to generate the refresh token for.
 * @returns {string} - The generated JWT refresh token.
 */
export const generateRefreshToken = (userId: string): string => {
    const refreshToken = jwt.sign({ _id: userId }, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });
    return refreshToken;
};

/**
 * Compares a plain password with a hashed password.
 * @param {string} plainPassword - The plain password to compare.
 * @param {string} hashedPassword - The hashed password to compare with.
 * @returns {Promise<boolean>} - True if the passwords match, otherwise false.
 */
export const comparePasswords = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

/**
 * Finds a user by their email.
 * @param {string} email - The email of the user to find.
 * @returns {Promise<IUser | null>} - The user document if found, otherwise null.
 */
export const findUserByEmail = async (email: string): Promise<IUser | null> => {
    const result = await UserSchema.findOne({ email });
    return result;
};

// Define the RefreshToken schema
const RefreshTokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now, expires: "7d" }, // Automatically deletes after 7 days
});

const RefreshTokenModel = mongoose.model("RefreshToken", RefreshTokenSchema);

/**
 * Saves a refresh token to the database.
 * @param {string} userId - The user ID associated with the refresh token.
 * @param {string} token - The refresh token to save.
 * @returns {Promise<any>} - The saved refresh token document.
 */
export const saveRefreshToken = async (userId: string, token: string): Promise<any> => {
    const refreshToken = new RefreshTokenModel({ userId, token });
    const result = await refreshToken.save();
    return result;
};

/**
 * Verifies the validity of a refresh token.
 * @param {string} token - The refresh token to verify.
 * @returns {Promise<any>} - Decoded token if valid, otherwise throws an error.
 * @throws {Error} If the token is invalid or expired.
 */
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
 * Deletes a specific refresh token from the database.
 * @param {string} token - The refresh token to delete.
 * @returns {Promise<any>} - The result of the delete operation.
 */
export const deleteRefreshToken = async (token: string): Promise<any> => {
    const result = await RefreshTokenModel.deleteOne({ token });
    return result;
};

/**
 * Deletes all refresh tokens associated with a user.
 * @param {string} userId - The user ID whose refresh tokens need to be deleted.
 * @returns {Promise<any>} - The result of the delete operation.
 */
export const deleteAllRefreshTokensForUser = async (userId: string): Promise<any> => {
    const result = await RefreshTokenModel.deleteMany({ userId });
    return result;
};
