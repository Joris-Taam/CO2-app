import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock, MockInstance } from "vitest";

import { TripRepository } from "@api/repositories/TripRepository";
import { RitData, TripORM } from "@api/models/Trip";

const hoistedMocks: {
    findByMock: Mock;
    findOneByMock: Mock;
    createQueryBuilderMock: Mock;
    createMock: Mock;
    saveMock: Mock;
} = vi.hoisted(() => {
    return {
        findByMock: vi.fn(),
        findOneByMock: vi.fn(),
        createQueryBuilderMock: vi.fn(),
        createMock: vi.fn(),
        saveMock: vi.fn(),
    };
});

const findByMock: Mock = hoistedMocks.findByMock;
const createQueryBuilderMock: Mock = hoistedMocks.createQueryBuilderMock;
const createMock: Mock = hoistedMocks.createMock;
const saveMock: Mock = hoistedMocks.saveMock;

vi.mock("@api/services/ORMService", () => ({
    ORMService: {
        getInstance: vi.fn().mockReturnValue({
            getRepository: vi.fn().mockReturnValue({
                findBy: hoistedMocks.findByMock,
                findOneBy: hoistedMocks.findOneByMock,
                createQueryBuilder: hoistedMocks.createQueryBuilderMock,
                create: hoistedMocks.createMock,
                save: hoistedMocks.saveMock,
            }),
        }),
    },
}));

const mockTripORM: TripORM = {
    user_email: "test@test.com",
    trip_datetime: "2024-01-01 10:00:00",
    start_location: "Amsterdam Centraal",
    end_location: "Rotterdam Centraal",
    distance_km: 75,
    vehicle_name: "auto",
    fuel_name: "benzine",
    trip_type_name: "zakelijk",
};

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
    TripRepository.resetInstance();
});

