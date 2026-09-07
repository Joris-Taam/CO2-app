import { beforeEach, describe, expect, it, Mock, vi } from "vitest";

import { RitService } from "@web/services/TripService";
import { RitRepository } from "@web/repositories/TripRepository";
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

const mockRitInput: RitInput = {
    createdAt: "2024-01-01 10:00:00",
    adres1: "Amsterdam Centraal",
    adres2: "Rotterdam Centraal",
    kilometers: 75,
    soortRit: "zakelijk",
    soortVoertuig: "auto",
    brandstof: "benzine",
};

const mockRepo: RitRepository = {
    getByUser: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
};

beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
});

describe("RitService (frontend)", () => {
    // ─── getTripByUser ────────────────────────────────────────────

    describe("getTripByUser", () => {
        it("should return naam and ritten from repository", async () => {
            // Arrange
            const getByUserMock: Mock = vi.fn().mockResolvedValue({ naam: "Test User", ritten: [mockRit] });
            mockRepo.getByUser = getByUserMock;
            const service: RitService = new RitService(mockRepo);

            // Act
            const result: { naam: string; ritten: Rit[] } = await service.getTripByUser();

            // Assert
            expect(getByUserMock).toHaveBeenCalledTimes(1);
            expect(result.naam).toBe("Test User");
            expect(result.ritten).toHaveLength(1);
        });

        it("should return empty ritten when user has no trips", async () => {
            // Arrange
            const getByUserMock: Mock = vi.fn().mockResolvedValue({ naam: "Lege User", ritten: [] });
            mockRepo.getByUser = getByUserMock;
            const service: RitService = new RitService(mockRepo);

            // Act
            const result: { naam: string; ritten: Rit[] } = await service.getTripByUser();

            // Assert
            expect(result.ritten).toEqual([]);
        });

        it("should throw when repository throws", async () => {
            // Arrange
            mockRepo.getByUser = vi.fn().mockRejectedValue(new Error("HTTP 401: Unauthorized"));
            const service: RitService = new RitService(mockRepo);

            // Act & Assert
            await expect(service.getTripByUser()).rejects.toThrow("HTTP 401");
        });
    });

    // ─── createRit ────────────────────────────────────────────────

    describe("createRit", () => {
        it("should return the created rit from repository", async () => {
            // Arrange
            const createMock: Mock = vi.fn().mockResolvedValue(mockRitInput);
            mockRepo.create = createMock;
            const service: RitService = new RitService(mockRepo);

            // Act
            const result: RitInput = await service.createRit(mockRitInput);

            // Assert
            expect(createMock).toHaveBeenCalledWith(mockRitInput);
            expect(createMock).toHaveBeenCalledTimes(1);
            expect(result).toEqual(mockRitInput);
        });

        it("should throw when repository throws", async () => {
            // Arrange
            mockRepo.create = vi.fn().mockRejectedValue(new Error("HTTP 400: Bad Request"));
            const service: RitService = new RitService(mockRepo);

            // Act & Assert
            await expect(service.createRit(mockRitInput)).rejects.toThrow("HTTP 400");
        });
    });

    // ─── updateRit ────────────────────────────────────────────────

    describe("updateRit", () => {
        it("should return the updated rit from repository", async () => {
            // Arrange
            const updatedRit: RitInput = { ...mockRitInput, kilometers: 100 };
            const updateMock: Mock = vi.fn().mockResolvedValue(updatedRit);
            mockRepo.update = updateMock;
            const service: RitService = new RitService(mockRepo);

            // Act
            const result: RitInput = await service.updateRit(updatedRit);

            // Assert
            expect(updateMock).toHaveBeenCalledWith(updatedRit);
            expect(updateMock).toHaveBeenCalledTimes(1);
            expect(result.kilometers).toBe(100);
        });

        it("should throw when repository throws", async () => {
            // Arrange
            mockRepo.update = vi.fn().mockRejectedValue(new Error("HTTP 500: Internal Server Error"));
            const service: RitService = new RitService(mockRepo);

            // Act & Assert
            await expect(service.updateRit(mockRitInput)).rejects.toThrow("HTTP 500");
        });
    });

    // ─── deleteRit ────────────────────────────────────────────────

    describe("deleteRit", () => {
        it("should call repository delete with the correct rit", async () => {
            // Arrange
            const deleteMock: Mock = vi.fn().mockResolvedValue(undefined);
            mockRepo.delete = deleteMock;
            const service: RitService = new RitService(mockRepo);

            // Act
            await service.deleteRit(mockRit);

            // Assert
            expect(deleteMock).toHaveBeenCalledWith(mockRit);
            expect(deleteMock).toHaveBeenCalledTimes(1);
        });

        it("should throw when repository throws", async () => {
            // Arrange
            mockRepo.delete = vi.fn().mockRejectedValue(new Error("HTTP 404: Not Found"));
            const service: RitService = new RitService(mockRepo);

            // Act & Assert
            await expect(service.deleteRit(mockRit)).rejects.toThrow("HTTP 404");
        });
    });
});
