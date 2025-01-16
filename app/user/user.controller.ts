
import * as userService from "./user.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from 'express'

export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.createUser(req.body);
    res.send(createResponse(result, "User created sucssefully"))
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.updateUser(req.params.id, req.body);
    res.send(createResponse(result, "User updated sucssefully"))
});

export const editUser = asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.editUser(req.params.id, req.body);
    res.send(createResponse(result, "User updated sucssefully"))
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.deleteUser(req.params.id);
    res.send(createResponse(result, "User deleted sucssefully"))
});


export const getUserById = asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.getUserById(req.params.id);
    res.send(createResponse(result))
});


export const getAllUser = asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.getAllUser();
    res.send(createResponse(result))
});

//login user
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
    const {email, password} = req.body

    const user = await userService.findUserByEmail(email);
    if (!user) {
        throw new Error("User not found");
    }

    const isPasswordValid = await userService.comparePasswords(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid credentials");
    }
    const refreshToken = userService.generateRefreshToken(user._id);

    // Save the refresh token in the database
    await userService.saveRefreshToken(user._id, refreshToken);


    const token = userService.generateAuthToken(user._id, user.role); 
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'local',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.cookie('token', token, {
        httpOnly: true,           // Ensures the cookie can't be accessed by client-side JavaScript
        secure: process.env.NODE_ENV === 'local', // Set to true in production (HTTPS only)
        maxAge: 3600000,          // Set the cookie expiry time (1 hour in milliseconds)
              
    });
    res.json(createResponse({ token }, "Login successful")); 
});

// Refresh Token Endpoint
export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        res.status(400).json({ message: "Refresh token is required" });
        return;
    }

    try {
        const decoded = await userService.verifyRefreshToken(refreshToken);
        const newAccessToken = userService.generateAuthToken(decoded._id, decoded.role);

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000, // 1 hour
        });

        res.json({
            message: "Access token refreshed successfully",
            accessToken: newAccessToken,
        });
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired refresh token" });
    }
});

// Logout Endpoint
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (refreshToken) {
        await userService.deleteRefreshToken(refreshToken);
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.json({ message: "Logged out successfully" });
});
