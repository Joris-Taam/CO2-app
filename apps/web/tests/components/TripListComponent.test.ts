import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { deepQuerySelector } from "../__helpers__/web.helpers";

import "@web/components/trips/TripListComponent";
import { RitService } from "@web/services/TripService";
import { Rit } from "@web/interfaces/TripInterface";

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

const mockRitOud: Rit = {
    ...mockRit,
    createdAt: "2023-06-01 08:00:00",
    adres1: "Utrecht CS",
};

beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    document.body.innerHTML = "";

    vi.spyOn(RitService.prototype, "getTripByUser").mockResolvedValue({
        naam: "Test User",
        ritten: [mockRit],
    });
});

describe("TripListComponent", () => {
    // --- render ---

    describe("render", () => {
        it("should render the table with headers", () => {
            // Arrange
            const component: HTMLElement = document.createElement("trip-list");
            document.body.append(component);

            // Act
            const table: HTMLElement | null = deepQuerySelector(document, "table");

            // Assert
            expect(table).not.toBeNull();
        });

        it("should render the trip-filter component", () => {
            // Arrange
            const component: HTMLElement = document.createElement("trip-list");
            document.body.append(component);

            // Act
            const filter: HTMLElement | null = deepQuerySelector(document, "trip-filter");

            // Assert
            expect(filter).not.toBeNull();
        });

        it("should render the CO2 summary section", () => {
            // Arrange
            const component: HTMLElement = document.createElement("trip-list");
            document.body.append(component);

            // Act
            const co2: HTMLElement | null = deepQuerySelector(document, "#totalCo2");

            // Assert
            expect(co2).not.toBeNull();
        });
    });

    // --- setTrips ---

    describe("setTrips", () => {
        it("should sort trips by date descending (newest first)", () => {
            // Arrange
            const component: HTMLElement = document.createElement("trip-list");
            document.body.append(component);

            // Act
            (component as unknown as { setTrips: (t: Rit[]) => void }).setTrips([mockRitOud, mockRit]);

            // Assert
            const tbody: HTMLElement | null = deepQuerySelector(document, "#rittenLijst");
            const firstRow: Element | null = tbody!.firstElementChild;
            expect(firstRow!.innerHTML).toContain("Amsterdam Centraal");
        });

        it("should update CO2 total when trips are set", () => {
            // Arrange
            const component: HTMLElement = document.createElement("trip-list");
            document.body.append(component);

            // Act
            (component as unknown as { setTrips: (t: Rit[]) => void }).setTrips([mockRit]);

            // Assert
            const co2: HTMLElement | null = deepQuerySelector(document, "#totalCo2");
            expect(co2!.textContent).not.toBe("0 kg CO2");
        });

        it("should hide laad-meer button when all trips fit on one page", () => {
            // Arrange
            const component: HTMLElement = document.createElement("trip-list");
            document.body.append(component);

            // Act
            (component as unknown as { setTrips: (t: Rit[]) => void }).setTrips([mockRit]);

            // Assert
            const btn: HTMLElement | null = deepQuerySelector(document, "#btnLaadMeer");
            expect(btn!.style.display).toBe("none");
        });
    });

    // --- renderFiltered ---

    describe("renderFiltered", () => {
        it("should render only the filtered trips", () => {
            // Arrange
            const component: HTMLElement = document.createElement("trip-list");
            document.body.append(component);
            (component as unknown as { setTrips: (t: Rit[]) => void }).setTrips([mockRit, mockRitOud]);

            // Act
            (component as unknown as { renderFiltered: (t: Rit[]) => void }).renderFiltered([mockRit]);

            // Assert
            const tbody: HTMLElement | null = deepQuerySelector(document, "#rittenLijst");
            expect(tbody!.childElementCount).toBe(1);
        });

        it("should hide laad-meer button after filtering", () => {
            // Arrange
            const component: HTMLElement = document.createElement("trip-list");
            document.body.append(component);

            // Act
            (component as unknown as { renderFiltered: (t: Rit[]) => void }).renderFiltered([mockRit]);

            // Assert
            const btn: HTMLElement | null = deepQuerySelector(document, "#btnLaadMeer");
            expect(btn!.style.display).toBe("none");
        });
    });

    // --- events ---

    describe("events", () => {
        it("should reload trips when rit-created event is dispatched", async () => {
            // Arrange
            const loadMock: Mock = vi.spyOn(RitService.prototype, "getTripByUser").mockResolvedValue({
                naam: "Test User",
                ritten: [mockRit],
            });
            const component: HTMLElement = document.createElement("trip-list");
            document.body.append(component);
            await new Promise(r => setTimeout(r, 20));
            const callsBefore: number = loadMock.mock.calls.length;

            // Act
            document.dispatchEvent(new CustomEvent("rit-created"));
            await new Promise(r => setTimeout(r, 20));

            // Assert
            expect(loadMock.mock.calls.length).toBeGreaterThan(callsBefore);
        });

        it("should update trip and reload when rit-edit-submit event is dispatched", async () => {
            // Arrange
            vi.spyOn(RitService.prototype, "getTripByUser").mockResolvedValue({ naam: "Test User", ritten: [mockRit] });
            const updateMock: Mock = vi.spyOn(RitService.prototype, "updateRit").mockResolvedValue({
                createdAt: mockRit.createdAt,
                adres1: mockRit.adres1,
                adres2: mockRit.adres2,
                kilometers: 100,
                soortRit: mockRit.soortRit,
                soortVoertuig: mockRit.soortVoertuig,
                brandstof: mockRit.brandstof,
            });
            const component: HTMLElement = document.createElement("trip-list");
            document.body.append(component);

            // Act
            component.dispatchEvent(new CustomEvent("rit-edit-submit", {
                detail: { ...mockRit, kilometers: 100 },
                bubbles: true,
            }));
            await new Promise(r => setTimeout(r, 20));

            // Assert
            expect(updateMock).toHaveBeenCalledTimes(1);
        });

        it("should delete trip and reload when rit-delete-request is confirmed", async () => {
            // Arrange
            vi.spyOn(RitService.prototype, "getTripByUser").mockResolvedValue({ naam: "Test User", ritten: [mockRit] });
            const deleteMock: Mock = vi.spyOn(RitService.prototype, "deleteRit").mockResolvedValue(undefined);
            vi.spyOn(window, "confirm").mockReturnValue(true);
            const component: HTMLElement = document.createElement("trip-list");
            document.body.append(component);

            // Act
            component.dispatchEvent(new CustomEvent("rit-delete-request", {
                detail: mockRit,
                bubbles: true,
            }));
            await new Promise(r => setTimeout(r, 20));

            // Assert
            expect(deleteMock).toHaveBeenCalledTimes(1);
        });

        it("should not delete trip when confirm is cancelled", async () => {
            // Arrange
            vi.spyOn(RitService.prototype, "getTripByUser").mockResolvedValue({ naam: "Test User", ritten: [mockRit] });
            const deleteMock: Mock = vi.spyOn(RitService.prototype, "deleteRit").mockResolvedValue(undefined);
            vi.spyOn(window, "confirm").mockReturnValue(false);
            const component: HTMLElement = document.createElement("trip-list");
            document.body.append(component);

            // Act
            component.dispatchEvent(new CustomEvent("rit-delete-request", {
                detail: mockRit,
                bubbles: true,
            }));
            await new Promise(r => setTimeout(r, 20));

            // Assert
            expect(deleteMock).not.toHaveBeenCalled();
        });
    });
});
