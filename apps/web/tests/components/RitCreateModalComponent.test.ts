import userEvent, { UserEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { deepQuerySelector } from "../__helpers__/web.helpers";

import "@web/components/trips/Ritcreatemodalcomponent ";
import { RitCreateModalComponent } from "@web/components/trips/Ritcreatemodalcomponent ";
import { RitService } from "@web/services/TripService";

beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    document.body.innerHTML = "";
    document.cookie = "user=test%40test.com";
});

function mountModal(): RitCreateModalComponent {
    const modal: RitCreateModalComponent = document.createElement("rit-create-modal") as RitCreateModalComponent;
    document.body.append(modal);

    return modal;
}

describe("RitCreateModalComponent", () => {
    // --- open / close ---

    describe("open and close", () => {
        it("should show the overlay when open() is called", () => {
            // Arrange
            const modal: RitCreateModalComponent = mountModal();

            // Act
            modal.open();

            // Assert
            const overlay: HTMLElement | null = deepQuerySelector(document, "#rit-overlay");
            expect(overlay!.classList.contains("show")).toBe(true);
        });

        it("should close when clicking on the overlay background", () => {
            // Arrange
            const modal: RitCreateModalComponent = mountModal();
            modal.open();

            // Act
            const overlay: HTMLElement | null = deepQuerySelector(document, "#rit-overlay");
            overlay!.dispatchEvent(new MouseEvent("click", { bubbles: true }));

            // Assert
            expect(overlay!.classList.contains("show")).toBe(false);
        });

        it("should hide the overlay when close() is called", () => {
            // Arrange
            const modal: RitCreateModalComponent = mountModal();
            modal.open();

            // Act
            modal.close();

            // Assert
            const overlay: HTMLElement | null = deepQuerySelector(document, "#rit-overlay");
            expect(overlay!.classList.contains("show")).toBe(false);
        });

        it("should close when the close button is clicked", async () => {
            // Arrange
            const modal: RitCreateModalComponent = mountModal();
            modal.open();

            // Act
            const user: UserEvent = userEvent.setup();
            await user.click(deepQuerySelector(document, "#close-btn") as HTMLElement);

            // Assert
            const overlay: HTMLElement | null = deepQuerySelector(document, "#rit-overlay");
            expect(overlay!.classList.contains("show")).toBe(false);
        });
    });

    // --- validation ---

    describe("validation", () => {
        it("should show adres1 error when adres1 is empty on submit", async () => {
            // Arrange
            const modal: RitCreateModalComponent = mountModal();
            modal.open();

            // Act
            const form: HTMLFormElement = deepQuerySelector(document, "#rit-form") as HTMLFormElement;
            form.dispatchEvent(new Event("submit"));
            await new Promise(r => setTimeout(r, 10));

            // Assert
            const error: HTMLElement | null = deepQuerySelector(document, "#adres1Error");
            expect(error!.textContent).toBe("Adres 1 is verplicht");
        });

        it("should show kilometers error when kilometers is 0", async () => {
            // Arrange
            const modal: RitCreateModalComponent = mountModal();
            modal.open();

            const user: UserEvent = userEvent.setup();
            await user.type(deepQuerySelector(document, "#adres1") as HTMLInputElement, "Amsterdam");
            await user.type(deepQuerySelector(document, "#adres2") as HTMLInputElement, "Rotterdam");

            // Act
            const form: HTMLFormElement = deepQuerySelector(document, "#rit-form") as HTMLFormElement;
            form.dispatchEvent(new Event("submit"));
            await new Promise(r => setTimeout(r, 10));

            // Assert
            const error: HTMLElement | null = deepQuerySelector(document, "#kilometersError");
            expect(error!.textContent).toBe("Voer een geldig aantal kilometers in");
        });
    });

    // --- successful create ---

    describe("successful create", () => {
        it("should dispatch rit-created event after successful save", async () => {
            // Arrange
            vi.spyOn(RitService.prototype, "createRit").mockResolvedValue({
                createdAt: "2024-01-01 10:00:00",
                adres1: "Amsterdam",
                adres2: "Rotterdam",
                kilometers: 75,
                soortRit: "zakelijk",
                soortVoertuig: "auto",
                brandstof: "benzine",
            });

            const modal: RitCreateModalComponent = mountModal();
            modal.open();

            const eventHandler: Mock = vi.fn();
            modal.addEventListener("rit-created", eventHandler);

            const user: UserEvent = userEvent.setup();
            await user.type(deepQuerySelector(document, "#adres1") as HTMLInputElement, "Amsterdam");
            await user.type(deepQuerySelector(document, "#adres2") as HTMLInputElement, "Rotterdam");
            await user.type(deepQuerySelector(document, "#kilometers") as HTMLInputElement, "75");

            const soortRit: HTMLSelectElement = deepQuerySelector(document, "#soortRit") as HTMLSelectElement;
            const soortVoertuig: HTMLSelectElement = deepQuerySelector(document, "#soortVoertuig") as HTMLSelectElement;
            const brandstof: HTMLSelectElement = deepQuerySelector(document, "#brandstof") as HTMLSelectElement;
            soortRit.value = "zakelijk";
            soortVoertuig.value = "auto";
            brandstof.value = "benzine";

            // Act
            const form: HTMLFormElement = deepQuerySelector(document, "#rit-form") as HTMLFormElement;
            form.dispatchEvent(new Event("submit"));
            await new Promise(r => setTimeout(r, 50));

            // Assert
            expect(eventHandler).toHaveBeenCalledTimes(1);

            modal.removeEventListener("rit-created", eventHandler);
        });

        it("should show success message after saving", async () => {
            // Arrange
            vi.spyOn(RitService.prototype, "createRit").mockResolvedValue({
                createdAt: "2024-01-01 10:00:00",
                adres1: "Amsterdam",
                adres2: "Rotterdam",
                kilometers: 75,
                soortRit: "zakelijk",
                soortVoertuig: "auto",
                brandstof: "benzine",
            });

            const modal: RitCreateModalComponent = mountModal();
            modal.open();

            const user: UserEvent = userEvent.setup();
            await user.type(deepQuerySelector(document, "#adres1") as HTMLInputElement, "Amsterdam");
            await user.type(deepQuerySelector(document, "#adres2") as HTMLInputElement, "Rotterdam");
            await user.type(deepQuerySelector(document, "#kilometers") as HTMLInputElement, "75");

            const soortRit: HTMLSelectElement = deepQuerySelector(document, "#soortRit") as HTMLSelectElement;
            const soortVoertuig: HTMLSelectElement = deepQuerySelector(document, "#soortVoertuig") as HTMLSelectElement;
            const brandstof: HTMLSelectElement = deepQuerySelector(document, "#brandstof") as HTMLSelectElement;
            soortRit.value = "zakelijk";
            soortVoertuig.value = "auto";
            brandstof.value = "benzine";

            // Act
            const form: HTMLFormElement = deepQuerySelector(document, "#rit-form") as HTMLFormElement;
            form.dispatchEvent(new Event("submit"));
            await new Promise(r => setTimeout(r, 50));

            // Assert
            const bericht: HTMLElement | null = deepQuerySelector(document, "#succesBericht");
            expect(bericht!.textContent).toBe("Rit succesvol opgeslagen!");
        });
    });

    // --- no cookie ---

    describe("no cookie", () => {
        it("should alert and not save when no user cookie is set", async () => {
            // Arrange
            document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
            const alertSpy: Mock = vi.spyOn(window, "alert").mockImplementation(() => undefined);
            const createSpy: Mock = vi.spyOn(RitService.prototype, "createRit");

            const modal: RitCreateModalComponent = mountModal();
            modal.open();

            const user: UserEvent = userEvent.setup();
            await user.type(deepQuerySelector(document, "#adres1") as HTMLInputElement, "Amsterdam");
            await user.type(deepQuerySelector(document, "#adres2") as HTMLInputElement, "Rotterdam");
            await user.type(deepQuerySelector(document, "#kilometers") as HTMLInputElement, "75");
            const soortRit: HTMLSelectElement = deepQuerySelector(document, "#soortRit") as HTMLSelectElement;
            const soortVoertuig: HTMLSelectElement = deepQuerySelector(document, "#soortVoertuig") as HTMLSelectElement;
            const brandstof: HTMLSelectElement = deepQuerySelector(document, "#brandstof") as HTMLSelectElement;
            soortRit.value = "zakelijk";
            soortVoertuig.value = "auto";
            brandstof.value = "benzine";

            // Act
            const form: HTMLFormElement = deepQuerySelector(document, "#rit-form") as HTMLFormElement;
            form.dispatchEvent(new Event("submit"));
            await new Promise(r => setTimeout(r, 50));

            // Assert
            expect(alertSpy).toHaveBeenCalledWith("Je bent niet ingelogd. Log opnieuw in.");
            expect(createSpy).not.toHaveBeenCalled();
        });
    });

    // --- save error ---

    describe("save error", () => {
        it("should alert and re-enable button when createRit throws", async () => {
            // Arrange
            vi.spyOn(RitService.prototype, "createRit").mockRejectedValue(new Error("Server error"));
            const alertSpy: Mock = vi.spyOn(window, "alert").mockImplementation(() => undefined);

            const modal: RitCreateModalComponent = mountModal();
            modal.open();

            const user: UserEvent = userEvent.setup();
            await user.type(deepQuerySelector(document, "#adres1") as HTMLInputElement, "Amsterdam");
            await user.type(deepQuerySelector(document, "#adres2") as HTMLInputElement, "Rotterdam");
            await user.type(deepQuerySelector(document, "#kilometers") as HTMLInputElement, "75");
            const soortRit: HTMLSelectElement = deepQuerySelector(document, "#soortRit") as HTMLSelectElement;
            const soortVoertuig: HTMLSelectElement = deepQuerySelector(document, "#soortVoertuig") as HTMLSelectElement;
            const brandstof: HTMLSelectElement = deepQuerySelector(document, "#brandstof") as HTMLSelectElement;
            soortRit.value = "zakelijk";
            soortVoertuig.value = "auto";
            brandstof.value = "benzine";

            // Act
            const form: HTMLFormElement = deepQuerySelector(document, "#rit-form") as HTMLFormElement;
            form.dispatchEvent(new Event("submit"));
            await new Promise(r => setTimeout(r, 50));

            // Assert
            expect(alertSpy).toHaveBeenCalledWith("Kon de rit niet opslaan. Controleer of de server aan staat.");
            const btn: HTMLButtonElement = deepQuerySelector(document, "#opslaanBtn") as HTMLButtonElement;
            expect(btn.disabled).toBe(false);
            expect(btn.textContent).toBe("Opslaan");
        });
    });
});
