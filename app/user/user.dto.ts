import { type BaseSchema } from "../common/dto/base.dto";

/**
 * Represents a User object in the system, extending the BaseSchema.
 *
 * @interface IUser
 * @extends {BaseSchema}
 */
export interface IUser extends BaseSchema {
    /**
     * The full name of the user.
     * 
     * @type {string}
     */
    name: string;
  
    /**
     * The email address of the user, used for authentication and notifications.
     * 
     * @type {string}
     */
    email: string;

    /**
     * The activation status of the user account. Defaults to true (active).
     * 
     * @type {boolean}
     * @optional
     */
    active?: boolean;

    /**
     * The role of the user in the system, either "USER" or "ADMIN".
     * Defines the level of access and privileges for the user.
     * 
     * @type {("USER" | "ADMIN")}
     */
    role: "USER" | "ADMIN";
  
    /**
     * The hashed password for the user, used for authentication.
     * 
     * @type {string}
     */
    password: string;
}


// import { type BaseSchema } from "../common/dto/base.dto";

// export interface IUser extends BaseSchema {
//         name: string;
//         email: string;
//         active?: boolean;
//         role: "USER" | "ADMIN";
//         password: string
// }
