import * as userService from "./user.service";
import { createResponse } from "../common/helper/response.hepler";
import asyncHandler from "express-async-handler";
import { type Request, type Response } from 'express';

/**
 * Creates a new user by calling the user service.
 * @param {Request} req - The Express request object containing user data.
 * @param {Response} res - The Express response object to send the result.
 * @returns {Promise<void>} - Sends the response with the result of the user creation.
 */
// export const createUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
//     const result = await userService.createUser(req.body);
//     res.send(createResponse(result, "User created successfully"));
// });

export const createUser = asyncHandler(async (req: Request, res: Response) => {
    const {email} = req.body
    const existingUser = await userService.findUserByEmail(email)
    if(existingUser){
        throw new Error("User already exists")
    }
    const result = await userService.createUser(req.body);
    res.send(createResponse(result, "User created sucssefully"))
});


/**
 * Updates an existing user by its ID.
 * @param {Request} req - The Express request object containing the user ID in the params and the data in the body.
 * @param {Response} res - The Express response object to send the result.
 * @returns {Promise<void>} - Sends the response with the result of the user update.
 */
export const updateUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await userService.updateUser(req.params.id, req.body);
    res.send(createResponse(result, "User updated successfully"));
});

/**
 * Edits specific fields of an existing user by its ID.
 * @param {Request} req - The Express request object containing the user ID in the params and the updated data in the body.
 * @param {Response} res - The Express response object to send the result.
 * @returns {Promise<void>} - Sends the response with the result of the user update.
 */
export const editUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await userService.editUser(req.params.id, req.body);
    res.send(createResponse(result, "User updated successfully"));
});

/**
 * Deletes an existing user by its ID.
 * @param {Request} req - The Express request object containing the user ID in the params.
 * @param {Response} res - The Express response object to send the result.
 * @returns {Promise<void>} - Sends the response with the result of the user deletion.
 */
export const deleteUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await userService.deleteUser(req.params.id);
    res.send(createResponse(result, "User deleted successfully"));
});

/**
 * Retrieves a user by their ID.
 * @param {Request} req - The Express request object containing the user ID in the params.
 * @param {Response} res - The Express response object to send the result.
 * @returns {Promise<void>} - Sends the response with the user data or an error if not found.
 */
export const getUserById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await userService.getUserById(req.params.id);
    res.send(createResponse(result));
});

/**
 * Retrieves all users from the database.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object to send the list of users.
 * @returns {Promise<void>} - Sends the response with the list of users.
 */
export const getAllUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const result = await userService.getAllUser();
    res.send(createResponse(result));
});

/**
 * Authenticates a user and generates authentication tokens.
 * @param {Request} req - The Express request object containing user credentials (email and password) in the body.
 * @param {Response} res - The Express response object to send the result with authentication tokens.
 * @returns {Promise<void>} - Sends the response with the generated JWT tokens.
 * @throws {Error} If user is not found or credentials are invalid.
 */
export const loginUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const user = await userService.findUserByEmail(email);
    if (!user) {
        throw new Error("User not found");
    }

    const isPasswordValid = await userService.comparePasswords(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Invalid credentials");
    }
    const refreshToken = userService.generateRefreshToken(user._id);
    console.log("Refresh token:", refreshToken);
    // Save the refresh token in the database
    await userService.saveRefreshToken(user._id, refreshToken);

    const token = userService.generateAuthToken(user._id, user.role);

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'local',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    console.log("Refresh token:", refreshToken);

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'local', // Set to true in production (HTTPS only)
        maxAge: 3600000, // 1 hour in milliseconds
    });
    console.log("Token:", token);
    res.json(createResponse({ token }, "Login successful"));
});

/**
 * Refreshes the access token using a valid refresh token.
 * @param {Request} req - The Express request object containing the refresh token in the body.
 * @param {Response} res - The Express response object to send the refreshed access token.
 * @returns {Promise<void>} - Sends the response with the new access token.
 * @throws {Error} If refresh token is invalid or expired.
 */
