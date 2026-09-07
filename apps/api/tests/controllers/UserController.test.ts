import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";

import { Request, Response } from "express";
import { UserController } from "@api/controllers/UserController";
import { User } from "@api/models/User";
import { AuthRequest } from "@api/middleware/AuthMiddleware";

const getAllUsersMock: Mock = vi.fn();
const getUserByEmailMock: Mock = vi.fn();
const createUserMock: Mock = vi.fn();
const updateUserMock: Mock = vi.fn();
const deleteUserMock: Mock = vi.fn();
const verifyPasswordMock: Mock = vi.fn();

vi.mock("@api/services/UserService", () => ({
    UserService: {
        getInstance: vi.fn(() => ({
            getAllUsers: getAllUsersMock,
            getUserByEmail: getUserByEmailMock,
            createUser: createUserMock,
            updateUser: updateUserMock,
            deleteUser: deleteUserMock,
            verifyPassword: verifyPasswordMock,
        })),
    },
}));

interface MockResponse extends Response {
    json: Mock;
    status: Mock;
}

const mockResponse: () => MockResponse = (): MockResponse => {
    const res: MockResponse = {} as MockResponse;

    res.json = vi.fn().mockReturnValue(res);
    res.status = vi.fn().mockReturnValue(res);

    return res;
};

const controller: UserController = UserController.getInstance();

beforeEach(() => {
    vi.clearAllMocks();
});

