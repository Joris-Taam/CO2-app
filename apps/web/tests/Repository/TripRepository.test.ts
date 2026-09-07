import { beforeEach, describe, expect, it, vi } from "vitest";

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

beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
});

describe("RitRepository", () => {
    // ─── getByUser ────────────────────────────────────────────────

    describe("getByUser", () => {
        it("should return naam and ritten when response is ok", async () => {
            // Arrange
            const repository: RitRepository = new RitRepository();
            fetchMock.mockResponse(() => ({
                status: 200,
                body: JSON.stringify({ naam: "Test User", ritten: [mockRit] }),
            }));

            // Act
            const result: { naam: string; ritten: Rit[] } = await repository.getByUser();

            // Assert
            expect(result.naam).toBe("Test User");
            expect(result.ritten).toHaveLength(1);
            expect(result.ritten[0].userEmail).toBe("test@test.com");
        });

        it("should return empty ritten when user has no trips", async () => {
            // Arrange
            const repository: RitRepository = new RitRepository();
            fetchMock.mockResponse(() => ({
                status: 200,
                body: JSON.stringify({ naam: "Lege User", ritten: [] }),
            }));

            // Act
            const result: { naam: string; ritten: Rit[] } = await repository.getByUser();

            // Assert
            expect(result.ritten).toEqual([]);
        });

        it("should throw when response is not ok", async () => {
            // Arrange
            const repository: RitRepository = new RitRepository();
            fetchMock.mockResponse(() => ({ status: 401, body: "" }));

            // Act & Assert
            await expect(repository.getByUser()).rejects.toThrow("HTTP 401");
        });
    });

    // ─── create ───────────────────────────────────────────────────

    describe("create", () => {
        it("should return the created rit when response is ok", async () => {
            // Arrange
            const repository: RitRepository = new RitRepository();
            fetchMock.mockResponse((request: Request) => {
                if (request.method === "POST") {
                    return { status: 200, body: JSON.stringify(mockRitInput) };
                }

                throw new Error();
            });

            // Act
            const result: RitInput = await repository.create(mockRitInput);

            // Assert
            expect(result).toEqual(mockRitInput);
        });

        it("should throw when response is not ok", async () => {
            // Arrange
            const repository: RitRepository = new RitRepository();
            fetchMock.mockResponse(() => ({ status: 400, body: "" }));

            // Act & Assert
            await expect(repository.create(mockRitInput)).rejects.toThrow("HTTP 400");
        });
    });

    // ─── update ───────────────────────────────────────────────────

    describe("update", () => {
        it("should return the updated rit when response is ok", async () => {
            // Arrange
            const repository: RitRepository = new RitRepository();
            const updatedRit: RitInput = { ...mockRitInput, kilometers: 100 };
            fetchMock.mockResponse((request: Request) => {
                if (request.method === "PUT") {
                    return { status: 200, body: JSON.stringify(updatedRit) };
                }

                throw new Error();
            });

            // Act
            const result: RitInput = await repository.update(updatedRit);

            // Assert
            expect(result.kilometers).toBe(100);
        });

        it("should throw when response is not ok", async () => {
            // Arrange
            const repository: RitRepository = new RitRepository();
            fetchMock.mockResponse(() => ({ status: 500, body: "" }));

            // Act & Assert
            await expect(repository.update(mockRitInput)).rejects.toThrow("HTTP 500");
        });
    });

    // ─── delete ───────────────────────────────────────────────────

    describe("delete", () => {
        it("should resolve without errors when response is ok", async () => {
            // Arrange
            const repository: RitRepository = new RitRepository();
            fetchMock.mockResponse((request: Request) => {
                if (request.method === "DELETE") {
                    return { status: 200, body: "" };
                }

                throw new Error();
            });

            // Act & Assert
            await expect(repository.delete(mockRit)).resolves.toBeUndefined();
        });

        it("should throw when response is not ok", async () => {
            // Arrange
            const repository: RitRepository = new RitRepository();
            fetchMock.mockResponse(() => ({ status: 404, body: "" }));

            // Act & Assert
            await expect(repository.delete(mockRit)).rejects.toThrow("HTTP 404");
        });
    });
});
