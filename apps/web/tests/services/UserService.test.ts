import { beforeEach, describe, expect, it, vi, type Mocked, type MockedClass } from "vitest";
import { UserService } from "@web/services/UserService";
import { UserRepository } from "@web/repositories/UserRepository";
import { User } from "@web/Models/Users";

vi.mock("@web/repositories/UserRepository");

const MockedUserRepository: MockedClass<typeof UserRepository> = vi.mocked(UserRepository) as MockedClass<typeof UserRepository>;

const mockUser: User = {
    name: "Jan Jansen",
    email: "jan@example.com",
    password: "secret",
    role_name: "Admin",
    department_name: "IT",
    location_address: "Hoofdstraat 1",
    location_city: "Amsterdam",
    schedule: "9-17",
};

describe("UserService", () => {
    let service: UserService;
    let repoMock: Mocked<UserRepository>;

    beforeEach(() => {
        MockedUserRepository.mockClear();
        service = new UserService();
        repoMock = MockedUserRepository.mock.instances[0] as Mocked<UserRepository>;
    });

    describe("getAll", () => {
        it("delegates to the repository and returns all users", async () => {
            const users: User[] = [mockUser];
            repoMock.getAll.mockResolvedValue(users);

            const result: User[] = await service.getAll();

            expect(repoMock.getAll.mock.calls).toHaveLength(1);
            expect(result).toEqual(users);
        });
    });

    describe("getByEmail", () => {
        it("delegates to the repository with the given email", async () => {
            repoMock.getByEmail.mockResolvedValue(mockUser);

            const email: string = "jan@example.com";

            const result: User = await service.getByEmail(email);

            expect(repoMock.getByEmail.mock.calls[0]).toEqual([email]);
            expect(result).toEqual(mockUser);
        });
    });

    describe("create", () => {
        it("delegates to the repository and returns the new user", async () => {
            repoMock.create.mockResolvedValue(mockUser);

            const result: User = await service.create(mockUser);

            expect(repoMock.create.mock.calls[0]).toEqual([mockUser]);
            expect(result).toEqual(mockUser);
        });
    });

    describe("update", () => {
        it("delegates to the repository with email and partial user data", async () => {
            const patch: Partial<User> = { name: "Nieuw Naam" };
            const updated: User = { ...mockUser, ...patch };

            repoMock.update.mockResolvedValue(updated);

            const email: string = "jan@example.com";

            const result: User = await service.update(email, patch);

            expect(repoMock.update.mock.calls[0]).toEqual([email, patch]);
            expect(result).toEqual(updated);
        });
    });

    describe("delete", () => {
        it("delegates to the repository with the given email", async () => {
            repoMock.delete.mockResolvedValue(undefined);

            const email: string = "jan@example.com";

            await service.delete(email);

            expect(repoMock.delete.mock.calls[0]).toEqual([email]);
        });
    });

    describe("updateProfile", () => {
        it("delegates profile update to the repository", async () => {
            repoMock.updateProfile.mockResolvedValue(undefined);

            const email: string = "jan@example.com";

            const data: { schedule: string } = {
                schedule: "9-17",
            };

            await service.updateProfile(email, data);

            expect(repoMock.updateProfile.mock.calls[0]).toEqual([
                email,
                data,
            ]);
        });
    });

    describe("updateCredentials", () => {
        it("returns the repository result on success", async () => {
            const expected: { ok: true; status: 200 } = {
                ok: true,
                status: 200,
            };

            repoMock.updateCredentials.mockResolvedValue(expected);

            const email: string = "jan@example.com";

            const payload: { currentPassword: string; password: string } = {
                currentPassword: "secret",
                password: "newSecret123",
            };

            const result: { ok: boolean; status: number; message?: string } = await service.updateCredentials(email, payload);

            expect(repoMock.updateCredentials.mock.calls[0]).toEqual([
                email,
                payload,
            ]);

            expect(result).toEqual(expected);
        });

        it("returns the repository result on failure", async () => {
            const expected: { ok: false; status: 401; message: string } = {
                ok: false,
                status: 401,
                message: "Ongeldig wachtwoord",
            };

            repoMock.updateCredentials.mockResolvedValue(expected);

            const result: { ok: boolean; status: number; message?: string } = await service.updateCredentials("jan@example.com", {
                currentPassword: "fout",
            });

            expect(result).toEqual(expected);
        });
    });
});
