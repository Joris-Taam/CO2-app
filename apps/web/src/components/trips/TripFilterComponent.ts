import { Rit } from "@web/interfaces/TripInterface";
import { IRitCreateModalComponent, ITripListComponent } from "./ITripComponents";

class TripFilterComponent extends HTMLElement {
    private filterStart!: HTMLInputElement;
    private filterEind!: HTMLInputElement;

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.innerHTML = `
            <link rel="stylesheet" href="/assets/css/Trip.css">
            <link rel="stylesheet" href="/assets/css/global.css">
            <section class="filters">
                <button id="createTrip" class="btn btn-add">+ Nieuwe Rit</button>
                <section class="filter-group">
                    <label>Van:</label>
                    <input type="date" id="filterStart" />
                </section>
                <section class="filter-group">
                    <label>Tot:</label>
                    <input type="date" id="filterEind" />
                </section>
                <rit-create-modal id="createModal"></rit-create-modal>
            </section>
        `;

        this.filterStart = this.shadowRoot!.getElementById("filterStart") as HTMLInputElement;
        this.filterEind = this.shadowRoot!.getElementById("filterEind") as HTMLInputElement;

        this.filterStart.addEventListener("change", () => this.dispatchFilter());
        this.filterEind.addEventListener("change", () => this.dispatchFilter());

        this.setupEventListeners();
    }

    private setupEventListeners(): void {
        const btn: HTMLButtonElement = this.shadowRoot!.querySelector("#createTrip") as HTMLButtonElement;
        const modal: IRitCreateModalComponent | null = this.shadowRoot!.querySelector("#createModal");

        if (modal) {
            btn.addEventListener("click", (): void => {
                console.log("Opening modal...");
                modal.open();
            });
        }

        this.shadowRoot!.addEventListener("rit-created", (): void => {
            const tripList: ITripListComponent | null = this.shadowRoot!.querySelector("trip-list");

            if (tripList && typeof tripList.setTrips === "function") {
                tripList.setTrips([]);
            }
        });
    }

    private dispatchFilter(): void {
        this.dispatchEvent(new CustomEvent("filter-changed", {
            detail: {
                start: this.filterStart.value ? new Date(this.filterStart.value) : null,
                eind: this.filterEind.value ? new Date(this.filterEind.value) : null,
            },
            bubbles: true,
            composed: true,
        }));
    }

    public filterTrips(trips: Rit[]): Rit[] {
        const start: Date | null = this.filterStart.value ? new Date(this.filterStart.value) : null;
        const eind: Date | null = this.filterEind.value ? new Date(this.filterEind.value) : null;

        return trips.filter(trip => {
            const tripDate: Date = new Date(trip.createdAt);

            if (start && tripDate < start) {
                return false;
            }

            if (eind && tripDate > eind) {
                return false;
            }

            return true;
        });
    }
}

customElements.define("trip-filter", TripFilterComponent);
