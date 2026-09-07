import userEvent, { UserEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

import "@web/components/trips/TripRowComponent";
import { TripRowComponent } from "@web/components/trips/TripRowComponent";
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

beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    document.body.innerHTML = "";
});

describe("TripRowComponent", () => {
    // ─── render ───────────────────────────────────────────────────

    describe("render", () => {
        it("should render trip data in the correct cells", () => {
            // Arrange
            const table: HTMLTableElement = document.createElement("table");
            const tbody: HTMLTableSectionElement = document.createElement("tbody");
            table.append(tbody);
            document.body.append(table);

            const row: TripRowComponent = document.createElement("tr", { is: "trip-row" }) as TripRowComponent;
            tbody.append(row);

            // Act
            row.setTrip(mockRit);

            // Assert
            expect(row.innerHTML).toContain("Amsterdam Centraal");
            expect(row.innerHTML).toContain("Rotterdam Centraal");
            expect(row.innerHTML).toContain("75 km");
            expect(row.innerHTML).toContain("auto");
            expect(row.innerHTML).toContain("benzine");
            expect(row.innerHTML).toContain("zakelijk");
        });

        it("should render edit and delete buttons", () => {
            // Arrange
            const table: HTMLTableElement = document.createElement("table");
            const tbody: HTMLTableSectionElement = document.createElement("tbody");
            table.append(tbody);
            document.body.append(table);

            const row: TripRowComponent = document.createElement("tr", { is: "trip-row" }) as TripRowComponent;
            tbody.append(row);

            // Act
            row.setTrip(mockRit);

            // Assert
            expect(row.querySelector("#editTripBtn")).not.toBeNull();
            expect(row.querySelector("#deleteTrip")).not.toBeNull();
        });

        it("should render the formatted date", () => {
            // Arrange
            const table: HTMLTableElement = document.createElement("table");
            const tbody: HTMLTableSectionElement = document.createElement("tbody");
            table.append(tbody);
            document.body.append(table);

            const row: TripRowComponent = document.createElement("tr", { is: "trip-row" }) as TripRowComponent;
            tbody.append(row);

            // Act
            row.setTrip(mockRit);

            // Assert
            expect(row.innerHTML).toContain(
                new Date("2024-01-01 10:00:00").toLocaleDateString("nl-NL")
            );
        });
    });

    // ─── events ───────────────────────────────────────────────────

    describe("events", () => {
        it("should dispatch open-edit-modal event when edit button is clicked", async () => {
            // Arrange
            const table: HTMLTableElement = document.createElement("table");
            const tbody: HTMLTableSectionElement = document.createElement("tbody");
            table.append(tbody);
            document.body.append(table);

            const row: TripRowComponent = document.createElement("tr", { is: "trip-row" }) as TripRowComponent;
            tbody.append(row);
            row.setTrip(mockRit);

            const eventHandler: Mock = vi.fn();
            document.addEventListener("open-edit-modal", eventHandler);

            // Act
            const user: UserEvent = userEvent.setup();
            await user.click(row.querySelector("#editTripBtn") as HTMLElement);

            // Assert
            expect(eventHandler).toHaveBeenCalledTimes(1);
            const event: CustomEvent<Rit> = eventHandler.mock.calls[0][0] as CustomEvent<Rit>;
            expect(event.detail.adres1).toBe("Amsterdam Centraal");

            document.removeEventListener("open-edit-modal", eventHandler);
        });

        it("should dispatch rit-delete-request event when delete button is clicked", async () => {
            // Arrange
            const table: HTMLTableElement = document.createElement("table");
            const tbody: HTMLTableSectionElement = document.createElement("tbody");
            table.append(tbody);
            document.body.append(table);

            const row: TripRowComponent = document.createElement("tr", { is: "trip-row" }) as TripRowComponent;
            tbody.append(row);
            row.setTrip(mockRit);

            const eventHandler: Mock = vi.fn();
            document.addEventListener("rit-delete-request", eventHandler);

            // Act
            const user: UserEvent = userEvent.setup();
            await user.click(row.querySelector("#deleteTrip") as HTMLElement);

            // Assert
            expect(eventHandler).toHaveBeenCalledTimes(1);
            const event: CustomEvent<Rit> = eventHandler.mock.calls[0][0] as CustomEvent<Rit>;
            expect(event.detail.userEmail).toBe("test@test.com");

            document.removeEventListener("rit-delete-request", eventHandler);
        });
    });
});
