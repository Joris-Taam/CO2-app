import { Rit } from "@web/interfaces/TripInterface";
import { Co2CalculatorComponent } from "./Co2CalculatorComponent";

export class TripRowComponent extends HTMLTableRowElement {
    private trip!: Rit;

    public setTrip(trip: Rit): void {
        this.trip = trip;
        const startAdres: string = trip.adres1.substring(0, 100);
        const eindAdres: string = trip.adres2.substring(0, 100);
        const datum: string = new Date(trip.createdAt).toLocaleDateString("nl-NL");
        const co2: string = Co2CalculatorComponent.calculateCo2(trip).toFixed(2);

        this.innerHTML = `
            <td>${datum}</td>
            <td>${startAdres}</td>
            <td>${eindAdres}</td>
            <td>${trip.kilometers} km</td>
            <td>${trip.soortVoertuig}</td>
            <td>${trip.brandstof}</td>
            <td>${trip.soortRit}</td>
            <td>${co2} kg</td>
            <td><button id="editTripBtn" class="btn btn-primary btn-sm edit-btn">Wijzig</button></td>
            <td><button id="deleteTrip" class="btn btn-danger btn-sm delete-btn">Verwijder</button></td>
        `;

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        const editBtn: HTMLButtonElement = this.querySelector("#editTripBtn") as HTMLButtonElement;

        editBtn.addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("open-edit-modal", {
                detail: this.trip,
                bubbles: true,
                composed: true,
            }));
        });

        const deleteBtn: HTMLButtonElement = this.querySelector("#deleteTrip") as HTMLButtonElement;

        deleteBtn.addEventListener("click", () => {
            this.dispatchEvent(new CustomEvent("rit-delete-request", {
                detail: this.trip,
                bubbles: true,
                composed: true,
            }));
        });
    }
}

customElements.define("trip-row", TripRowComponent, { extends: "tr" });
