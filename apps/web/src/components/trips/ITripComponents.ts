import { Rit } from "@web/interfaces/TripInterface";

export interface ICo2CalculatorComponent extends HTMLElement {
    calculateCo2(rit: Rit): number;
}

export interface ITripFilterComponent extends HTMLElement {
    filterTrips(trips: Rit[]): Rit[];
}

export interface ITripListComponent extends HTMLElement {
    setTrips(trips: Rit[]): void;
    renderFiltered(trips: Rit[]): void;
}

export interface ITripRowComponent extends HTMLTableRowElement {
    setTrip(rit: Rit): void;
}

export interface IRitCreateModalComponent extends HTMLElement {
    open(): void;
    close(): void;
    setError(msg: string): void;
}

export interface ITripEditModalComponent extends HTMLElement {
    open(rit: Rit): void;
    close(): void;
    setError(msg: string): void;
    setTrip(rit: Rit): void;
}
