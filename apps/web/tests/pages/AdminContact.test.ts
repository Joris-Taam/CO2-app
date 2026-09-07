import { afterEach, describe, expect, it, vi, type MockInstance } from "vitest";
import { AdminContactService } from "@web/services/AdminContactService";
import { Contact } from "@web/Models/Contact";

vi.mock("@web/components/AdminSidebarComponent", () => ({}));
vi.mock("@web/components/contact/ContactTableComponent", () => ({}));
vi.mock("@web/components/contact/ContactViewModalComponent", () => ({}));

const mockContacts: Contact[] = [
    {
        name: "Ferdi Arslan",
        email: "ferdi@example.com",
        description: "Ik heb een vraag over mijn account.",
        created_at: new Date("2024-01-15T10:00:00.000Z"),
    },
    {
        name: "Jan de Vries",
        email: "jan@example.com",
        description: "Wanneer is mijn bestelling klaar?",
        created_at: new Date("2024-02-20T14:30:00.000Z"),
    },
];

const mockTableRender: MockInstance = vi.fn();
const mockModalOpen: MockInstance = vi.fn();
const mockModalClose: MockInstance = vi.fn();

class FakeContactTable extends HTMLElement {
    public render = mockTableRender;
}
class FakeContactModal extends HTMLElement {
    public open = mockModalOpen; public close = mockModalClose;
}

customElements.define("admin-contact-table", FakeContactTable);
customElements.define("admin-contact-modal", FakeContactModal);

vi.spyOn(AdminContactService.prototype, "getAll").mockResolvedValue(mockContacts);
vi.spyOn(AdminContactService.prototype, "delete").mockResolvedValue();

document.body.innerHTML = "<admin-contact-page></admin-contact-page>";

await import("@web/components/contact/ContactPageComponent");

await new Promise<void>(resolve => setTimeout(resolve, 0));

async function resetPage(): Promise<void> {
    vi.spyOn(AdminContactService.prototype, "getAll").mockResolvedValue(mockContacts);
    vi.spyOn(AdminContactService.prototype, "delete").mockResolvedValue();
    document.body.innerHTML = "<admin-contact-page></admin-contact-page>";
    await new Promise<void>(resolve => setTimeout(resolve, 0));
}

