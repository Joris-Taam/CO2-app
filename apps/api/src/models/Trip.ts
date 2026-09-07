import { Entity, PrimaryColumn, Column } from "typeorm";

export type SoortRit = "zakelijk" | "prive" | "woon-werk";
export type SoortVoertuig = "auto" | "motor" | "fiets";
export type Brandstof = "benzine" | "diesel" | "elektrisch" | "hybride";

/**
 * Represents a trip in the application.
 */
export interface RitData {
    /** Email address of the user who made the trip */
    userEmail: string;

    /** Date and time the trip was registered */
    createdAt: string;

    /** Start address of the trip */
    adres1: string;

    /** End address of the trip */
    adres2: string;

    /** Distance of the trip in kilometers */
    kilometers: number;

    /** Type of trip (zakelijk, prive, woon-werk) */
    soortRit: SoortRit;

    /** Type of vehicle used */
    soortVoertuig: SoortVoertuig;

    /** Type of fuel used */
    brandstof: Brandstof;
}

export type RitInput = Omit<RitData, "userEmail">;

/**
 * ORM entity representing the trip table in the database.
 *
 * @remarks
 * Repository Pattern — Refactoring.Guru
 * @see https://refactoring.guru/design-patterns/catalog
 *
 */
@Entity({ name: "trip" })
export class TripORM {
    /** Email address of the user, part of composite primary key */
    @PrimaryColumn({ name: "user_email", type: "varchar" })
    public user_email!: string;

    /** Date and time of the trip, part of composite primary key */
    @PrimaryColumn({ name: "trip_datetime", type: "datetime" })
    public trip_datetime!: string;

    /** Start location of the trip */
    @Column({ name: "start_location", type: "varchar" })
    public start_location!: string;

    /** End location of the trip */
    @Column({ name: "end_location", type: "varchar" })
    public end_location!: string;

    /** Distance of the trip in kilometers */
    @Column({ name: "distance_km", type: "decimal" })
    public distance_km!: number;

    /** Name of the vehicle used */
    @Column({ name: "vehicle_name", type: "varchar" })
    public vehicle_name!: string;

    /** Type of fuel used */
    @Column({ name: "fuel_name", type: "varchar" })
    public fuel_name!: string;

    /** Type of trip */
    @Column({ name: "trip_type_name", type: "varchar" })
    public trip_type_name!: string;
}
