import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactRepository } from "@api/repositories/ContactRepository";
import { Contact, ContactORM } from "@api/models/Contact";
import { ORMService } from "@api/services/ORMService";

describe("ContactRepository", () => {
    const mockDate: Date = new Date("2024-01-15T10:00:00.000Z");

    const mockORM: ContactORM = Object.assign(new ContactORM(), {
        created_at: mockDate,
        email: "ferdi@example.com",
        description: "Test bericht",
        name: "Ferdi Arslan",
    });

    const mockContact: Contact = {
        created_at: mockDate,
        email: "ferdi@example.com",
        description: "Test bericht",
        name: "Ferdi Arslan",
    };

    function makeTypeORMStub(overrides: Partial<{
        find: () => Promise<ContactORM[]>;
        save: () => Promise<ContactORM>;
        create: (data: Partial<ContactORM>) => ContactORM;
        delete: () => Promise<{ affected: number }>;
    }> = {}): ReturnType<ORMService["getRepository"]> & { [key: string]: unknown } {
        return {
            find: vi.fn().mockResolvedValue([mockORM]),
            save: vi.fn().mockResolvedValue(mockORM),
            create: vi.fn().mockReturnValue(mockORM),
            delete: vi.fn().mockResolvedValue({ affected: 1 }),
            ...overrides,
        } as unknown as ReturnType<ORMService["getRepository"]> & { [key: string]: unknown };
    }

    function makeRepo(typeORMStub: ReturnType<typeof makeTypeORMStub>): ContactRepository {
        vi.spyOn(ORMService, "getInstance").mockReturnValue({
            getRepository: vi.fn().mockReturnValue(typeORMStub),
        } as unknown as ORMService);

        ContactRepository.resetInstance();

        return ContactRepository.getInstance();
    }

    afterEach(() => {
        vi.restoreAllMocks();
        ContactRepository.resetInstance();
    });

    describe("findAll", () => {
        it("mapt een ContactORM entiteit correct naar een plain Contact object", async () => {
            // Arrange
            const stub: ReturnType<typeof makeTypeORMStub> = makeTypeORMStub({ find: vi.fn().mockResolvedValue([mockORM]) });
            const repo: ContactRepository = makeRepo(stub);

            // Act
            const result: Contact[] = await repo.findAll();

            // Assert
            expect(result[0]).toEqual(mockContact);
        });

        it("geeft een lege array terug als de database leeg is", async () => {
            // Arrange
            const stub: ReturnType<typeof makeTypeORMStub> = makeTypeORMStub({ find: vi.fn().mockResolvedValue([]) });
            const repo: ContactRepository = makeRepo(stub);

            // Act
            const result: Contact[] = await repo.findAll();

            // Assert
            expect(result).toEqual([]);
        });

        it("mapt meerdere entiteiten correct", async () => {
            // Arrange
            const secondORM: ContactORM = Object.assign(new ContactORM(), mockORM, { email: "andere@example.com" });
            const stub: ReturnType<typeof makeTypeORMStub> = makeTypeORMStub({ find: vi.fn().mockResolvedValue([mockORM, secondORM]) });
            const repo: ContactRepository = makeRepo(stub);

            // Act
            const result: Contact[] = await repo.findAll();

            // Assert
            expect(result).toHaveLength(2);
            expect(result[1].email).toBe("andere@example.com");
        });
    });

    describe("create", () => {
        it("slaat een geldig contact op zonder fout", async () => {
            // Arrange
            const stub: ReturnType<typeof makeTypeORMStub> = makeTypeORMStub();
            const repo: ContactRepository = makeRepo(stub);

            // Act & Assert
            await expect(repo.create(mockContact)).resolves.not.toThrow();
        });

        it("gooit een fout als email ontbreekt", async () => {
            // Arrange
            const stub: ReturnType<typeof makeTypeORMStub> = makeTypeORMStub();
            const repo: ContactRepository = makeRepo(stub);
            const contactZonderEmail: Contact = { ...mockContact, email: "" };

            // Act & Assert
            await expect(repo.create(contactZonderEmail)).rejects.toThrow("Email is required");
        });

        it("roept repository.save aan na succesvolle validatie", async () => {
            // Arrange
            const stub: ReturnType<typeof makeTypeORMStub> = makeTypeORMStub();
            const repo: ContactRepository = makeRepo(stub);
            const saveSpy: ReturnType<typeof vi.spyOn> = vi.spyOn(stub, "save");

            // Act
            await repo.create(mockContact);

            // Assert
            expect(saveSpy).toHaveBeenCalledTimes(1);
        });

        it("roept repository.save niet aan als email ontbreekt", async () => {
            // Arrange
            const stub: ReturnType<typeof makeTypeORMStub> = makeTypeORMStub();
            const repo: ContactRepository = makeRepo(stub);
            const saveSpy: ReturnType<typeof vi.spyOn> = vi.spyOn(stub, "save");
            const contactZonderEmail: Contact = { ...mockContact, email: "" };

            // Act
            try {
                await repo.create(contactZonderEmail);
            }
            catch {
                /* verwacht */ }

            // Assert
            expect(saveSpy).not.toHaveBeenCalled();
        });
    });

    describe("delete", () => {
        it("geeft true terug als affected > 0", async () => {
            // Arrange
            const stub: ReturnType<typeof makeTypeORMStub> = makeTypeORMStub({ delete: vi.fn().mockResolvedValue({ affected: 1 }) });
            const repo: ContactRepository = makeRepo(stub);

            // Act
            const result: boolean = await repo.delete(mockDate);

            // Assert
            expect(result).toBe(true);
        });

        it("geeft false terug als affected === 0", async () => {
            // Arrange
            const stub: ReturnType<typeof makeTypeORMStub> = makeTypeORMStub({ delete: vi.fn().mockResolvedValue({ affected: 0 }) });
            const repo: ContactRepository = makeRepo(stub);

            // Act
            const result: boolean = await repo.delete(mockDate);

            // Assert
            expect(result).toBe(false);
        });

        it("geeft false terug als affected null/undefined is", async () => {
            // Arrange
            const stub: ReturnType<typeof makeTypeORMStub> = makeTypeORMStub({ delete: vi.fn().mockResolvedValue({ affected: null }) });
            const repo: ContactRepository = makeRepo(stub);

            // Act
            const result: boolean = await repo.delete(mockDate);

            // Assert
            expect(result).toBe(false);
        });

        it("roept delete aan met het juiste filter object", async () => {
            // Arrange
            const stub: ReturnType<typeof makeTypeORMStub> = makeTypeORMStub();
            const repo: ContactRepository = makeRepo(stub);
            const deleteSpy: ReturnType<typeof vi.spyOn> = vi.spyOn(stub, "delete");

            // Act
            await repo.delete(mockDate);

            // Assert
            expect(deleteSpy).toHaveBeenCalledWith({ created_at: mockDate });
        });
    });
});
