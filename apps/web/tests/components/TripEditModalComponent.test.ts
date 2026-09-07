import userEvent, { UserEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { deepQuerySelector } from "../__helpers__/web.helpers";

import "@web/components/trips/TripEditModalComponent";
import { ITripEditModalComponent } from "@web/components/trips/ITripComponents";
import { Rit, RitInput } from "@web/interfaces/TripInterface";

const mockRit: Rit = {
    userEmail: "test@test.com",
    createdAt: "2024-01-01 10:00:00",
    adres1: "Amsterdam Centraal",
    adres2: "Rotterdam Centraal",
    kilometers: 75,
    soortRit: "zakelijk",
    soortVoertuig: "auto",
    brandstof: "benzine",
};

beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    document.body.innerHTML = "";
});

function mountModal(): ITripEditModalComponent {
    const modal: ITripEditModalComponent = document.createElement("rit-edit-modal") as ITripEditModalComponent;
    document.body.append(modal);

    return modal;
}

describe("TripEditModalComponent", () => {
    // --- open / close ---

    describe("open and close", async () => {
        it("should show the overlay when open() is called", () => {
            // Arrange
            const modal: ITripEditModalComponent = mountModal();

            // Act
            modal.open(mockRit);

            // Assert
            const overlay: HTMLElement | null = deepQuerySelector(document, "#edit-overlay");
            expect(overlay!.classList.contains("show")).toBe(true);
        });

        it("should fill in the form fields with rit data when opened", () => {
            // Arrange
            const modal: ITripEditModalComponent = mountModal();

            // Act
            modal.open(mockRit);

            // Assert
            const adres1: HTMLInputElement = deepQuerySelector(document, "#adres1") as HTMLInputElement;
            expect(adres1.value).toBe("Amsterdam Centraal");

            const km: HTMLInputElement = deepQuerySelector(document, "#kilometers") as HTMLInputElement;
            expect(km.value).toBe("75");
        });

        it("should hide the overlay when close() is called", () => {
            // Arrange
            const modal: ITripEditModalComponent = mountModal();
            modal.open(mockRit);

            // Act
            modal.close();

            // Assert
            const overlay: HTMLElement | null = deepQuerySelector(document, "#edit-overlay");
            expect(overlay!.classList.contains("show")).toBe(false);
        });

        it("should close when clicking outside the modal (overlay background)", () => {
            // Arrange
            const modal: ITripEditModalComponent = mountModal();
            modal.open(mockRit);

            // Act
            const overlay: HTMLElement = deepQuerySelector(document, "#edit-overlay") as HTMLElement;
            overlay.dispatchEvent(new MouseEvent("click", { bubbles: true }));

            // Assert
            expect(overlay.classList.contains("show")).toBe(false);
        });

        it("should close when clicking on the overlay background", () => {
            // Arrange
            const modal: ITripEditModalComponent = mountModal();
            modal.open(mockRit);

            // Act — click the overlay itself (not the modal content)
            const overlay: HTMLElement | null = deepQuerySelector(document, "#edit-overlay");
            overlay!.dispatchEvent(new MouseEvent("click", { bubbles: true }));

            // Assert
            expect(overlay!.classList.contains("show")).toBe(false);
        });

        // Arrange
        const modal: ITripEditModalComponent = mountModal();
        modal.open(mockRit);

        // Act
        const user: UserEvent = userEvent.setup();
        await user.click(deepQuerySelector(document, "#close-edit") as HTMLElement);

        // Assert
        const overlay: HTMLElement | null = deepQuerySelector(document, "#edit-overlay");
        expect(overlay!.classList.contains("show")).toBe(false);
    });

    // --- setError ---

    describe("setError", () => {
        it("should display the error message in the form", () => {
            // Arrange
            const modal: ITripEditModalComponent = mountModal();
            modal.open(mockRit);

            // Act
            const eventHandler: Mock = vi.fn();
            modal.addEventListener("rit-edit-submit", eventHandler);
            modal.setError("Vul alle velden correct in.");

            // Assert
            const errorSpan: HTMLElement | null = deepQuerySelector(document, "#form-error");
            expect(errorSpan!.textContent).toBe("Vul alle velden correct in.");
        });
    });

    // --- form submit ---

    describe("form submit", () => {
        it("should dispatch rit-edit-submit event with updated data on valid submit", () => {
            // Arrange
            const modal: ITripEditModalComponent = mountModal();
            modal.open(mockRit);

            const eventHandler: Mock = vi.fn();
            modal.addEventListener("rit-edit-submit", eventHandler);

            // Direct value assignment because userEvent cannot focus Shadow DOM inputs
            const km: HTMLInputElement = deepQuerySelector(document, "#kilometers") as HTMLInputElement;
            km.value = "120";

            // Act
            const form: HTMLFormElement = deepQuerySelector(document, "#edit-rit-form") as HTMLFormElement;
            form.dispatchEvent(new Event("submit"));

            // Assert
            expect(eventHandler).toHaveBeenCalledTimes(1);
            const event: CustomEvent<RitInput> = eventHandler.mock.calls[0][0] as CustomEvent<RitInput>;
            expect(event.detail.kilometers).toBe(120);

            modal.removeEventListener("rit-edit-submit", eventHandler);
        });

        it("should show an error and not dispatch event when adres1 is empty", () => {
            // Arrange
            const modal: ITripEditModalComponent = mountModal();
            modal.open({ ...mockRit, adres1: "" });

            const eventHandler: Mock = vi.fn();
            modal.addEventListener("rit-edit-submit", eventHandler);

            // Act
            const form: HTMLFormElement = deepQuerySelector(document, "#edit-rit-form") as HTMLFormElement;
            form.dispatchEvent(new Event("submit"));

            // Assert
            expect(eventHandler).not.toHaveBeenCalled();
            const errorSpan: HTMLElement | null = deepQuerySelector(document, "#form-error");
            expect(errorSpan!.textContent).toBe("Vul alle velden correct in.");

            modal.removeEventListener("rit-edit-submit", eventHandler);
        });
    });
});
