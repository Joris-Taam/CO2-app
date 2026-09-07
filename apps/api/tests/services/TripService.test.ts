import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";

import { TripService } from "@api/services/TripService";
import { TripRepository } from "@api/repositories/TripRepository";
import { RitData } from "@api/models/Trip";

const createTripMock: Mock = vi.fn();
const findByEmailMock: Mock = vi.fn();
const updateMock: Mock = vi.fn();
const deleteMock: Mock = vi.fn();

const mockRepo: TripRepository = {
    create: createTripMock,
    findByEmail: findByEmailMock,
    update: updateMock,
    delete: deleteMock,
} as unknown as TripRepository;

const mockRit: RitData = {
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
    TripService.setInstance(mockRepo);
});

describe("TripService", () => {
    // ─── createTrip ───────────────────────────────────────────────

    describe("createTrip", () => {
        it("should call repository create with the correct data", async () => {
            // Arrange
            const service: TripService = TripService.getInstance();
            createTripMock.mockResolvedValue(undefined);

            // Act
            await service.createTrip(mockRit);

            // Assert
            expect(createTripMock).toHaveBeenCalledWith(mockRit);
            expect(createTripMock).toHaveBeenCalledTimes(1);
        });

        it("should throw when repository create fails", async () => {
            // Arrange
            const service: TripService = TripService.getInstance();
            createTripMock.mockRejectedValue(new Error("Database error"));

            // Act & Assert
            await expect(service.createTrip(mockRit)).rejects.toThrow("Database error");
        });
    });

    // ─── getTripsByEmail ──────────────────────────────────────────

    describe("getTripsByEmail", () => {
        it("should return all trips for a user", async () => {
            // Arrange
            const service: TripService = TripService.getInstance();
            findByEmailMock.mockResolvedValue([mockRit]);

            // Act
            const result: RitData[] = await service.getTripsByEmail("test@test.com");

            // Assert
            expect(findByEmailMock).toHaveBeenCalledWith("test@test.com");
            expect(result).toHaveLength(1);
            expect(result[0].userEmail).toBe("test@test.com");
        });

        it("should return an empty array when user has no trips", async () => {
            // Arrange
            const service: TripService = TripService.getInstance();
            findByEmailMock.mockResolvedValue([]);

            // Act
            const result: RitData[] = await service.getTripsByEmail("leeg@test.com");

            // Assert
            expect(findByEmailMock).toHaveBeenCalledWith("leeg@test.com");
            expect(result).toEqual([]);
        });

        it("should return multiple trips when user has more than one trip", async () => {
            // Arrange
            const service: TripService = TripService.getInstance();
            const secondRit: RitData = { ...mockRit, createdAt: "2024-02-01 12:00:00", adres1: "Utrecht" };
            findByEmailMock.mockResolvedValue([mockRit, secondRit]);

            // Act
            const result: RitData[] = await service.getTripsByEmail("test@test.com");

            // Assert
            expect(result).toHaveLength(2);
        });
    });

    // ─── updateTrip ───────────────────────────────────────────────

    describe("updateTrip", () => {
        it("should call repository update with email, datetime and updated fields", async () => {
            // Arrange
            const service: TripService = TripService.getInstance();
            const updatedFields: Partial<RitData> = { kilometers: 100, adres2: "Den Haag" };
            updateMock.mockResolvedValue({ ...mockRit, ...updatedFields });

            // Act
            await service.updateTrip("test@test.com", "2024-01-01 10:00:00", updatedFields);

            // Assert
            expect(updateMock).toHaveBeenCalledWith("test@test.com", "2024-01-01 10:00:00", updatedFields);
            expect(updateMock).toHaveBeenCalledTimes(1);
        });

        it("should return null when trip is not found", async () => {
            // Arrange
            const service: TripService = TripService.getInstance();
            updateMock.mockResolvedValue(null);

            // Act
            const result: RitData | null = await service.updateTrip("test@test.com", "2024-01-01 10:00:00", {});

            // Assert
            expect(result).toBeNull();
        });

        it("should throw when repository update fails", async () => {
            // Arrange
            const service: TripService = TripService.getInstance();
            updateMock.mockRejectedValue(new Error("Update failed"));

            // Act & Assert
            await expect(
                service.updateTrip("test@test.com", "2024-01-01 10:00:00", { kilometers: 100 })
            ).rejects.toThrow("Update failed");
        });
    });

    // ─── deleteTrip ───────────────────────────────────────────────

    describe("deleteTrip", () => {
        it("should call repository delete with the correct email and datetime", async () => {
            // Arrange
            const service: TripService = TripService.getInstance();
            deleteMock.mockResolvedValue(true);

            // Act
            await service.deleteTrip("test@test.com", "2024-01-01 10:00:00");

            // Assert
            expect(deleteMock).toHaveBeenCalledWith("test@test.com", "2024-01-01 10:00:00");
            expect(deleteMock).toHaveBeenCalledTimes(1);
        });

        it("should return false when trip is not found", async () => {
            // Arrange
            const service: TripService = TripService.getInstance();
            deleteMock.mockResolvedValue(false);

            // Act
            const result: boolean = await service.deleteTrip("test@test.com", "2024-01-01 10:00:00");

            // Assert
            expect(result).toBe(false);
        });

        it("should throw when repository delete fails", async () => {
            // Arrange
            const service: TripService = TripService.getInstance();
            deleteMock.mockRejectedValue(new Error("Delete failed"));

            // Act & Assert
            await expect(
                service.deleteTrip("test@test.com", "2024-01-01 10:00:00")
            ).rejects.toThrow("Delete failed");
        });
    });
});
