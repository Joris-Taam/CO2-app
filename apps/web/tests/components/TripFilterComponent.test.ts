import userEvent, { UserEvent } from "@testing-library/user-event";
import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import { deepQuerySelector } from "../__helpers__/web.helpers";

import "@web/components/trips/TripFilterComponent";
import { ITripFilterComponent } from "@web/components/trips/ITripComponents";
import { Rit } from "@web/interfaces/TripInterface";

const makeRit: (createdAt: string) => Rit = (createdAt: string) => ({
    userEmail: "test@test.com",
    createdAt,
    adres1: "Amsterdam",
    adres2: "Rotterdam",
    kilometers: 75,
    soortRit: "zakelijk",
    soortVoertuig: "auto",
    brandstof: "benzine",
});

beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    document.body.innerHTML = "";
});

describe("TripFilterComponent", () => {
    // --- render ---

    describe("render", () => {
        it("should render the nieuwe rit button", () => {
            // Arrange
            const component: HTMLElement = document.createElement("trip-filter");
            document.body.append(component);

            // Act
            const btn: HTMLElement | null = deepQuerySelector(document, "#createTrip");

            // Assert
            expect(btn).not.toBeNull();
        });

        it("should render the start date input", () => {
            // Arrange
            const component: HTMLElement = document.createElement("trip-filter");
            document.body.append(component);

            // Act
            const input: HTMLElement | null = deepQuerySelector(document, "#filterStart");

            // Assert
            expect(input).not.toBeNull();
        });

        it("should render the end date input", () => {
            // Arrange
            const component: HTMLElement = document.createElement("trip-filter");
            document.body.append(component);

            // Act
            const input: HTMLElement | null = deepQuerySelector(document, "#filterEind");

            // Assert
            expect(input).not.toBeNull();
        });
    });

    // --- filterTrips ---

    describe("filterTrips", () => {
        it("should return all trips when no filter is set", () => {
            // Arrange
            const component: ITripFilterComponent = document.createElement("trip-filter") as ITripFilterComponent;
            document.body.append(component);
            const trips: Rit[] = [makeRit("2024-01-01"), makeRit("2024-06-01")];

            // Act
            const result: Rit[] = component.filterTrips(trips);

            // Assert
            expect(result).toHaveLength(2);
        });

        it("should return only trips on or after the start date", () => {
            // Arrange
            const component: ITripFilterComponent = document.createElement("trip-filter") as ITripFilterComponent;
            document.body.append(component);

            const filterStart: HTMLInputElement = deepQuerySelector(document, "#filterStart") as HTMLInputElement;
            filterStart.value = "2024-03-01";
            filterStart.dispatchEvent(new Event("change"));

            const trips: Rit[] = [makeRit("2024-01-01"), makeRit("2024-06-01")];

            // Act
            const result: Rit[] = component.filterTrips(trips);

            // Assert
            expect(result).toHaveLength(1);
            expect(result[0].createdAt).toBe("2024-06-01");
        });

        it("should return only trips on or before the end date", () => {
            // Arrange
            const component: ITripFilterComponent = document.createElement("trip-filter") as ITripFilterComponent;
            document.body.append(component);

            const filterEind: HTMLInputElement = deepQuerySelector(document, "#filterEind") as HTMLInputElement;
            filterEind.value = "2024-03-01";
            filterEind.dispatchEvent(new Event("change"));

            const trips: Rit[] = [makeRit("2024-01-01"), makeRit("2024-06-01")];

            // Act
            const result: Rit[] = component.filterTrips(trips);

            // Assert
            expect(result).toHaveLength(1);
            expect(result[0].createdAt).toBe("2024-01-01");
        });

        it("should return trips within start and end date range", () => {
            // Arrange
            const component: ITripFilterComponent = document.createElement("trip-filter") as ITripFilterComponent;
            document.body.append(component);

            const filterStart: HTMLInputElement = deepQuerySelector(document, "#filterStart") as HTMLInputElement;
            const filterEind: HTMLInputElement = deepQuerySelector(document, "#filterEind") as HTMLInputElement;
            filterStart.value = "2024-02-01";
            filterEind.value = "2024-05-01";

            const trips: Rit[] = [makeRit("2024-01-01"), makeRit("2024-03-01"), makeRit("2024-06-01")];

            // Act
            const result: Rit[] = component.filterTrips(trips);

            // Assert
            expect(result).toHaveLength(1);
            expect(result[0].createdAt).toBe("2024-03-01");
        });

        it("should return empty array when no trips match the filter", () => {
            // Arrange
            const component: ITripFilterComponent = document.createElement("trip-filter") as ITripFilterComponent;
            document.body.append(component);

            const filterStart: HTMLInputElement = deepQuerySelector(document, "#filterStart") as HTMLInputElement;
            filterStart.value = "2025-01-01";

            const trips: Rit[] = [makeRit("2024-01-01"), makeRit("2024-06-01")];

            // Act
            const result: Rit[] = component.filterTrips(trips);

            // Assert
            expect(result).toHaveLength(0);
        });
    });

    // --- events ---

    describe("events", () => {
        it("should dispatch filter-changed event when start date changes", async () => {
            // Arrange
            const component: ITripFilterComponent = document.createElement("trip-filter") as ITripFilterComponent;
            document.body.append(component);

            const eventHandler: Mock = vi.fn();
            component.addEventListener("filter-changed", eventHandler);

            const filterStart: HTMLInputElement = deepQuerySelector(document, "#filterStart") as HTMLInputElement;

            // Act
            const user: UserEvent = userEvent.setup();
            await user.type(filterStart, "2024-01-01");
            filterStart.dispatchEvent(new Event("change"));

            // Assert
            expect(eventHandler).toHaveBeenCalled();

            component.removeEventListener("filter-changed", eventHandler);
        });

        it("should call modal.open() when the nieuwe rit button is clicked", async () => {
            // Arrange
            const component: ITripFilterComponent = document.createElement("trip-filter") as ITripFilterComponent;
            document.body.append(component);

            const createBtn: HTMLElement | null = deepQuerySelector(document, "#createTrip");
            const modal: HTMLElement & { open: () => void } | null = deepQuerySelector(document, "#createModal") as (HTMLElement & { open: () => void }) | null;
            const openSpy: Mock = vi.fn();

            if (modal) {
                modal.open = openSpy;
            }

            // Act
            const user: UserEvent = userEvent.setup();
            await user.click(createBtn as HTMLElement);

            // Assert
            expect(openSpy).toHaveBeenCalledTimes(1);
        });
    });
});
