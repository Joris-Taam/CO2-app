import { afterEach, describe, expect, it, vi } from "vitest";
import { Request, Response } from "express";
import { ContactController } from "@api/controllers/ContactController";
import { ContactService } from "@api/services/ContactService";
import { Contact } from "@api/models/Contact";

describe("ContactController", () => {
    const mockContact: Contact = {
        email: "ferdi@example.com",
        description: "Test bericht",
        name: "Ferdi Arslan",
        created_at: new Date("2024-01-15T10:00:00.000Z"),
    };

    function makeRes(): Partial<Response> {
        const res: Partial<Response> = {};
        res.json = vi.fn().mockReturnValue(res);
        res.status = vi.fn().mockReturnValue(res);

        return res;
    }

    function makeReq(overrides: Partial<Request> = {}): Partial<Request> {
        return { body: {}, params: {}, ...overrides } as Partial<Request>;
    }

    function mockServiceWith(overrides: Partial<{
        getAllContacts: () => Promise<Contact[]>;
        createContact: (c: Contact) => Promise<Contact>;
        deleteContact: (d: Date) => Promise<boolean>;
    }> = {}): void {
        vi.spyOn(ContactService, "getInstance").mockReturnValue({
            getAllContacts: vi.fn().mockResolvedValue([mockContact]),
            createContact: vi.fn().mockResolvedValue(mockContact),
            deleteContact: vi.fn().mockResolvedValue(true),
            ...overrides,
        } as unknown as ContactService);
    }

    afterEach(() => {
        vi.restoreAllMocks();
        (ContactController as unknown as { _instance: undefined })._instance = undefined;
    });

    describe("getAllContacts", () => {
        it("reageert met status 200 en een lijst van contacts", async () => {
            // Arrange
            mockServiceWith();
            const controller: ContactController = ContactController.getInstance();
            const req: Partial<Request> = makeReq();
            const res: Partial<Response> = makeRes();

            // Act
            await controller.getAllContacts(req as Request, res as Response);

            // Assert
            expect(res.json).toHaveBeenCalledWith([mockContact]);
        });

        it("reageert met status 500 als de service een fout gooit", async () => {
            // Arrange
            mockServiceWith({
                getAllContacts: vi.fn().mockRejectedValue(new Error("DB error")),
            });
            const controller: ContactController = ContactController.getInstance();
            const req: Partial<Request> = makeReq();
            const res: Partial<Response> = makeRes();

            // Act
            await controller.getAllContacts(req as Request, res as Response);

            // Assert
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ message: "Server error" });
        });

        it("reageert met een lege array als er geen contacts zijn", async () => {
            // Arrange
            mockServiceWith({ getAllContacts: vi.fn().mockResolvedValue([]) });
            const controller: ContactController = ContactController.getInstance();
            const req: Partial<Request> = makeReq();
            const res: Partial<Response> = makeRes();

            // Act
            await controller.getAllContacts(req as Request, res as Response);

            // Assert
            expect(res.json).toHaveBeenCalledWith([]);
        });
    });

    describe("createContact", () => {
        it("reageert met status 201 en het aangemaakte contact (happy path)", async () => {
            // Arrange
            mockServiceWith();
            const controller: ContactController = ContactController.getInstance();
            const req: Partial<Request> = makeReq({ body: mockContact });
            const res: Partial<Response> = makeRes();

            // Act
            await controller.createContact(req as Request, res as Response);

            // Assert
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(mockContact);
        });

        it("geeft de body van het request door aan de service (whitebox)", async () => {
            // Arrange
            const createSpy: (c: Contact) => Promise<Contact> = vi.fn().mockResolvedValue(mockContact);
            mockServiceWith({ createContact: createSpy });
            const controller: ContactController = ContactController.getInstance();
            const req: Partial<Request> = makeReq({ body: mockContact });
            const res: Partial<Response> = makeRes();

            // Act
            await controller.createContact(req as Request, res as Response);

            // Assert
            expect(createSpy).toHaveBeenCalledWith(mockContact);
        });
    });

    describe("deleteContact", () => {
        it("reageert met een succesbericht als het contact bestaat", async () => {
            // Arrange
            mockServiceWith({ deleteContact: vi.fn().mockResolvedValue(true) });
            const controller: ContactController = ContactController.getInstance();
            const dateStr: string = "2024-01-15T10:00:00.000Z";
            const req: Partial<Request> = makeReq({ params: { created_at: dateStr } as unknown as Request["params"] });
            const res: Partial<Response> = makeRes();

            // Act
            await controller.deleteContact(
                req as unknown as Request<{ created_at: Date }>,
                res as Response
            );

            // Assert
            expect(res.json).toHaveBeenCalledWith({ message: "Contact deleted successfully" });
        });

        it("reageert met status 404 als het contact niet bestaat", async () => {
            // Arrange
            mockServiceWith({ deleteContact: vi.fn().mockResolvedValue(false) });
            const controller: ContactController = ContactController.getInstance();
            const dateStr: string = "2099-01-01T00:00:00.000Z";
            const req: Partial<Request> = makeReq({ params: { created_at: dateStr } as unknown as Request["params"] });
            const res: Partial<Response> = makeRes();

            // Act
            await controller.deleteContact(
                req as unknown as Request<{ created_at: Date }>,
                res as Response
            );

            // Assert
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: "Contact not found" });
        });

        it("geeft de parsed datum door aan de service", async () => {
            // Arrange
            const deleteSpy: (d: Date) => Promise<boolean> = vi.fn().mockResolvedValue(true);
            mockServiceWith({ deleteContact: deleteSpy });
            const controller: ContactController = ContactController.getInstance();
            const dateStr: string = "2024-01-15T10:00:00.000Z";
            const req: Partial<Request> = makeReq({ params: { created_at: dateStr } as unknown as Request["params"] });
            const res: Partial<Response> = makeRes();

            // Act
            await controller.deleteContact(
                req as unknown as Request<{ created_at: Date }>,
                res as Response
            );

            // Assert
            expect(deleteSpy).toHaveBeenCalledWith(new Date(dateStr));
        });
    });
});
