import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from "vitest";
import { UserRepository } from "@web/repositories/UserRepository";
import { User } from "@web/Models/Users";

const API_URL: string = "http://localhost:3001/users";

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

function makeFetchMock(
    ok: boolean,
    body: unknown,
    status = 200
): Mock {
    return vi.fn().mockResolvedValue({
        ok,
        status,
        json: vi.fn().mockResolvedValue(body),
        text: vi.fn().mockResolvedValue(JSON.stringify(body)),
    });
}

describe("UserRepository", () => {
    let repository: UserRepository;

    beforeEach(() => {
        repository = new UserRepository();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("getAll", () => {
        it("returns a list of users on success", async () => {
            const users: User[] = [mockUser];
            globalThis.fetch = makeFetchMock(true, users);

            const result: Awaited<ReturnType<UserRepository["getAll"]>> =
                await repository.getAll();

            expect(fetch).toHaveBeenCalledWith(API_URL, { method: "GET" });
            expect(result).toEqual(users);
        });

        it("throws when the response is not ok", async () => {
            globalThis.fetch = makeFetchMock(false, null, 500);

            await expect(repository.getAll()).rejects.toThrow(
                "Failed to fetch users"
            );
        });
    });

    describe("getByEmail", () => {
        it("returns the correct user for a given email", async () => {
            globalThis.fetch = makeFetchMock(true, mockUser);

            const email: string = "jan@example.com";

            const result: Awaited<
                ReturnType<UserRepository["getByEmail"]>
            > = await repository.getByEmail(email);

            expect(fetch).toHaveBeenCalledWith(
                `${API_URL}/${encodeURIComponent(email)}`,
                { method: "GET", credentials: "include" }
            );

            expect(result).toEqual(mockUser);
        });

        it("throws when the user is not found", async () => {
            globalThis.fetch = makeFetchMock(false, null, 404);

            await expect(
                repository.getByEmail("missing@example.com")
            ).rejects.toThrow("Failed to fetch user");
        });
    });

    describe("create", () => {
        it("posts the user and returns the created user", async () => {
            globalThis.fetch = makeFetchMock(true, mockUser, 201);

            const result: Awaited<
                ReturnType<UserRepository["create"]>
            > = await repository.create(mockUser);

            expect(fetch).toHaveBeenCalledWith(API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(mockUser),
            });

            expect(result).toEqual(mockUser);
        });

        it("throws when creation fails", async () => {
            globalThis.fetch = makeFetchMock(false, null, 400);

            await expect(repository.create(mockUser)).rejects.toThrow(
                "Failed to create user"
            );
        });
    });

    describe("update", () => {
        it("sends PUT and returns the updated user", async () => {
            const patch: Partial<User> = { name: "Piet Pietersen" };
            const updated: User = { ...mockUser, ...patch };

            globalThis.fetch = makeFetchMock(true, updated);

            const email: string = "jan@example.com";

            const result: Awaited<
                ReturnType<UserRepository["update"]>
            > = await repository.update(email, patch);

            expect(fetch).toHaveBeenCalledWith(
                `${API_URL}/${encodeURIComponent(email)}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(patch),
                }
            );

            expect(result).toEqual(updated);
        });

        it("throws with an error message when update fails", async () => {
            globalThis.fetch = makeFetchMock(false, { error: "Conflict" }, 409);

            await expect(
                repository.update("jan@example.com", {})
            ).rejects.toThrow("Failed to update user");
        });
    });

    describe("delete", () => {
        it("sends DELETE for the given email", async () => {
            globalThis.fetch = makeFetchMock(true, null, 204);

            const email: string = "jan@example.com";

            await repository.delete(email);

            expect(fetch).toHaveBeenCalledWith(
                `${API_URL}/${encodeURIComponent(email)}`,
                { method: "DELETE" }
            );
        });

        it("throws when deletion fails", async () => {
            globalThis.fetch = makeFetchMock(false, null, 404);

            await expect(
                repository.delete("jan@example.com")
            ).rejects.toThrow("Failed to delete user");
        });
    });

    describe("updateProfile", () => {
        it("sends the schedule update without throwing", async () => {
            globalThis.fetch = makeFetchMock(true, null, 200);

            const email: string = "jan@example.com";

            const data: { schedule: string } = {
                schedule: "9-17",
            };

            await repository.updateProfile(email, data);

            expect(fetch).toHaveBeenCalledWith(
                `${API_URL}/${encodeURIComponent(email)}`,
                expect.objectContaining({
                    method: "PUT",
                    body: JSON.stringify(data),
                })
            );
        });

        it("throws when the server rejects the profile update", async () => {
            globalThis.fetch = makeFetchMock(false, null, 500);

            await expect(
                repository.updateProfile("jan@example.com", {
                    schedule: "9-17",
                })
            ).rejects.toThrow("Failed to update profile");
        });
    });

    describe("updateCredentials", () => {
        it("returns ok:true and status on success", async () => {
            globalThis.fetch = makeFetchMock(true, null, 200);

            const email: string = "jan@example.com";

            const payload: {
                currentPassword: string;
                password: string;
            } = {
                currentPassword: "secret",
                password: "newSecret123",
            };

            const result: Awaited<
                ReturnType<UserRepository["updateCredentials"]>
            > = await repository.updateCredentials(email, payload);

            expect(result).toEqual({ ok: true, status: 200 });
        });

        it("returns ok:false, status and message on failure", async () => {
            globalThis.fetch = makeFetchMock(
                false,
                { message: "Wrong password" },
                401
            );

            const email: string = "jan@example.com";

            const payload: {
                currentPassword: string;
            } = {
                currentPassword: "wrong",
            };

            const result: Awaited<
                ReturnType<UserRepository["updateCredentials"]>
            > = await repository.updateCredentials(email, payload);

            expect(result).toEqual({
                ok: false,
                status: 401,
                message: "Wrong password",
            });
        });

        it("returns ok:false with no message when body cannot be parsed", async () => {
            globalThis.fetch = vi.fn().mockResolvedValue({
                ok: false,
                status: 500,
                json: vi.fn().mockRejectedValue(new Error("parse error")),
            });

            const result: Awaited<
                ReturnType<UserRepository["updateCredentials"]>
            > = await repository.updateCredentials("jan@example.com", {
                currentPassword: "x",
            });

            expect(result.ok).toBe(false);
            expect(result.status).toBe(500);
            expect(result.message).toBeUndefined();
        });
    });
});
