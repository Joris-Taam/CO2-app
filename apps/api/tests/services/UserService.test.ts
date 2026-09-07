import { beforeEach, describe, expect, it, vi } from "vitest";

import { UserService } from "@api/services/UserService";
import { UserRepository } from "@api/repositories/UserRepository";
import { User } from "@api/models/User";
import { Role } from "@shared/enums";

vi.mock("bcryptjs", () => ({
    default: {
        hash: vi.fn().mockResolvedValue("hashedSecret"),
        compare: vi.fn().mockResolvedValue(true),
    },
}));

const findAllMock: ReturnType<typeof vi.fn> = vi.fn();
const findByEmailMock: ReturnType<typeof vi.fn> = vi.fn();
const findPasswordByEmailMock: ReturnType<typeof vi.fn> = vi.fn();
const createMock: ReturnType<typeof vi.fn> = vi.fn();
const updateMock: ReturnType<typeof vi.fn> = vi.fn();
const deleteMock: ReturnType<typeof vi.fn> = vi.fn();

const mockRepo: UserRepository = {
    findAll: findAllMock,
    findByEmail: findByEmailMock,
    findPasswordByEmail: findPasswordByEmailMock,
    create: createMock,
    update: updateMock,
    delete: deleteMock,
} as unknown as UserRepository;

const mockUser: User = {
    email: "admin@test.com",
    name: "Admin User",
    password: "secret123",
    department_name: "IT",
    role_name: Role.Admin,
    location_address: "123 Main St",
    location_city: "Amsterdam",
    schedule: "9-5",
};

beforeEach(() => {
    vi.clearAllMocks();
    UserService.setInstance(mockRepo);
});

describe("UserService", () => {
    describe("createUser", () => {
        it("should create a user and return it without the password", async () => {
            // Arrange
            const service: UserService = UserService.getInstance();
            createMock.mockResolvedValue(undefined);

            // Act
            const result: User = await service.createUser(mockUser);

            // Assert
            expect(createMock).toHaveBeenCalledWith(mockUser);
            expect(result.email).toBe(mockUser.email);
            expect(result.password).toBe("");
        });
    });

    describe("getUserByEmail", () => {
        it("should return a user when found", async () => {
            // Arrange
            const service: UserService = UserService.getInstance();
            findByEmailMock.mockResolvedValue(mockUser);

            // Act
            const result: User | null = await service.getUserByEmail("admin@test.com");

            // Assert
            expect(findByEmailMock).toHaveBeenCalledWith("admin@test.com");
            expect(result).toEqual(mockUser);
        });

        it("should return null when user is not found", async () => {
            // Arrange
            const service: UserService = UserService.getInstance();
            findByEmailMock.mockResolvedValue(null);

            // Act
            const result: User | null = await service.getUserByEmail("notfound@test.com");

            // Assert
            expect(result).toBeNull();
        });
    });

    describe("verifyPassword", () => {
        it("should return true when password matches", async () => {
            // Arrange
            const service: UserService = UserService.getInstance();
            const bcrypt: typeof import("bcryptjs") = await import("bcryptjs");
            findPasswordByEmailMock.mockResolvedValue("hashedSecret");
            vi.mocked(bcrypt.default.compare).mockResolvedValue(true as never);

            // Act
            const result: boolean = await service.verifyPassword("admin@test.com", "secret123");

            // Assert
            expect(findPasswordByEmailMock).toHaveBeenCalledWith("admin@test.com");
            expect(result).toBe(true);
        });

        it("should return false when no password exists for the email", async () => {
            // Arrange
            const service: UserService = UserService.getInstance();
            findPasswordByEmailMock.mockResolvedValue(null);

            // Act
            const result: boolean = await service.verifyPassword("ghost@test.com", "secret123");

            // Assert
            expect(result).toBe(false);
        });

        it("should return false when password does not match", async () => {
            // Arrange
            const service: UserService = UserService.getInstance();
            const bcrypt: typeof import("bcryptjs") = await import("bcryptjs");
            findPasswordByEmailMock.mockResolvedValue("hashedSecret");
            vi.mocked(bcrypt.default.compare).mockResolvedValue(false as never);

            // Act
            const result: boolean = await service.verifyPassword("admin@test.com", "wrongpassword");

            // Assert
            expect(result).toBe(false);
        });
    });

    describe("updateUser", () => {
        it("should return the updated user when update succeeds", async () => {
            // Arrange
            const service: UserService = UserService.getInstance();
            const updatedUser: User = { ...mockUser, name: "Updated Name" };
            updateMock.mockResolvedValue(true);
            findByEmailMock.mockResolvedValue(updatedUser);

            // Act
            const result: User | null = await service.updateUser("admin@test.com", { name: "Updated Name" });

            // Assert
            expect(updateMock).toHaveBeenCalledWith("admin@test.com", { name: "Updated Name" });
            expect(result?.name).toBe("Updated Name");
        });

        it("should return null when user to update is not found", async () => {
            // Arrange
            const service: UserService = UserService.getInstance();
            updateMock.mockResolvedValue(false);

            // Act
            const result: User | null = await service.updateUser("ghost@test.com", { name: "Ghost" });

            // Assert
            expect(result).toBeNull();
            expect(findByEmailMock).not.toHaveBeenCalled();
        });
    });

    describe("deleteUser", () => {
        it("should return true when user is deleted", async () => {
            // Arrange
            const service: UserService = UserService.getInstance();
            deleteMock.mockResolvedValue(true);

            // Act
            const result: boolean = await service.deleteUser("admin@test.com");

            // Assert
            expect(deleteMock).toHaveBeenCalledWith("admin@test.com");
            expect(result).toBe(true);
        });

        it("should return false when user does not exist", async () => {
            // Arrange
            const service: UserService = UserService.getInstance();
            deleteMock.mockResolvedValue(false);

            // Act
            const result: boolean = await service.deleteUser("ghost@test.com");

            // Assert
            expect(result).toBe(false);
        });
    });

    describe("getAllUsers", () => {
        it("should return all users", async () => {
            // Arrange
            const service: UserService = UserService.getInstance();
            findAllMock.mockResolvedValue([mockUser]);

            // Act
            const result: User[] = await service.getAllUsers();

            // Assert
            expect(findAllMock).toHaveBeenCalled();
            expect(result).toHaveLength(1);
            expect(result[0].email).toBe("admin@test.com");
        });

        it("should return an empty array when no users exist", async () => {
            // Arrange
            const service: UserService = UserService.getInstance();
            findAllMock.mockResolvedValue([]);

            // Act
            const result: User[] = await service.getAllUsers();

            // Assert
            expect(result).toEqual([]);
        });
    });
});