describe("TripRepository", () => {
    // ─── create ───────────────────────────────────────────────────

    describe("create", () => {
        it("should create and save a TripORM entity", async () => {
            // Arrange
            const repo: TripRepository = TripRepository.getInstance();
            createMock.mockReturnValue(mockTripORM);
            saveMock.mockResolvedValue(mockTripORM);

            // Act
            await repo.create(mockRit);

            // Assert
            expect(createMock).toHaveBeenCalledWith(expect.objectContaining({
                user_email: "test@test.com",
                start_location: "Amsterdam Centraal",
                distance_km: 75,
            }));
            expect(saveMock).toHaveBeenCalled();
        });

        it("should throw when save fails", async () => {
            // Arrange
            const repo: TripRepository = TripRepository.getInstance();
            createMock.mockReturnValue(mockTripORM);
            saveMock.mockRejectedValue(new Error("Database error"));

            // Act & Assert
            await expect(repo.create(mockRit)).rejects.toThrow("Database error");
        });
    });

    // ─── findByEmail ──────────────────────────────────────────────

    describe("findByEmail", () => {
        it("should return mapped trips for a user", async () => {
            // Arrange
            const repo: TripRepository = TripRepository.getInstance();
            findByMock.mockResolvedValue([mockTripORM]);

            // Act
            const result: RitData[] = await repo.findByEmail("test@test.com");

            // Assert
            expect(findByMock).toHaveBeenCalledWith({ user_email: "test@test.com" });
            expect(result).toHaveLength(1);
            expect(result[0].userEmail).toBe("test@test.com");
            expect(result[0].adres1).toBe("Amsterdam Centraal");
            expect(result[0].kilometers).toBe(75);
        });

        it("should return an empty array when user has no trips", async () => {
            // Arrange
            const repo: TripRepository = TripRepository.getInstance();
            findByMock.mockResolvedValue([]);

            // Act
            const result: RitData[] = await repo.findByEmail("leeg@test.com");

            // Assert
            expect(result).toEqual([]);
        });

        it("should throw when findBy fails", async () => {
            // Arrange
            const repo: TripRepository = TripRepository.getInstance();
            findByMock.mockRejectedValue(new Error("Database error"));

            // Act & Assert
            await expect(repo.findByEmail("test@test.com")).rejects.toThrow("Database error");
        });
    });

    // ─── update ───────────────────────────────────────────────────

    describe("update", () => {
        it("should return null when trip is not found", async () => {
            // Arrange
            const repo: TripRepository = TripRepository.getInstance();
            const whereMock: MockInstance = vi.fn().mockReturnThis();
            const andWhereMock: MockInstance = vi.fn().mockReturnThis();
            const getOneMock: MockInstance = vi.fn().mockResolvedValue(null);

            createQueryBuilderMock.mockReturnValue({
                where: whereMock,
                andWhere: andWhereMock,
                getOne: getOneMock,
            });

            // Act
            const result: RitData | null = await repo.update("ghost@test.com", "2024-01-01 10:00:00", { kilometers: 100 });

            // Assert
            expect(result).toBeNull();
        });

        it("should update fields and return updated RitData", async () => {
            // Arrange
            const repo: TripRepository = TripRepository.getInstance();

            // findByEmailAndDatetime (SELECT)
            const whereMock: MockInstance = vi.fn().mockReturnThis();
            const andWhereMock: MockInstance = vi.fn().mockReturnThis();
            const getOneMock: MockInstance = vi.fn().mockResolvedValue(mockTripORM);

            // update QueryBuilder
            const updateQbMock: MockInstance = vi.fn().mockReturnThis();
            const setMock: MockInstance = vi.fn().mockReturnThis();
            const executeMock: MockInstance = vi.fn().mockResolvedValue({ affected: 1, raw: [], generatedMaps: [] });

            createQueryBuilderMock
                .mockReturnValueOnce({
                    where: whereMock,
                    andWhere: andWhereMock,
                    getOne: getOneMock,
                })
                .mockReturnValueOnce({
                    update: updateQbMock,
                    set: setMock,
                    where: whereMock,
                    andWhere: andWhereMock,
                    execute: executeMock,
                });

            // Act
            const result: RitData | null = await repo.update("test@test.com", "2024-01-01 10:00:00", { kilometers: 100 });

            // Assert
            expect(result).not.toBeNull();
            expect(result?.userEmail).toBe("test@test.com");
        });
    });

    // ─── delete ───────────────────────────────────────────────────

    describe("delete", () => {
        it("should return true when trip is deleted", async () => {
            // Arrange
            const repo: TripRepository = TripRepository.getInstance();
            const deleteMock: MockInstance = vi.fn().mockReturnThis();
            const fromMock: MockInstance = vi.fn().mockReturnThis();
            const whereMock: MockInstance = vi.fn().mockReturnThis();
            const andWhereMock: MockInstance = vi.fn().mockReturnThis();
            const executeMock: MockInstance = vi.fn().mockResolvedValue({ affected: 1, raw: [] });

            createQueryBuilderMock.mockReturnValue({
                delete: deleteMock,
                from: fromMock,
                where: whereMock,
                andWhere: andWhereMock,
                execute: executeMock,
            });

            // Act
            const result: boolean = await repo.delete("test@test.com", "2024-01-01 10:00:00");

            // Assert
            expect(result).toBe(true);
            expect(executeMock).toHaveBeenCalled();
        });

        it("should return false when trip is not found", async () => {
            // Arrange
            const repo: TripRepository = TripRepository.getInstance();
            const deleteMock: MockInstance = vi.fn().mockReturnThis();
            const fromMock: MockInstance = vi.fn().mockReturnThis();
            const whereMock: MockInstance = vi.fn().mockReturnThis();
            const andWhereMock: MockInstance = vi.fn().mockReturnThis();
            const executeMock: MockInstance = vi.fn().mockResolvedValue({ affected: 0, raw: [] });

            createQueryBuilderMock.mockReturnValue({
                delete: deleteMock,
                from: fromMock,
                where: whereMock,
                andWhere: andWhereMock,
                execute: executeMock,
            });

            // Act
            const result: boolean = await repo.delete("ghost@test.com", "2024-01-01 10:00:00");

            // Assert
            expect(result).toBe(false);
        });
    });
});
