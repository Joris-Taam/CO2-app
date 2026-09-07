import { describe, expect, it, vi, afterEach } from "vitest";
import type { Mock } from "vitest";
import { AdminContactRepository } from "@web/repositories/AdminContactRepository";
import { Contact } from "@web/Models/Contact";

const mockContacts: Contact[] = [
    {
        name: "Ferdi Arslan",
        email: "ferdi@example.com",
        description: "Ik heb een vraag over mijn account.",
        created_at: "2024-01-15T10:00:00.000Z" as unknown as Date,
    },
];

afterEach(() => {
    vi.restoreAllMocks();
});

describe("AdminContactRepository", () => {
    describe("getAll", () => {
        it("returns contacts when the response is ok", async () => {
            vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify(mockContacts), { status: 200 }));

            const repo: AdminContactRepository = new AdminContactRepository();
            const result: Contact[] = await repo.getAll();

            expect(result[0].email).toBe(mockContacts[0].email);
            expect(result[0].name).toBe(mockContacts[0].name);
            expect(result[0].description).toBe(mockContacts[0].description);
        });

        it("throws an error when the response is not ok", async () => {
            vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 500 }));

            const repo: AdminContactRepository = new AdminContactRepository();

            await expect(repo.getAll()).rejects.toThrow("Failed to fetch contacts");
        });

        it("calls fetch with the correct URL and method", async () => {
            const fetchSpy: Mock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify(mockContacts), { status: 200 }));

            const repo: AdminContactRepository = new AdminContactRepository();
            await repo.getAll();

            expect(fetchSpy).toHaveBeenCalledWith("http://localhost:3001/contact", { method: "GET" });
        });
    });

    describe("delete", () => {
        it("resolves without error when the response is ok", async () => {
            vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }));

            const repo: AdminContactRepository = new AdminContactRepository();

            await expect(repo.delete(new Date("2024-01-15T10:00:00.000Z"))).resolves.not.toThrow();
        });

        it("throws an error when the response is not ok", async () => {
            vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 404 }));

            const repo: AdminContactRepository = new AdminContactRepository();

            await expect(repo.delete(new Date("2024-01-15T10:00:00.000Z"))).rejects.toThrow("Failed to delete user");
        });

        it("calls fetch with the correct encoded URL and method", async () => {
            const fetchSpy: Mock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 200 }));
            const date: Date = new Date("2024-01-15T10:00:00.000Z");

            const repo: AdminContactRepository = new AdminContactRepository();
            await repo.delete(date);

            const expectedUrl: string = `http://localhost:3001/contact/${encodeURIComponent(date.toISOString())}`;
            expect(fetchSpy).toHaveBeenCalledWith(expectedUrl, { method: "DELETE" });
        });
    });
});