export const refreshAccessToken = asyncHandler(async (req: Request, res: Response): Promise<void> => {
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

/**
 * Logs out the user by clearing authentication and refresh tokens.
 * @param {Request} req - The Express request object containing the refresh token in the body.
 * @param {Response} res - The Express response object to send the logout response.
 * @returns {Promise<void>} - Sends the response indicating the successful logout.
 */
export const logoutUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { refreshToken } = req.body;

    if (refreshToken) {
        await userService.deleteRefreshToken(refreshToken);
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    res.json({ message: "Logged out successfully" });
});



// import * as userService from "./user.service";
// import { createResponse } from "../common/helper/response.hepler";
// import asyncHandler from "express-async-handler";
// import { type Request, type Response } from 'express'

// export const createUser = asyncHandler(async (req: Request, res: Response) => {
//     const result = await userService.createUser(req.body);
//     res.send(createResponse(result, "User created sucssefully"))
// });

// export const updateUser = asyncHandler(async (req: Request, res: Response) => {
//     const result = await userService.updateUser(req.params.id, req.body);
//     res.send(createResponse(result, "User updated sucssefully"))
// });

// export const editUser = asyncHandler(async (req: Request, res: Response) => {
//     const result = await userService.editUser(req.params.id, req.body);
//     res.send(createResponse(result, "User updated sucssefully"))
// });

// export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
//     const result = await userService.deleteUser(req.params.id);
//     res.send(createResponse(result, "User deleted sucssefully"))
// });


// export const getUserById = asyncHandler(async (req: Request, res: Response) => {
//     const result = await userService.getUserById(req.params.id);
//     res.send(createResponse(result))
// });


// export const getAllUser = asyncHandler(async (req: Request, res: Response) => {
//     const result = await userService.getAllUser();
//     res.send(createResponse(result))
// });

// //login user
// export const loginUser = asyncHandler(async (req: Request, res: Response) => {
//     const {email, password} = req.body

//     const user = await userService.findUserByEmail(email);
//     if (!user) {
//         throw new Error("User not found");
//     }

//     const isPasswordValid = await userService.comparePasswords(password, user.password);
//     if (!isPasswordValid) {
//         throw new Error("Invalid credentials");
//     }
//     const refreshToken = userService.generateRefreshToken(user._id);

//     // Save the refresh token in the database
//     await userService.saveRefreshToken(user._id, refreshToken);


//     const token = userService.generateAuthToken(user._id, user.role); 
//     res.cookie('refreshToken', refreshToken, {
//         httpOnly: true,
//         secure: process.env.NODE_ENV === 'local',
//         maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
//     });

//     res.cookie('token', token, {
//         httpOnly: true,           // Ensures the cookie can't be accessed by client-side JavaScript
//         secure: process.env.NODE_ENV === 'local', // Set to true in production (HTTPS only)
//         maxAge: 3600000,          // Set the cookie expiry time (1 hour in milliseconds)
              
//     });
//     res.json(createResponse({ token }, "Login successful")); 
// });

// // Refresh Token Endpoint
// export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
//     const { refreshToken } = req.body;

//     if (!refreshToken) {
//         res.status(400).json({ message: "Refresh token is required" });
//         return;
//     }

//     try {
//         const decoded = await userService.verifyRefreshToken(refreshToken);
//         const newAccessToken = userService.generateAuthToken(decoded._id, decoded.role);

//         res.cookie('accessToken', newAccessToken, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             maxAge: 3600000, // 1 hour
//         });

//         res.json({
//             message: "Access token refreshed successfully",
//             accessToken: newAccessToken,
//         });
//     } catch (error) {
//         res.status(401).json({ message: "Invalid or expired refresh token" });
//     }
// });

// // Logout Endpoint
// export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
//     const { refreshToken } = req.body;

//     if (refreshToken) {
//         await userService.deleteRefreshToken(refreshToken);
//     }

//     res.clearCookie('accessToken');
//     res.clearCookie('refreshToken');

//     res.json({ message: "Logged out successfully" });
// });


