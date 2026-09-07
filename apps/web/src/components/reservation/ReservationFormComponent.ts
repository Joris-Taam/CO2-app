import { Reservation } from "@web/interfaces/Reservation";
import { Vehicle } from "@web/interfaces/Vehicle";
import { VehicleService } from "@web/services/VehicleService";

class ReservationFormComponent extends HTMLElement {
    private readonly vehicleService: VehicleService = new VehicleService();

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.innerHTML = `
            <link rel="stylesheet" href="/assets/css/global.css">
            <link rel="stylesheet" href="/assets/css/ReservationOverview.css">
            <div class="modal" id="create-modal">
                <div class="modal-content">
                    <button class="close-btn" id="close-create">&times;</button>
                    <h2>Reserveer een auto</h2>
                    <form id="reservation-form">
                        <div class="form-group">
                            <label>Voertuig</label>
                            <select id="field-numberplate">
                                <option value="">Laden...</option>
                            </select>
                            <span class="field-error" id="error-numberplate"></span>
                        </div>
                        <div class="form-group">
                            <label>Type lease</label>
                            <select id="field-lease-type">
                                <option value="short-term">Short-term</option>
                                <option value="long-term">Long-term</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Startdatum</label>
                            <input type="date" id="field-start-date" />
                            <span class="field-error" id="error-start-date"></span>
                        </div>
                        <div class="form-group">
                            <label>Einddatum</label>
                            <input type="date" id="field-end-date" />
                            <span class="field-error" id="error-end-date"></span>
                        </div>
                        <button type="submit" class="btn btn-primary w-full">Reserveer</button>
                    </form>
                </div>
            </div>
        `;

        const s: ShadowRoot = this.shadowRoot!;
        s.getElementById("close-create")!.addEventListener("click", () => this.close());
        s.getElementById("create-modal")!.addEventListener("click", (e: Event) => {
            if
            (e.target === s.getElementById("create-modal")) {
                this.close();
            }
        });
        s.getElementById("reservation-form")!.addEventListener("submit", (e: Event) => {
            e.preventDefault();
            this.handleSubmit();
        });
        s.getElementById("field-lease-type")!.addEventListener("change", () => this.handleLeaseTypeChange());
    }

    public open(): void {
        this.shadowRoot!.getElementById("create-modal")!.classList.add("show");
        void this.loadVehicles();
    }

    public close(): void {
        this.shadowRoot!.getElementById("create-modal")!.classList.remove("show");
        this.clearErrors();
    }

    public setError(message: string): void {
        this.shadowRoot!.getElementById("error-numberplate")!.textContent = message;
    }

    private handleLeaseTypeChange(): void {
        const s: ShadowRoot = this.shadowRoot!;
        const leaseType: string = (s.getElementById("field-lease-type") as HTMLSelectElement).value;
        const startDateInput: HTMLInputElement = s.getElementById("field-start-date") as HTMLInputElement;
        const endDateInput: HTMLInputElement = s.getElementById("field-end-date") as HTMLInputElement;

        if (leaseType === "long-term") {
            const now: Date = new Date();
            const twoYearsLater: Date = new Date(now);
            twoYearsLater.setFullYear(twoYearsLater.getFullYear() + 2);

            startDateInput.value = now.toISOString().split("T")[0];
            endDateInput.value = twoYearsLater.toISOString().split("T")[0];
            startDateInput.readOnly = true;
            endDateInput.readOnly = true;
        }
        else {
            startDateInput.value = "";
            endDateInput.value = "";
            startDateInput.readOnly = false;
            endDateInput.readOnly = false;
        }
    }

    private async loadVehicles(): Promise<void> {
        const select: HTMLSelectElement = this.shadowRoot!.getElementById("field-numberplate") as HTMLSelectElement;

        try {
            const vehicles: Vehicle[] = await this.vehicleService.getAll();
            select.innerHTML = "<option value=''>Selecteer een voertuig</option>";

            vehicles.forEach((vehicle: Vehicle) => {
                const option: HTMLOptionElement = document.createElement("option");
                option.value = vehicle.numberPlate;
                option.textContent = `${vehicle.numberPlate} — ${vehicle.brand} ${vehicle.model}`;
                select.appendChild(option);
            });
        }
        catch {
            select.innerHTML = "<option value=''>Fout bij laden voertuigen</option>";
        }
    }

    private clearErrors(): void {
        ["error-numberplate", "error-start-date", "error-end-date"].forEach(id => {
            this.shadowRoot!.getElementById(id)!.textContent = "";
        });
    }

    private validate(): boolean {
        this.clearErrors();
        let valid: boolean = true;
        const s: ShadowRoot = this.shadowRoot!;

        if (!(s.getElementById("field-numberplate") as HTMLSelectElement).value) {
            s.getElementById("error-numberplate")!.textContent = "Selecteer een voertuig";
            valid = false;
        }

        const start: string = (s.getElementById("field-start-date") as HTMLInputElement).value;
        const end: string = (s.getElementById("field-end-date") as HTMLInputElement).value;

        if (!start) {
            s.getElementById("error-start-date")!.textContent = "Startdatum is verplicht";
            valid = false;
        }

        if (!end) {
            s.getElementById("error-end-date")!.textContent = "Einddatum is verplicht";
            valid = false;
        }

        if (start && end && new Date(end) <= new Date(start)) {
            s.getElementById("error-end-date")!.textContent = "Einddatum moet na de startdatum liggen";
            valid = false;
        }

        return valid;
    }

    private handleSubmit(): void {
        // eslint-disable-next-line curly
        if (!this.validate()) return;

        const s: ShadowRoot = this.shadowRoot!;
        const reservation: Omit<Reservation, "users_email" | "created_at"> = {
            vehicles_number_plate: (s.getElementById("field-numberplate") as HTMLSelectElement).value,
            lease_type: (s.getElementById("field-lease-type") as HTMLSelectElement).value,
            start_date: new Date((s.getElementById("field-start-date") as HTMLInputElement).value),
            end_date: new Date((s.getElementById("field-end-date") as HTMLInputElement).value),
        };

        this.dispatchEvent(new CustomEvent("reservation-submit", {
            detail: reservation,
            bubbles: true,
            composed: true,
        }));
    }
}

customElements.define("reservation-form", ReservationFormComponent);
