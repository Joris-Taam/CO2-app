import { describe, expect, it, vi, afterEach, type MockInstance } from "vitest";
import { AdminContactService } from "@web/services/AdminContactService";
import { AdminContactRepository } from "@web/repositories/AdminContactRepository";
import { Contact } from "@web/Models/Contact";

const mockContacts: Contact[] = [
    {
        name: "Ferdi Arslan",
        email: "ferdi@example.com",
        description: "Ik heb een vraag over mijn account.",
        created_at: new Date("2024-01-15T10:00:00.000Z"),
    },
];

afterEach(() => {
    vi.restoreAllMocks();
});

describe("AdminContactService", () => {
    describe("getAll", () => {
        it("returns contacts from the repository", async () => {
            vi.spyOn(AdminContactRepository.prototype, "getAll").mockResolvedValue(mockContacts);

            const service: AdminContactService = new AdminContactService();
            const result: Contact[] = await service.getAll();

            expect(result).toEqual(mockContacts);
        });

        it("calls repository.getAll once", async () => {
            const getAllSpy: MockInstance = vi.spyOn(AdminContactRepository.prototype, "getAll").mockResolvedValue(mockContacts);

            const service: AdminContactService = new AdminContactService();
            await service.getAll();

            expect(getAllSpy).toHaveBeenCalledTimes(1);
        });

        it("throws when the repository throws", async () => {
            vi.spyOn(AdminContactRepository.prototype, "getAll").mockRejectedValue(new Error("Failed to fetch contacts"));

            const service: AdminContactService = new AdminContactService();

            await expect(service.getAll()).rejects.toThrow("Failed to fetch contacts");
        });
    });

    describe("delete", () => {
        it("calls repository.delete with the correct date", async () => {
            const deleteSpy: MockInstance = vi.spyOn(AdminContactRepository.prototype, "delete").mockResolvedValue();
            const date: Date = new Date("2024-01-15T10:00:00.000Z");

            const service: AdminContactService = new AdminContactService();
            await service.delete(date);

            expect(deleteSpy).toHaveBeenCalledWith(date);
        });

        it("resolves without error on success", async () => {
            vi.spyOn(AdminContactRepository.prototype, "delete").mockResolvedValue();

            const service: AdminContactService = new AdminContactService();

            await expect(service.delete(new Date("2024-01-15T10:00:00.000Z"))).resolves.not.toThrow();
        });

        it("throws when the repository throws", async () => {
            vi.spyOn(AdminContactRepository.prototype, "delete").mockRejectedValue(new Error("Failed to delete user"));

            const service: AdminContactService = new AdminContactService();

            await expect(service.delete(new Date("2024-01-15T10:00:00.000Z"))).rejects.toThrow("Failed to delete user");
        });
    });
});
