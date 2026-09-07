import bcrypt from "bcryptjs";
import { Repository, UpdateResult, DeleteResult } from "typeorm";
import { ORMService } from "@api/services/ORMService";
import { User, UserORM } from "@api/models/User";

/**
 * Repository for performing CRUD operations on users via TypeORM.
 */
export class UserRepository {
    private static _instance: UserRepository | undefined;

    private constructor() {
    }

    public static getInstance(): UserRepository {
        if (!UserRepository._instance) {
            UserRepository._instance = new UserRepository();
        }

        return UserRepository._instance;
    }

    public static resetInstance(): void {
        UserRepository._instance = undefined;
    }

    private get repository(): Repository<UserORM> {
        return ORMService.getInstance().getRepository(UserORM);
    }

    /**
     * Maps a UserORM entity to a plain User object.
     *
     * @param entity - The UserORM entity to map
     * @returns A plain User object without sensitive data
     */
    private mapToUser(entity: UserORM): User {
        return {
            email: entity.email,
            name: entity.name,
            password: "",
            department_name: entity.department_name,
            role_name: entity.role_name,
            location_address: entity.location_address,
            location_city: entity.location_city,
            schedule: entity.schedule,
        };
    }

    /**
     * Retrieves all users from the database.
     *
     * @returns Array of all users
     */
    public async findAll(): Promise<User[]> {
        const entities: UserORM[] = await this.repository.find();

        return entities.map((entity: UserORM) => this.mapToUser(entity));
    }

    /**
     * Finds a user by their email address.
     *
     * @param email - The email address to search for
     * @returns The user if found, otherwise null
     */
    public async findByEmail(email: string): Promise<User | null> {
        const entity: UserORM | null = await this.repository.findOneBy({ email });

        return entity ? this.mapToUser(entity) : null;
    }

    /**
     * Retrieves the hashed password for a given email address.
     *
     * @param email - The email address to look up
     * @returns The hashed password if found, otherwise null
     */
    public async findPasswordByEmail(email: string): Promise<string | null> {
        const entity: UserORM | null = await this.repository
            .createQueryBuilder("user")
            .select("user.password")
            .where("user.email = :email", { email })
            .getOne();

        return entity?.password ?? null;
    }

    /**
     * Creates a new user in the database with a hashed password.
     *
     * @param user - The user data to persist
     * @throws Error if password is missing
     */
    public async create(user: User): Promise<void> {
        if (!user.password) {
            throw new Error("Password is required");
        }

        const entity: UserORM = this.repository.create({
            ...user,
            email: user.email ?? undefined,
            password: await bcrypt.hash(user.password, 10),
        });

        await this.repository.save(entity);
    }

    /**
     * Updates an existing user by email.
     *
     * @param email - The email of the user to update
     * @param user - Partial user data with the fields to update
     * @returns True if the user was updated, false if not found
     */
    public async update(email: string, user: Partial<User>): Promise<boolean> {
        const existing: UserORM | null = await this.repository.findOneBy({ email });

        if (!existing) {
            return false;
        }

        const updated: Partial<UserORM> = {
            name: user.name ?? existing.name,
            department_name: user.department_name ?? existing.department_name,
            role_name: user.role_name ?? existing.role_name,
            location_address: user.location_address ?? existing.location_address,
            location_city: user.location_city ?? existing.location_city,
            schedule: user.schedule ?? existing.schedule,
        };

        if (user.password && user.password.trim() !== "") {
            updated.password = await bcrypt.hash(user.password, 10);
        }

        const result: UpdateResult = await this.repository.update({ email }, updated);

        return (result.affected ?? 0) > 0;
    }

    /**
     * Deletes a user by their email address.
     *
     * @param email - The email of the user to delete
     * @returns True if the user was deleted, false if not found
     */
    public async delete(email: string): Promise<boolean> {
        const result: DeleteResult = await this.repository.delete({ email });

        return (result.affected ?? 0) > 0;
    }
}
