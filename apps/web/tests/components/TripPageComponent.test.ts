import { beforeEach, describe, expect, it, vi } from "vitest";
import { deepQuerySelector } from "../__helpers__/web.helpers";

import "@web/components/trips/TripPageComponent";
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

beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    document.body.innerHTML = "";
    document.cookie = "";

    vi.spyOn(RitService.prototype, "getTripByUser").mockResolvedValue({
        naam: "Test User",
        ritten: [mockRit],
    });
});

describe("TripPageComponent", () => {
    // ─── render ───────────────────────────────────────────────────

    describe("render", () => {
        it("should render the page heading", () => {
            // Arrange
            const page: HTMLElement = document.createElement("trip-page");
            document.body.append(page);

            // Act
            const heading: HTMLElement | null = deepQuerySelector(document, "h1");

            // Assert
            expect(heading).not.toBeNull();
            expect(heading!.textContent.trim()).toBe("Gegevens per rit");
        });

        it("should render the trip-list component", () => {
            // Arrange
            const page: HTMLElement = document.createElement("trip-page");
            document.body.append(page);

            // Act
            const tripList: HTMLElement | null = deepQuerySelector(document, "trip-list");

            // Assert
            expect(tripList).not.toBeNull();
        });

        it("should show empty userEmail span when no cookie is set", () => {
            // Arrange
            const page: HTMLElement = document.createElement("trip-page");
            document.body.append(page);

            // Act
            const emailSpan: HTMLElement | null = deepQuerySelector(document, "#userEmail");

            // Assert
            expect(emailSpan).not.toBeNull();
            expect(emailSpan!.textContent).toBe("");
        });

        it("should show userEmail from cookie when cookie is set", () => {
            // Arrange
            document.cookie = "user=test%40test.com";
            const page: HTMLElement = document.createElement("trip-page");
            document.body.append(page);

            // Act
            const emailSpan: HTMLElement | null = deepQuerySelector(document, "#userEmail");

            // Assert
            expect(emailSpan).not.toBeNull();
            expect(emailSpan!.textContent).toBe("test@test.com");
        });
    });
});
