import bcrypt from "bcryptjs";
import { UserRepository } from "@api/repositories/UserRepository";
import { User } from "@api/models/User";

/**
 * Service for handling user-related business logic.
 */
export class UserService {
    private static _instance: UserService | undefined;

    private constructor(private readonly userRepo: UserRepository) {
    }

    public static getInstance(): UserService {
        if (!UserService._instance) {
            UserService._instance = new UserService(UserRepository.getInstance());
        }

        return UserService._instance;
    }

    public static setInstance(repo: UserRepository): void {
        UserService._instance = new UserService(repo);
    }

    public async createUser(user: User): Promise<User> {
        await this.userRepo.create(user);

        return {
            email: user.email,
            name: user.name,
            password: "",
            department_name: user.department_name,
            role_name: user.role_name,
            location_address: user.location_address,
            location_city: user.location_city,
            schedule: user.schedule,
        };
    }

    public async getUserByEmail(email: string): Promise<User | null> {
        return this.userRepo.findByEmail(email);
    }

    public async verifyPassword(email: string, password: string): Promise<boolean> {
        const hashedPassword: string | null = await this.userRepo.findPasswordByEmail(email);

        if (!hashedPassword) {
            return false;
        }

        return bcrypt.compare(password, hashedPassword);
    }

    public async updateUser(email: string, user: Partial<User>): Promise<User | null> {
        const updated: boolean = await this.userRepo.update(email, user);

        if (!updated) {
            return null;
        }

        return this.userRepo.findByEmail(email);
    }

    public async deleteUser(email: string): Promise<boolean> {
        return this.userRepo.delete(email);
    }

    public async getAllUsers(): Promise<User[]> {
        return this.userRepo.findAll();
    }
}
