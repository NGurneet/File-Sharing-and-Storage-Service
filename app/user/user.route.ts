import express from "express";
import * as userController from "./user.controller";

const router = express.Router();

/**
 * POST /api/users
 * Route to create a new user.
 * It invokes the `createUser` controller to handle user creation logic.
 */
router.post("/", userController.createUser);

/**
 * PUT /api/users/:id
 * Route to update an existing user's data by user ID.
 * It invokes the `updateUser` controller to handle updating the user.
 * @param {string} id - The ID of the user to be updated (passed as a parameter in the route).
 */
router.put("/:id", userController.updateUser);

/**
 * PATCH /api/users/:id
 * Route to partially update an existing user's data.
 * It invokes the `editUser` controller to handle editing the user data.
 * @param {string} id - The ID of the user to be partially updated (passed as a parameter in the route).
 */
router.patch("/:id", userController.editUser);

/**
 * DELETE /api/users/:id
 * Route to delete a user by ID.
 * It invokes the `deleteUser` controller to handle the user deletion.
 * @param {string} id - The ID of the user to be deleted (passed as a parameter in the route).
 */
router.delete("/:id", userController.deleteUser);

/**
 * GET /api/users/:id
 * Route to get a user by ID.
 * It invokes the `getUserById` controller to retrieve user data.
 * @param {string} id - The ID of the user to fetch (passed as a parameter in the route).
 */
router.get("/:id", userController.getUserById);

/**
 * GET /api/users
 * Route to get all users.
 * It invokes the `getAllUser` controller to retrieve a list of users.
 */
router.get("/", userController.getAllUser);

/**
 * POST /api/users/login
 * Route to log a user in and generate access & refresh tokens.
 * It invokes the `loginUser` controller to handle user authentication.
 */
router.post("/login", userController.loginUser);

/**
 * POST /api/users/refresh-token
 * Route to refresh access token using a refresh token.
 * It invokes the `refreshAccessToken` controller.
 */
router.post("/refresh-token", userController.refreshAccessToken);

/**
 * POST /api/users/logout
 * Route to log the user out by clearing cookies and tokens.
 * It invokes the `logoutUser` controller.
 */
router.post("/logout", userController.logoutUser);

export default router;


// import { Router } from "express";
// import { catchError } from "../common/middleware/cath-error.middleware";
// import * as userController from "./user.controller";
// import * as userValidator from "./user.validation";

// const router = Router();

// router
//         .get("/", userController.getAllUser)
//         .get("/:id", userController.getUserById)
//         .delete("/:id", userController.deleteUser)
//         .post("/", userValidator.createUser, catchError, userController.createUser)
//         .put("/:id", userValidator.updateUser, catchError, userController.updateUser)
//         .patch("/:id", userValidator.editUser, catchError, userController.editUser)
//         .post("/login", userValidator.loginUser, catchError, userController.loginUser)

// export default router;