describe("ContactPageComponent", () => {
    afterEach(() => {
        vi.restoreAllMocks();
        mockTableRender.mockClear();
        mockModalOpen.mockClear();
        mockModalClose.mockClear();
    });

    describe("loadContacts", () => {
        it("logs a string error when getAll rejects with a non-Error value", async () => {
            vi.spyOn(AdminContactService.prototype, "getAll").mockRejectedValue("string error");
            const consoleSpy: MockInstance = vi.spyOn(console, "error").mockImplementation(() => {
            });

            document.body.innerHTML = "<admin-contact-page></admin-contact-page>";
            await new Promise<void>(resolve => setTimeout(resolve, 0));

            expect(consoleSpy).toHaveBeenCalledWith("string error");
        });

        it("calls table.render with the fetched contacts", async () => {
            const getAllSpy: MockInstance = vi.spyOn(AdminContactService.prototype, "getAll").mockResolvedValue(mockContacts);

            document.body.innerHTML = "<admin-contact-page></admin-contact-page>";
            await new Promise<void>(resolve => setTimeout(resolve, 0));

            expect(getAllSpy).toHaveBeenCalled();
            expect(mockTableRender).toHaveBeenCalledWith(mockContacts);
        });

        it("calls table.render with an empty array when there are no contacts", async () => {
            vi.spyOn(AdminContactService.prototype, "getAll").mockResolvedValue([]);

            document.body.innerHTML = "<admin-contact-page></admin-contact-page>";
            await new Promise<void>(resolve => setTimeout(resolve, 0));

            expect(mockTableRender).toHaveBeenCalledWith([]);
        });
    });

    describe("handleMoreInfo", () => {
        it("calls modal.open with the correct contact when contact-more-info is fired", async () => {
            await resetPage();
            const page: HTMLElement = document.querySelector("admin-contact-page")!;
            const dateStr: string = String(mockContacts[0].created_at);

            page.dispatchEvent(new CustomEvent("contact-more-info", { detail: dateStr, bubbles: true }));
            await new Promise<void>(resolve => setTimeout(resolve, 0));

            expect(mockModalOpen).toHaveBeenCalledWith(mockContacts[0]);
        });

        it("does not call modal.open when the contact is not found", async () => {
            await resetPage();
            const page: HTMLElement = document.querySelector("admin-contact-page")!;

            page.dispatchEvent(new CustomEvent("contact-more-info", { detail: "9999-01-01T00:00:00.000Z", bubbles: true }));
            await new Promise<void>(resolve => setTimeout(resolve, 0));

            expect(mockModalOpen).not.toHaveBeenCalled();
        });
    });

    describe("handleDelete", () => {
        it("calls service.delete with the correct date after confirmation", async () => {
            await resetPage();
            const deleteSpy: MockInstance = vi.spyOn(AdminContactService.prototype, "delete").mockResolvedValue();
            vi.spyOn(window, "confirm").mockReturnValue(true);

            const page: HTMLElement = document.querySelector("admin-contact-page")!;
            const dateStr: string = mockContacts[0].created_at.toISOString();

            page.dispatchEvent(new CustomEvent("contact-delete", { detail: dateStr, bubbles: true }));
            await new Promise<void>(resolve => setTimeout(resolve, 0));

            expect(deleteSpy).toHaveBeenCalledWith(new Date(dateStr));
        });

        it("does not call service.delete when the user cancels", async () => {
            await resetPage();
            const deleteSpy: MockInstance = vi.spyOn(AdminContactService.prototype, "delete").mockResolvedValue();
            vi.spyOn(window, "confirm").mockReturnValue(false);

            const page: HTMLElement = document.querySelector("admin-contact-page")!;

            page.dispatchEvent(new CustomEvent("contact-delete", { detail: mockContacts[0].created_at.toISOString(), bubbles: true }));
            await new Promise<void>(resolve => setTimeout(resolve, 0));

            expect(deleteSpy).not.toHaveBeenCalled();
        });

        it("logs a string error when delete rejects with a non-Error value", async () => {
            await resetPage();
            vi.spyOn(AdminContactService.prototype, "delete").mockRejectedValue("delete failed");
            vi.spyOn(window, "confirm").mockReturnValue(true);
            const consoleSpy: MockInstance = vi.spyOn(console, "error").mockImplementation(() => {
            });

            const page: HTMLElement = document.querySelector("admin-contact-page")!;

            page.dispatchEvent(new CustomEvent("contact-delete", { detail: mockContacts[0].created_at.toISOString(), bubbles: true }));
            await new Promise<void>(resolve => setTimeout(resolve, 0));

            expect(consoleSpy).toHaveBeenCalledWith("delete failed");
        });

        it("reloads the table after a successful delete", async () => {
            await resetPage();
            vi.spyOn(AdminContactService.prototype, "delete").mockResolvedValue();
            const getAllSpy: MockInstance = vi.spyOn(AdminContactService.prototype, "getAll").mockResolvedValue([mockContacts[1]]);
            vi.spyOn(window, "confirm").mockReturnValue(true);

            const page: HTMLElement = document.querySelector("admin-contact-page")!;

            page.dispatchEvent(new CustomEvent("contact-delete", { detail: mockContacts[0].created_at.toISOString(), bubbles: true }));
            await new Promise<void>(resolve => setTimeout(resolve, 0));

            expect(getAllSpy).toHaveBeenCalled();
            expect(mockTableRender).toHaveBeenCalledWith([mockContacts[1]]);
        });
    });
});
