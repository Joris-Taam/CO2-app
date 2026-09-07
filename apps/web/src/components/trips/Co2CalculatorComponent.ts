import { Brandstof, Rit } from "@web/interfaces/TripInterface";

export class Co2CalculatorComponent extends HTMLElement {
    private static readonly fuelFactors: Record<Brandstof, number> = {
        benzine: 0.149,
        diesel: 0.136,
        elektrisch: 0.000,
        hybride: 0.138,
    };

    public static calculateCo2(trip: Rit): number {
        const factor: number = Co2CalculatorComponent.fuelFactors[trip.brandstof];
        const kms: number = trip.kilometers || 0;

        return kms * factor;
    }

    public static calculateTotalCo2(trips: Rit[]): number {
        return trips.reduce((sum, trip) => sum + Co2CalculatorComponent.calculateCo2(trip), 0);
    }
}

customElements.define("co2-calculator", Co2CalculatorComponent);