describe("UserController", () => {
    // -------------------------------------------------------------------------
    // getAllUsers
    // -------------------------------------------------------------------------
    describe("getAllUsers", () => {
        it("should return all users with status 200", async () => {
            // Arrange
            const users: User[] = [
                { email: "alice@example.com" } as User,
                { email: "bob@example.com" } as User,
            ];
            const req: Request = {} as Request;
            const res: MockResponse = mockResponse();

            getAllUsersMock.mockResolvedValue(users);

            // Act
            await controller.getAllUsers(req, res);

            // Assert
            expect(getAllUsersMock).toHaveBeenCalledTimes(1);
            expect(res.json).toHaveBeenCalledWith(users);
        });

        it("should return 500 when the service throws an error", async () => {
            // Arrange
            const req: Request = {} as Request;
            const res: MockResponse = mockResponse();

            getAllUsersMock.mockRejectedValue(new Error("DB error"));

            // Act
            await controller.getAllUsers(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
        });
    });

    // -------------------------------------------------------------------------
    // getUserByEmail
    // -------------------------------------------------------------------------
    describe("getUserByEmail", () => {
        it("should return the user when found", async () => {
            // Arrange
            const user: User = { email: "alice@example.com" } as User;
            const req: Request<{ email: string }> = { params: { email: "alice@example.com" } } as Request<{ email: string }>;
            const res: MockResponse = mockResponse();

            getUserByEmailMock.mockResolvedValue(user);

            // Act
            await controller.getUserByEmail(req, res);

            // Assert
            expect(getUserByEmailMock).toHaveBeenCalledWith("alice@example.com");
            expect(res.json).toHaveBeenCalledWith(user);
        });

        it("should return 404 when the user is not found", async () => {
            // Arrange
            const req: Request<{ email: string }> = { params: { email: "ghost@example.com" } } as Request<{ email: string }>;
            const res: MockResponse = mockResponse();

            getUserByEmailMock.mockResolvedValue(null);

            // Act
            await controller.getUserByEmail(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
        });
    });

    // -------------------------------------------------------------------------
    // createUser
    // -------------------------------------------------------------------------
    describe("createUser", () => {
        it("should create a user and return 201 with the created user", async () => {
            // Arrange
            const newUser: User = { email: "new@example.com", password: "secret" } as User;
            const req: Request = { body: newUser } as Request;
            const res: MockResponse = mockResponse();

            createUserMock.mockResolvedValue(newUser);

            // Act
            await controller.createUser(req, res);

            // Assert
            expect(createUserMock).toHaveBeenCalledWith(newUser);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(newUser);
        });
    });

    // -------------------------------------------------------------------------
    // updateUser
    // -------------------------------------------------------------------------
    describe("updateUser", () => {
        it("should update the user and return the updated user", async () => {
            // Arrange
            const updatedUser: User = { email: "alice@example.com", name: "Alice Updated" } as User;
            const req: Request<{ email: string }> = {
                params: { email: "alice@example.com" },
                body: { name: "Alice Updated" },
            } as unknown as Request<{ email: string }>;
            const res: MockResponse = mockResponse();

            updateUserMock.mockResolvedValue(updatedUser);

            // Act
            await controller.updateUser(req, res);

            // Assert
            expect(updateUserMock).toHaveBeenCalledWith("alice@example.com", { name: "Alice Updated" });
            expect(res.json).toHaveBeenCalledWith(updatedUser);
        });

        it("should return 400 when a new password is provided without the current password", async () => {
            // Arrange
            const req: Request<{ email: string }> = {
                params: { email: "alice@example.com" },
                body: { password: "newSecret" },
            } as unknown as Request<{ email: string }>;
            const res: MockResponse = mockResponse();

            // Act
            await controller.updateUser(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: "Huidig wachtwoord is verplicht" });
        });

        it("should return 401 when the current password is incorrect", async () => {
            // Arrange
            const req: Request<{ email: string }> = {
                params: { email: "alice@example.com" },
                body: { password: "newSecret", currentPassword: "wrongPassword" },
            } as unknown as Request<{ email: string }>;
            const res: MockResponse = mockResponse();

            verifyPasswordMock.mockResolvedValue(false);

            // Act
            await controller.updateUser(req, res);

            // Assert
            expect(verifyPasswordMock).toHaveBeenCalledWith("alice@example.com", "wrongPassword");
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({ message: "Huidig wachtwoord is onjuist" });
        });

        it("should update the password when the current password is correct", async () => {
            // Arrange
            const updatedUser: User = { email: "alice@example.com", password: "newHash" } as User;
            const req: Request<{ email: string }> = {
                params: { email: "alice@example.com" },
                body: { password: "newSecret", currentPassword: "correctPassword" },
            } as unknown as Request<{ email: string }>;
            const res: MockResponse = mockResponse();

            verifyPasswordMock.mockResolvedValue(true);
            updateUserMock.mockResolvedValue(updatedUser);

            // Act
            await controller.updateUser(req, res);

            // Assert
            expect(verifyPasswordMock).toHaveBeenCalledWith("alice@example.com", "correctPassword");
            expect(updateUserMock).toHaveBeenCalledWith("alice@example.com", { password: "newSecret" });
            expect(res.json).toHaveBeenCalledWith(updatedUser);
        });

        it("should return 404 when the user to update is not found", async () => {
            // Arrange
            const req: Request<{ email: string }> = {
                params: { email: "ghost@example.com" },
                body: { name: "Ghost" },
            } as unknown as Request<{ email: string }>;
            const res: MockResponse = mockResponse();

            updateUserMock.mockResolvedValue(null);

            // Act
            await controller.updateUser(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
        });
    });

    // -------------------------------------------------------------------------
    // deleteUser
    // -------------------------------------------------------------------------
    describe("deleteUser", () => {
        it("should delete the user and return a success message", async () => {
            // Arrange
            const req: Request<{ email: string }> = { params: { email: "alice@example.com" } } as Request<{ email: string }>;
            const res: MockResponse = mockResponse();

            deleteUserMock.mockResolvedValue(true);

            // Act
            await controller.deleteUser(req, res);

            // Assert
            expect(deleteUserMock).toHaveBeenCalledWith("alice@example.com");
            expect(res.json).toHaveBeenCalledWith({ message: "User deleted successfully" });
        });

        it("should return 404 when the user to delete is not found", async () => {
            // Arrange
            const req: Request<{ email: string }> = { params: { email: "ghost@example.com" } } as Request<{ email: string }>;
            const res: MockResponse = mockResponse();

            deleteUserMock.mockResolvedValue(false);

            // Act
            await controller.deleteUser(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
        });
    });

    // -------------------------------------------------------------------------
    // getCurrentUser
    // -------------------------------------------------------------------------
    describe("getCurrentUser", () => {
        it("should return the currently authenticated user", async () => {
            // Arrange
            const user: User = { email: "alice@example.com" } as User;
            const req: AuthRequest = { user: { email: "alice@example.com" } } as AuthRequest;
            const res: MockResponse = mockResponse();

            getUserByEmailMock.mockResolvedValue(user);

            // Act
            await controller.getCurrentUser(req, res);

            // Assert
            expect(getUserByEmailMock).toHaveBeenCalledWith("alice@example.com");
            expect(res.json).toHaveBeenCalledWith(user);
        });

        it("should return 404 when the authenticated user is not found in the database", async () => {
            // Arrange
            const req: AuthRequest = { user: { email: "ghost@example.com" } } as AuthRequest;
            const res: MockResponse = mockResponse();

            getUserByEmailMock.mockResolvedValue(null);

            // Act
            await controller.getCurrentUser(req, res);

            // Assert
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
        });
    });
});
