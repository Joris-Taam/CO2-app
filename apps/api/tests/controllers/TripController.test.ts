import { beforeEach, describe, expect, it, Mock, vi } from "vitest";
import {
    createMockRequest,
    createMockResponse,
    MockRequest,
    MockResponse
} from "../__helpers__/express.helpers";

import { TripController } from "@api/controllers/TripController";
import { TripService } from "@api/services/TripService";
import { TripRepository } from "@api/repositories/TripRepository";
import { RitData } from "@api/models/Trip";

const createTripMock: Mock = vi.fn();
const getTripsByEmailMock: Mock = vi.fn();
const updateTripMock: Mock = vi.fn();
const deleteTripMock: Mock = vi.fn();

const mockRepo: TripRepository = {
    create: createTripMock,
    findByEmail: getTripsByEmailMock,
    update: updateTripMock,
    delete: deleteTripMock,
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
    TripController["_instance"] = undefined;
});

describe("TripController", () => {
    // ─── createRit ────────────────────────────────────────────────

    describe("createRit", () => {
        it("should return 201 when rit is successfully created", async () => {
            // Arrange
            createTripMock.mockResolvedValue(mockRit);
            const controller: TripController = TripController.getInstance();

            const request: MockRequest = createMockRequest({ body: {
                adres1: mockRit.adres1,
                adres2: mockRit.adres2,
                kilometers: mockRit.kilometers,
                soortRit: mockRit.soortRit,
                soortVoertuig: mockRit.soortVoertuig,
                brandstof: mockRit.brandstof,
            } });
            (request as unknown as { user: { email: string; name: string } }).user = { email: "test@test.com", name: "Test User" };
            const response: MockResponse = createMockResponse();

            // Act
            await controller.createRit(request, response);

            // Assert
            expect(response.statusCode).toBe(201);
            expect(response._getJSONData()).toEqual({ message: "Rit succesvol opgeslagen in database" });
            expect(createTripMock).toHaveBeenCalledTimes(1);
        });

        it("should return 400 when required fields are missing", async () => {
            // Arrange
            const controller: TripController = TripController.getInstance();

            const request: MockRequest = createMockRequest({ body: { adres1: "Amsterdam" } });
            (request as unknown as { user: { email: string; name: string } }).user = { email: "test@test.com", name: "Test User" };
            const response: MockResponse = createMockResponse();

            // Act
            await controller.createRit(request, response);

            // Assert
            expect(response.statusCode).toBe(400);
            expect(response._getJSONData()).toEqual({ error: "Alle velden zijn verplicht." });
        });

        it("should return 500 when service throws an error", async () => {
            // Arrange
            createTripMock.mockRejectedValue(new Error("Database error"));
            const controller: TripController = TripController.getInstance();

            const request: MockRequest = createMockRequest({ body: {
                adres1: mockRit.adres1,
                adres2: mockRit.adres2,
                kilometers: mockRit.kilometers,
                soortRit: mockRit.soortRit,
                soortVoertuig: mockRit.soortVoertuig,
                brandstof: mockRit.brandstof,
            } });
            (request as unknown as { user: { email: string; name: string } }).user = { email: "test@test.com", name: "Test User" };
            const response: MockResponse = createMockResponse();

            // Act
            await controller.createRit(request, response);

            // Assert
            expect(response.statusCode).toBe(500);
            expect(response._getJSONData()).toEqual({ error: "Fout bij opslaan in database. Check console." });
        });
    });

    // ─── getTripsByEmail ──────────────────────────────────────────

    describe("getTripsByEmail", () => {
        it("should return 200 with naam and ritten", async () => {
            // Arrange
            getTripsByEmailMock.mockResolvedValue([mockRit]);
            const controller: TripController = TripController.getInstance();

            const request: MockRequest = createMockRequest();
            (request as unknown as { user: { email: string; name: string } }).user = { email: "test@test.com", name: "Test User" };
            const response: MockResponse = createMockResponse();

            // Act
            await controller.getTripsByEmail(request, response);

            // Assert
            expect(response.statusCode).toBe(200);
            const json: { naam: string; ritten: RitData[] } = response._getJSONData() as { naam: string; ritten: RitData[] };
            expect(json.naam).toBe("Test User");
            expect(json.ritten).toHaveLength(1);
            expect(getTripsByEmailMock).toHaveBeenCalledWith("test@test.com");
        });

        it("should return 200 with empty ritten when user has no trips", async () => {
            // Arrange
            getTripsByEmailMock.mockResolvedValue([]);
            const controller: TripController = TripController.getInstance();

            const request: MockRequest = createMockRequest();
            (request as unknown as { user: { email: string; name: string } }).user = { email: "leeg@test.com", name: "Lege User" };
            const response: MockResponse = createMockResponse();

            // Act
            await controller.getTripsByEmail(request, response);

            // Assert
            expect(response.statusCode).toBe(200);
            const json: { naam: string; ritten: RitData[] } = response._getJSONData() as { naam: string; ritten: RitData[] };
            expect(json.ritten).toEqual([]);
        });

        it("should return 500 when service throws an error", async () => {
            // Arrange
            getTripsByEmailMock.mockRejectedValue(new Error("Database error"));
            const controller: TripController = TripController.getInstance();

            const request: MockRequest = createMockRequest();
            (request as unknown as { user: { email: string; name: string } }).user = { email: "test@test.com", name: "Test User" };
            const response: MockResponse = createMockResponse();

            // Act
            await controller.getTripsByEmail(request, response);

            // Assert
            expect(response.statusCode).toBe(500);
            expect(response._getJSONData()).toEqual({ error: "Fout bij ophalen ritten." });
        });
    });

    // ─── updateRit ────────────────────────────────────────────────

    describe("updateRit", () => {
        it("should return 200 when rit is successfully updated", async () => {
            // Arrange
            updateTripMock.mockResolvedValue({ ...mockRit, kilometers: 100 });
            const controller: TripController = TripController.getInstance();

            const request: MockRequest = createMockRequest({
                params: { datetime: encodeURIComponent("2024-01-01 10:00:00") },
                body: {
                    adres1: mockRit.adres1,
                    adres2: mockRit.adres2,
                    kilometers: mockRit.kilometers,
                    soortRit: mockRit.soortRit,
                    soortVoertuig: mockRit.soortVoertuig,
                    brandstof: mockRit.brandstof,
                },
            });
            (request as unknown as { user: { email: string; name: string } }).user = { email: "test@test.com", name: "Test User" };
            const response: MockResponse = createMockResponse();

            // Act
            await controller.updateRit(request as unknown as import("express").Request<{ datetime: string }>, response);

            // Assert
            expect(response.statusCode).toBe(200);
            expect(response._getJSONData()).toEqual({ message: "Rit succesvol geüpdatet in database" });
            expect(updateTripMock).toHaveBeenCalledTimes(1);
        });

        it("should return 400 when datetime param is missing", async () => {
            // Arrange
            const controller: TripController = TripController.getInstance();

            const request: MockRequest = createMockRequest({ params: {}, body: { adres1: "Amsterdam" } });
            (request as unknown as { user: { email: string; name: string } }).user = { email: "test@test.com", name: "Test User" };
            const response: MockResponse = createMockResponse();

            // Act
            await controller.updateRit(request as unknown as import("express").Request<{ datetime: string }>, response);

            // Assert
            expect(response.statusCode).toBe(400);
            expect(response._getJSONData()).toEqual({ error: "Datum/tijd is verplicht." });
        });

        it("should return 400 when required body fields are missing", async () => {
            // Arrange
            const controller: TripController = TripController.getInstance();

            const request: MockRequest = createMockRequest({
                params: { datetime: encodeURIComponent("2024-01-01 10:00:00") },
                body: { adres1: "Amsterdam" },
            });
            (request as unknown as { user: { email: string; name: string } }).user = { email: "test@test.com", name: "Test User" };
            const response: MockResponse = createMockResponse();

            // Act
            await controller.updateRit(request as unknown as import("express").Request<{ datetime: string }>, response);

            // Assert
            expect(response.statusCode).toBe(400);
            expect(response._getJSONData()).toEqual({ error: "Alle velden zijn verplicht." });
        });

        it("should return 500 when service throws an error", async () => {
            // Arrange
            updateTripMock.mockRejectedValue(new Error("Database error"));
            const controller: TripController = TripController.getInstance();

            const request: MockRequest = createMockRequest({
                params: { datetime: encodeURIComponent("2024-01-01 10:00:00") },
                body: {
                    adres1: mockRit.adres1,
                    adres2: mockRit.adres2,
                    kilometers: mockRit.kilometers,
                    soortRit: mockRit.soortRit,
                    soortVoertuig: mockRit.soortVoertuig,
                    brandstof: mockRit.brandstof,
                },
            });
            (request as unknown as { user: { email: string; name: string } }).user = { email: "test@test.com", name: "Test User" };
            const response: MockResponse = createMockResponse();

            // Act
            await controller.updateRit(request as unknown as import("express").Request<{ datetime: string }>, response);

            // Assert
            expect(response.statusCode).toBe(500);
            expect(response._getJSONData()).toEqual({ error: "Fout bij opslaan in database. Check console." });
        });
    });

    // ─── deleteRit ────────────────────────────────────────────────

    describe("deleteRit", () => {
        it("should return 200 when rit is successfully deleted", async () => {
            // Arrange
            deleteTripMock.mockResolvedValue(true);
            const controller: TripController = TripController.getInstance();

            const request: MockRequest = createMockRequest({
                params: { datetime: encodeURIComponent("2024-01-01 10:00:00") },
            });
            (request as unknown as { user: { email: string; name: string } }).user = { email: "test@test.com", name: "Test User" };
            const response: MockResponse = createMockResponse();

            // Act
            await controller.deleteRit(request as unknown as import("express").Request<{ datetime: string }>, response);

            // Assert
            expect(response.statusCode).toBe(200);
            expect(response._getJSONData()).toEqual({ message: "Rit succesvol verwijderd uit database" });
            expect(deleteTripMock).toHaveBeenCalledTimes(1);
        });

        it("should return 400 when datetime param is missing", async () => {
            // Arrange
            const controller: TripController = TripController.getInstance();

            const request: MockRequest = createMockRequest({ params: {} });
            (request as unknown as { user: { email: string; name: string } }).user = { email: "test@test.com", name: "Test User" };
            const response: MockResponse = createMockResponse();

            // Act
            await controller.deleteRit(request as unknown as import("express").Request<{ datetime: string }>, response);

            // Assert
            expect(response.statusCode).toBe(400);
            expect(response._getJSONData()).toEqual({ error: "Datum/tijd is verplicht." });
        });

        it("should return 500 when service throws an error", async () => {
            // Arrange
            deleteTripMock.mockRejectedValue(new Error("Database error"));
            const controller: TripController = TripController.getInstance();

            const request: MockRequest = createMockRequest({
                params: { datetime: encodeURIComponent("2024-01-01 10:00:00") },
            });
            (request as unknown as { user: { email: string; name: string } }).user = { email: "test@test.com", name: "Test User" };
            const response: MockResponse = createMockResponse();

            // Act
            await controller.deleteRit(request as unknown as import("express").Request<{ datetime: string }>, response);

            // Assert
            expect(response.statusCode).toBe(500);
            expect(response._getJSONData()).toEqual({ error: "Fout bij verwijderen uit database. Check console." });
        });
    });
});
