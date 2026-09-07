/* eslint-disable @typescript-eslint/unbound-method */
import { afterEach, describe, expect, it, vi, type Mocked } from "vitest";
import { ContactService } from "@api/services/ContactService";
import { ContactRepository } from "@api/repositories/ContactRepository";
import { Contact } from "@api/models/Contact";

describe("ContactService", () => {
    const mockContact: Contact = {
        email: "ferdi@example.com",
        description: "Ik heb een vraag over mijn account.",
        name: "Ferdi Arslan",
        created_at: new Date("2024-01-15T10:00:00.000Z"),
    };

    function makeRepoStub(overrides: Partial<{
        create: () => Promise<void>;
        findAll: () => Promise<Contact[]>;
        delete: () => Promise<boolean>;
    }> = {}): Mocked<ContactRepository> {
        return {
            create: vi.fn().mockResolvedValue(undefined),
            findAll: vi.fn().mockResolvedValue([mockContact]),
            delete: vi.fn().mockResolvedValue(true),
            ...overrides,
        } as unknown as Mocked<ContactRepository>;
    }

    function makeService(repo: Mocked<ContactRepository>): ContactService {
        ContactService.setInstance(repo);

        return ContactService.getInstance();
    }

    afterEach(() => {
        (ContactService as unknown as { _instance: undefined })._instance = undefined;
    });

    describe("createContact", () => {
        it("geeft het aangemaakte contact terug", async () => {
            // Arrange
            const repo: Mocked<ContactRepository> = makeRepoStub();
            const service: ContactService = makeService(repo);

            // Act
            const result: Contact = await service.createContact(mockContact);

            // Assert
            expect(result).toEqual(mockContact);
        });

        it("roept repository.create aan met de juiste data", async () => {
            // Arrange
            const repo: Mocked<ContactRepository> = makeRepoStub();
            const service: ContactService = makeService(repo);

            // Act
            await service.createContact(mockContact);

            // Assert
            expect(repo.create).toHaveBeenCalledTimes(1);
            expect(repo.create).toHaveBeenCalledWith(mockContact);
        });

        it("geeft alle velden correct terug", async () => {
            // Arrange
            const repo: Mocked<ContactRepository> = makeRepoStub();
            const service: ContactService = makeService(repo);

            // Act
            const result: Contact = await service.createContact(mockContact);

            // Assert — whitebox: elk veld expliciet checken
            expect(result.email).toBe(mockContact.email);
            expect(result.description).toBe(mockContact.description);
            expect(result.name).toBe(mockContact.name);
            expect(result.created_at).toEqual(mockContact.created_at);
        });

        it("gooit een fout als de repository faalt", async () => {
            // Arrange
            const repo: Mocked<ContactRepository> = makeRepoStub({
                create: vi.fn().mockRejectedValue(new Error("DB connection lost")),
            });
            const service: ContactService = makeService(repo);

            // Act & Assert
            await expect(service.createContact(mockContact)).rejects.toThrow("DB connection lost");
        });
    });

    describe("getAllContacts", () => {
        it("geeft een lijst van contacts terug", async () => {
            // Arrange
            const contacts: Contact[] = [mockContact, { ...mockContact, email: "andere@example.com" }];
            const repo: Mocked<ContactRepository> = makeRepoStub({ findAll: vi.fn().mockResolvedValue(contacts) });
            const service: ContactService = makeService(repo);

            // Act
            const result: Contact[] = await service.getAllContacts();

            // Assert
            expect(result).toHaveLength(2);
            expect(result).toEqual(contacts);
        });

        it("geeft een lege array terug als er geen contacts zijn", async () => {
            // Arrange
            const repo: Mocked<ContactRepository> = makeRepoStub({ findAll: vi.fn().mockResolvedValue([]) });
            const service: ContactService = makeService(repo);

            // Act
            const result: Contact[] = await service.getAllContacts();

            // Assert
            expect(result).toEqual([]);
        });

        it("roept repository.findAll precies één keer aan", async () => {
            // Arrange
            const repo: Mocked<ContactRepository> = makeRepoStub();
            const service: ContactService = makeService(repo);

            // Act
            await service.getAllContacts();

            // Assert — mock: we controleren gedrag
            expect(repo.findAll).toHaveBeenCalledTimes(1);
        });

        it("gooit een fout als de repository faalt", async () => {
            // Arrange
            const repo: Mocked<ContactRepository> = makeRepoStub({
                findAll: vi.fn().mockRejectedValue(new Error("Query timeout")),
            });
            const service: ContactService = makeService(repo);

            // Act & Assert
            await expect(service.getAllContacts()).rejects.toThrow("Query timeout");
        });
    });

    describe("deleteContact", () => {
        const targetDate: Date = new Date("2024-01-15T10:00:00.000Z");

        it("geeft true terug als het contact bestaat en verwijderd is", async () => {
            // Arrange
            const repo: Mocked<ContactRepository> = makeRepoStub({ delete: vi.fn().mockResolvedValue(true) });
            const service: ContactService = makeService(repo);

            // Act
            const result: boolean = await service.deleteContact(targetDate);

            // Assert
            expect(result).toBe(true);
        });

        it("geeft false terug als het contact niet bestaat", async () => {
            // Arrange
            const repo: Mocked<ContactRepository> = makeRepoStub({ delete: vi.fn().mockResolvedValue(false) });
            const service: ContactService = makeService(repo);

            // Act
            const result: boolean = await service.deleteContact(targetDate);

            // Assert
            expect(result).toBe(false);
        });

        it("roept repository.delete aan met de juiste datum", async () => {
            // Arrange
            const repo: Mocked<ContactRepository> = makeRepoStub();
            const service: ContactService = makeService(repo);

            // Act
            await service.deleteContact(targetDate);

            // Assert
            expect(repo.delete).toHaveBeenCalledWith(targetDate);
        });

        it("gooit een fout als de repository faalt", async () => {
            // Arrange
            const repo: Mocked<ContactRepository> = makeRepoStub({
                delete: vi.fn().mockRejectedValue(new Error("Deadlock detected")),
            });
            const service: ContactService = makeService(repo);

            // Act & Assert
            await expect(service.deleteContact(targetDate)).rejects.toThrow("Deadlock detected");
        });
    });
});
