import { User } from "@api/models/User";

/**
 * Abstract base class defining the contract for user service implementations.
 */
export abstract class IUserService {
    /**
     * Creates a new user.
     *
     * @param user - The user data to create
     * @returns The created user
     */
    public abstract createUser(user: User): Promise<User>;

    /**
     * Retrieves a user by their email address.
     *
     * @param email - The email address to search for
     * @returns The user if found, otherwise null
     */
    public abstract getUserByEmail(email: string): Promise<User | null>;

    /**
     * Updates an existing user by email.
     *
     * @param email - The email of the user to update
     * @param user - Partial user data with the fields to update
     * @returns The updated user if found, otherwise null
     */
    public abstract updateUser(email: string, user: Partial<User>): Promise<User | null>;

    /**
     * Deletes a user by their email address.
     *
     * @param email - The email of the user to delete
     * @returns True if the user was deleted, false if not found
     */
    public abstract deleteUser(email: string): Promise<boolean>;

    /**
     * Retrieves all users.
     *
     * @returns Array of all users
     */
    public abstract getAllUsers(): Promise<User[]>;
}
