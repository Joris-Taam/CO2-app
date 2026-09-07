import { beforeEach, describe, expect, it, vi } from "vitest";
import { createTestApp, TestApp, TestResponse } from "./__helpers__/express.helpers";

import { app } from "@api/index";
import { TripRepository } from "@api/repositories/TripRepository";
import { RitData } from "@api/models/Trip";
import * as jwt from "jsonwebtoken";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const JWT_SECRET: string = "fallback_secret_change_in_production";

function createTestToken(email: string = "test@test.com", name: string = "Test User"): string {
    return jwt.sign({ email, name }, JWT_SECRET);
}

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
    vi.resetAllMocks();
});

describe("Trip routes (integration)", () => {
    // ─── GET /api/me ──────────────────────────────────────────────

    describe("GET /api/me", () => {
        it("should return 200 with naam and ritten when authenticated", async () => {
            // Arrange
            const testApp: TestApp = createTestApp(app);
            vi.spyOn(TripRepository.prototype, "findByEmail").mockResolvedValue([mockRit]);

            // Act
            const response: TestResponse = await testApp
                .get("/api/me")
                .set("Authorization", `Bearer ${createTestToken()}`)
                .send();

            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("naam", "Test User");
            const body: { ritten: RitData[] } = response.body as { ritten: RitData[] };
            expect(body.ritten).toHaveLength(1);
        });

        it("should return 401 when no token is provided", async () => {
            // Arrange
            const testApp: TestApp = createTestApp(app);

            // Act
            const response: TestResponse = await testApp
                .get("/api/me")
                .send();

            // Assert
            expect(response.status).toBe(401);
        });
    });

    // ─── POST /api/create ─────────────────────────────────────────

    describe("POST /api/create", () => {
        it("should return 201 when rit is successfully created", async () => {
            // Arrange
            const testApp: TestApp = createTestApp(app);
            vi.spyOn(TripRepository.prototype, "create").mockResolvedValue(undefined);

            // Act
            const response: TestResponse = await testApp
                .post("/api/create")
                .set("Authorization", `Bearer ${createTestToken()}`)
                .send({
                    adres1: mockRit.adres1,
                    adres2: mockRit.adres2,
                    kilometers: mockRit.kilometers,
                    soortRit: mockRit.soortRit,
                    soortVoertuig: mockRit.soortVoertuig,
                    brandstof: mockRit.brandstof,
                });

            // Assert
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("message", "Rit succesvol opgeslagen in database");
        });

        it("should return 400 when required fields are missing", async () => {
            // Arrange
            const testApp: TestApp = createTestApp(app);

            // Act
            const response: TestResponse = await testApp
                .post("/api/create")
                .set("Authorization", `Bearer ${createTestToken()}`)
                .send({ adres1: "Amsterdam" });

            // Assert
            expect(response.status).toBe(400);
            expect(response.body).toHaveProperty("error", "Alle velden zijn verplicht.");
        });

        it("should return 401 when no token is provided", async () => {
            // Arrange
            const testApp: TestApp = createTestApp(app);

            // Act
            const response: TestResponse = await testApp
                .post("/api/create")
                .send({ adres1: "Amsterdam" });

            // Assert
            expect(response.status).toBe(401);
        });
    });

    // ─── PUT /api/:datetime ───────────────────────────────────────

    describe("PUT /api/:datetime", () => {
        it("should return 200 when rit is successfully updated", async () => {
            // Arrange
            const testApp: TestApp = createTestApp(app);
            vi.spyOn(TripRepository.prototype, "update").mockResolvedValue(null);

            // Act
            const response: TestResponse = await testApp
                .put(`/api/${encodeURIComponent("2024-01-01 10:00:00")}`)
                .set("Authorization", `Bearer ${createTestToken()}`)
                .send({
                    adres1: mockRit.adres1,
                    adres2: mockRit.adres2,
                    kilometers: 100,
                    soortRit: mockRit.soortRit,
                    soortVoertuig: mockRit.soortVoertuig,
                    brandstof: mockRit.brandstof,
                });

            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", "Rit succesvol geüpdatet in database");
        });

        it("should return 400 when required fields are missing", async () => {
            // Arrange
            const testApp: TestApp = createTestApp(app);

            // Act
            const response: TestResponse = await testApp
                .put(`/api/${encodeURIComponent("2024-01-01 10:00:00")}`)
                .set("Authorization", `Bearer ${createTestToken()}`)
                .send({ adres1: "Amsterdam" });

            // Assert
            expect(response.status).toBe(400);
        });

        it("should return 401 when no token is provided", async () => {
            // Arrange
            const testApp: TestApp = createTestApp(app);

            // Act
            const response: TestResponse = await testApp
                .put(`/api/${encodeURIComponent("2024-01-01 10:00:00")}`)
                .send({ adres1: "Amsterdam" });

            // Assert
            expect(response.status).toBe(401);
        });
    });

    // ─── DELETE /api/:datetime ────────────────────────────────────

    describe("DELETE /api/:datetime", () => {
        it("should return 200 when rit is successfully deleted", async () => {
            // Arrange
            const testApp: TestApp = createTestApp(app);
            vi.spyOn(TripRepository.prototype, "delete").mockResolvedValue(true);

            // Act
            const response: TestResponse = await testApp
                .delete(`/api/${encodeURIComponent("2024-01-01 10:00:00")}`)
                .set("Authorization", `Bearer ${createTestToken()}`)
                .send();

            // Assert
            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty("message", "Rit succesvol verwijderd uit database");
        });

        it("should return 401 when no token is provided", async () => {
            // Arrange
            const testApp: TestApp = createTestApp(app);

            // Act
            const response: TestResponse = await testApp
                .delete(`/api/${encodeURIComponent("2024-01-01 10:00:00")}`)
                .send();

            // Assert
            expect(response.status).toBe(401);
        });
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// End-to-end tests (CRUD)
// These test the complete CRUD flow in sequence: create → read → update → delete
// The database is mocked to keep tests deterministic.
// ─────────────────────────────────────────────────────────────────────────────

describe("Trip routes (e2e CRUD)", () => {
    it("should create a rit (C)", async () => {
        // Arrange
        const testApp: TestApp = createTestApp(app);
        vi.spyOn(TripRepository.prototype, "create").mockResolvedValue(undefined);

        // Act
        const response: TestResponse = await testApp
            .post("/api/create")
            .set("Authorization", `Bearer ${createTestToken()}`)
            .send({
                adres1: mockRit.adres1,
                adres2: mockRit.adres2,
                kilometers: mockRit.kilometers,
                soortRit: mockRit.soortRit,
                soortVoertuig: mockRit.soortVoertuig,
                brandstof: mockRit.brandstof,
            });

        // Assert
        expect(response.status).toBe(201);
    });

    it("should read ritten for user (R)", async () => {
        // Arrange
        const testApp: TestApp = createTestApp(app);
        vi.spyOn(TripRepository.prototype, "findByEmail").mockResolvedValue([mockRit]);

        // Act
        const response: TestResponse = await testApp
            .get("/api/me")
            .set("Authorization", `Bearer ${createTestToken()}`)
            .send();

        // Assert
        expect(response.status).toBe(200);
        const body: { naam: string; ritten: RitData[] } = response.body as { naam: string; ritten: RitData[] };
        expect(body.ritten[0].adres1).toBe("Amsterdam Centraal");
        expect(body.ritten[0].kilometers).toBe(75);
    });

    it("should update a rit (U)", async () => {
        // Arrange
        const testApp: TestApp = createTestApp(app);
        vi.spyOn(TripRepository.prototype, "update").mockResolvedValue(null);

        // Act
        const response: TestResponse = await testApp
            .put(`/api/${encodeURIComponent("2024-01-01 10:00:00")}`)
            .set("Authorization", `Bearer ${createTestToken()}`)
            .send({
                adres1: mockRit.adres1,
                adres2: mockRit.adres2,
                kilometers: 120,
                soortRit: mockRit.soortRit,
                soortVoertuig: mockRit.soortVoertuig,
                brandstof: mockRit.brandstof,
            });

        // Assert
        expect(response.status).toBe(200);
    });

    it("should delete a rit (D)", async () => {
        // Arrange
        const testApp: TestApp = createTestApp(app);
        vi.spyOn(TripRepository.prototype, "delete").mockResolvedValue(true);

        // Act
        const response: TestResponse = await testApp
            .delete(`/api/${encodeURIComponent("2024-01-01 10:00:00")}`)
            .set("Authorization", `Bearer ${createTestToken()}`)
            .send();

        // Assert
        expect(response.status).toBe(200);
    });
});
