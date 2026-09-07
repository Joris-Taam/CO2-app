import { User } from "@web/Models/Users";
import { UserRepository } from "../repositories/UserRepository";

export class UserService {
    private userRepository: UserRepository;

    public constructor() {
        this.userRepository = new UserRepository();
    }

    // Get all users
    public async getAll(): Promise<User[]> {
        return this.userRepository.getAll();
    }

    // Get user by email
    public async getByEmail(email: string): Promise<User> {
        return this.userRepository.getByEmail(email);
    }

    // Create user
    public async create(user: User): Promise<User> {
        return this.userRepository.create(user);
    }

    // Update user
    public async update(email: string, user: Partial<User>): Promise<User> {
        return this.userRepository.update(email, user);
    }

    // Delete user
    public async delete(email: string): Promise<void> {
        return this.userRepository.delete(email);
    }

    // Update profile fields
    public async updateProfile(
        email: string,
        data: { schedule: string }
    ): Promise<void> {
        return this.userRepository.updateProfile(email, data);
    }

    // Update login credentials
    public async updateCredentials(
        email: string,
        data: { currentPassword: string; email?: string; password?: string }
    ): Promise<{ ok: boolean; status: number; message?: string }> {
        return this.userRepository.updateCredentials(email, data);
    }
}
