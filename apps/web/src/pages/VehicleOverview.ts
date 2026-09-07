import { VehicleService } from "../services/VehicleService";
import { Vehicle } from "@web/interfaces/Vehicle";
import "@web/components/AdminSidebarComponent";

class VehicleOverviewPage {
    private editingNumberPlate: string | null = null;

    private readonly tableBody: HTMLTableSectionElement;

    private readonly createModal: HTMLElement;
    private readonly editModal: HTMLElement;
    private readonly detailModal: HTMLElement;

    private readonly openCreateBtn: HTMLButtonElement;
    private readonly closeCreateBtn: HTMLButtonElement;
    private readonly closeEditBtn: HTMLButtonElement;
    private readonly closeDetailBtn: HTMLButtonElement;

    private readonly createForm: HTMLFormElement;
    private readonly editForm: HTMLFormElement;

    private readonly createNumberPlate: HTMLInputElement;
    private readonly createBrand: HTMLInputElement;
    private readonly createModel: HTMLInputElement;
    private readonly createModelYear: HTMLInputElement;
    private readonly createFuelType: HTMLInputElement;
    private readonly createDepartment: HTMLInputElement;

    private readonly createNumberPlateError: HTMLSpanElement;
    private readonly createBrandError: HTMLSpanElement;
    private readonly createModelError: HTMLSpanElement;
    private readonly createModelYearError: HTMLSpanElement;

    private readonly editBrand: HTMLInputElement;
    private readonly editModel: HTMLInputElement;
    private readonly editModelYear: HTMLInputElement;
    private readonly editFuelType: HTMLInputElement;
    private readonly editDepartment: HTMLInputElement;

    private readonly editBrandError: HTMLSpanElement;
    private readonly editModelError: HTMLSpanElement;
    private readonly editModelYearError: HTMLSpanElement;

    private readonly detailContent: HTMLDivElement;

    public constructor(private readonly vehicleService: VehicleService) {
        this.tableBody = document.getElementById("vehicle-table-body") as HTMLTableSectionElement;

        this.createModal = document.getElementById("create-modal") as HTMLElement;
        this.editModal = document.getElementById("edit-modal") as HTMLElement;
        this.detailModal = document.getElementById("detail-modal") as HTMLElement;

        this.openCreateBtn = document.getElementById("open-create") as HTMLButtonElement;
        this.closeCreateBtn = document.getElementById("close-create") as HTMLButtonElement;
        this.closeEditBtn = document.getElementById("close-edit") as HTMLButtonElement;
        this.closeDetailBtn = document.getElementById("close-detail") as HTMLButtonElement;

        this.createForm = document.getElementById("create-vehicle-form") as HTMLFormElement;
        this.editForm = document.getElementById("edit-vehicle-form") as HTMLFormElement;

        this.createNumberPlate = document.getElementById("create-number-plate") as HTMLInputElement;
        this.createBrand = document.getElementById("create-brand") as HTMLInputElement;
        this.createModel = document.getElementById("create-model") as HTMLInputElement;
        this.createModelYear = document.getElementById("create-model-year") as HTMLInputElement;
        this.createFuelType = document.getElementById("create-fuel-type") as HTMLInputElement;
        this.createDepartment = document.getElementById("create-department") as HTMLInputElement;

        this.createNumberPlateError = document.getElementById("create-number-plate-error") as HTMLSpanElement;
        this.createBrandError = document.getElementById("create-brand-error") as HTMLSpanElement;
        this.createModelError = document.getElementById("create-model-error") as HTMLSpanElement;
        this.createModelYearError = document.getElementById("create-model-year-error") as HTMLSpanElement;

        this.editBrand = document.getElementById("edit-brand") as HTMLInputElement;
        this.editModel = document.getElementById("edit-model") as HTMLInputElement;
        this.editModelYear = document.getElementById("edit-model-year") as HTMLInputElement;
        this.editFuelType = document.getElementById("edit-fuel-type") as HTMLInputElement;
        this.editDepartment = document.getElementById("edit-department") as HTMLInputElement;

        this.editBrandError = document.getElementById("edit-brand-error") as HTMLSpanElement;
        this.editModelError = document.getElementById("edit-model-error") as HTMLSpanElement;
        this.editModelYearError = document.getElementById("edit-model-year-error") as HTMLSpanElement;

        this.detailContent = document.getElementById("detail-content") as HTMLDivElement;

        this.bindEvents();
        void this.loadVehicles();
    }

    private bindEvents(): void {
        this.openCreateBtn.addEventListener("click", () => this.openCreateModal());
        this.closeCreateBtn.addEventListener("click", () => this.closeCreateModal());
        this.closeEditBtn.addEventListener("click", () => this.closeEditModal());
        this.closeDetailBtn.addEventListener("click", () => this.closeDetailModal());

        this.createModal.addEventListener("click", e => {
            if (e.target === this.createModal) {
                this.closeCreateModal();
            }
        });
        this.editModal.addEventListener("click", e => {
            if (e.target === this.editModal) {
                this.closeEditModal();
            }
        });
        this.detailModal.addEventListener("click", e => {
            if (e.target === this.detailModal) {
                this.closeDetailModal();
            }
        });

        this.createForm.addEventListener("submit", e => {
            e.preventDefault();
            void this.handleCreate();
        });
        this.editForm.addEventListener("submit", e => {
            e.preventDefault();
            void this.handleUpdate();
        });
    }

    private renderVehicles(vehicles: Vehicle[]): void {
        this.tableBody.innerHTML = "";

        if (vehicles.length === 0) {
            this.tableBody.innerHTML = "<tr><td colspan=8 style=text-align:center; padding:20px; color:#888;>Geen voertuigen gevonden</td></tr>";

            return;
        }

        vehicles.forEach(vehicle => {
            const tr: HTMLTableRowElement = document.createElement("tr");

            tr.innerHTML = `
                <td>${vehicle.numberPlate}</td>
                <td>${vehicle.brand}</td>
                <td>${vehicle.model}</td>
                <td>${vehicle.modelYear}</td>
                <td>${vehicle.fuelType ?? "—"}</td>
                <td>${vehicle.department ?? "—"}</td>
                <td><span class="badge badge-info">Temp</span></td>
                <td class="action-cell">
                    <button class="btn btn-primary btn-sm edit-btn" data-plate="${vehicle.numberPlate}">Wijzig</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-plate="${vehicle.numberPlate}">Verwijder</button>
                </td>
            `;

            tr.addEventListener("click", e => {
                if ((e.target as HTMLElement).closest(".action-cell")) {
                    return;
                }

                this.openDetailModal(vehicle);
            });

            this.tableBody.appendChild(tr);
        });

        this.tableBody.querySelectorAll(".edit-btn").forEach(btn =>
            btn.addEventListener("click", e => {
                e.stopPropagation();
                const plate: string = (e.currentTarget as HTMLElement).dataset.plate!;
                void this.openEditModal(plate);
            })
        );

        this.tableBody.querySelectorAll(".delete-btn").forEach(btn =>
            btn.addEventListener("click", e => {
                e.stopPropagation();
                const plate: string = (e.currentTarget as HTMLElement).dataset.plate!;
                void this.handleDelete(plate);
            })
        );
    }

    private async loadVehicles(): Promise<void> {
        try {
            const vehicles: Vehicle[] = await this.vehicleService.getAll();
            this.renderVehicles(vehicles);
        }
        catch (err) {
            console.error("Fout bij laden van voertuigen:", err);
            this.tableBody.innerHTML = "<tr><td colspan=\"8\" style=\"color:red; padding:20px;\">Fout bij het laden van voertuigen.</td></tr>";
        }
    }

    private validateCreate(): boolean {
        let valid: boolean = true;

        this.createNumberPlateError.textContent = "";
        this.createBrandError.textContent = "";
        this.createModelError.textContent = "";
        this.createModelYearError.textContent = "";

        if (!this.createNumberPlate.value.trim()) {
            this.createNumberPlateError.textContent = "Kenteken is verplicht";
            valid = false;
        }

        if (!this.createBrand.value.trim()) {
            this.createBrandError.textContent = "Merk is verplicht";
            valid = false;
        }

        if (!this.createModel.value.trim()) {
            this.createModelError.textContent = "Model is verplicht";
            valid = false;
        }

        const year: number = parseInt(this.createModelYear.value);

        if (!this.createModelYear.value || isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1) {
            this.createModelYearError.textContent = "Vul een geldig bouwjaar in";
            valid = false;
        }

        return valid;
    }

    private validateEdit(): boolean {
        let valid: boolean = true;

        this.editBrandError.textContent = "";
        this.editModelError.textContent = "";
        this.editModelYearError.textContent = "";

        if (!this.editBrand.value.trim()) {
            this.editBrandError.textContent = "Merk is verplicht";
            valid = false;
        }

        if (!this.editModel.value.trim()) {
            this.editModelError.textContent = "Model is verplicht";
            valid = false;
        }

        const year: number = parseInt(this.editModelYear.value);

        if (!this.editModelYear.value || isNaN(year) || year < 1900 || year > new Date().getFullYear() + 1) {
            this.editModelYearError.textContent = "Vul een geldig bouwjaar in";
            valid = false;
        }

        return valid;
    }

    private openCreateModal(): void {
        this.createNumberPlate.value = "";
        this.createBrand.value = "";
        this.createModel.value = "";
        this.createModelYear.value = "";
        this.createFuelType.value = "";
        this.createDepartment.value = "";

        this.createNumberPlateError.textContent = "";
        this.createBrandError.textContent = "";
        this.createModelError.textContent = "";
        this.createModelYearError.textContent = "";

        this.createModal.classList.add("show");
        this.createNumberPlate.focus();
    }

    private closeCreateModal(): void {
        this.createModal.classList.remove("show");
    }

    private async openEditModal(numberPlate: string): Promise<void> {
        this.editingNumberPlate = numberPlate;

        // OPEN MODAL IMMEDIATELY
        this.editModal.classList.add("show");

        try {
            const vehicle: Vehicle = await this.vehicleService.getByNumberPlate(numberPlate);

            this.editBrand.value = vehicle.brand;
            this.editModel.value = vehicle.model;
            this.editModelYear.value = String(vehicle.modelYear);
            this.editFuelType.value = vehicle.fuelType ?? "";
            this.editDepartment.value = vehicle.department ?? "";

            this.editBrandError.textContent = "";
            this.editModelError.textContent = "";
            this.editModelYearError.textContent = "";

            this.editBrand.focus();
        }
        catch (err) {
            console.error("Fout bij ophalen voertuig:", err);
        }
    }

    private closeEditModal(): void {
        this.editModal.classList.remove("show");
        this.editingNumberPlate = null;
    }

    private openDetailModal(vehicle: Vehicle): void {
        this.detailContent.innerHTML = `
            <div class="detail-item">
                <label>Kenteken</label>
                <span>${vehicle.numberPlate}</span>
            </div>
            <div class="detail-item">
                <label>Merk</label>
                <span>${vehicle.brand}</span>
            </div>
            <div class="detail-item">
                <label>Model</label>
                <span>${vehicle.model}</span>
            </div>
            <div class="detail-item">
                <label>Bouwjaar</label>
                <span>${vehicle.modelYear}</span>
            </div>
            <div class="detail-item">
                <label>Brandstof</label>
                <span>${vehicle.fuelType ?? "—"}</span>
            </div>
            <div class="detail-item">
                <label>Afdeling</label>
                <span>${vehicle.department ?? "—"}</span>
            </div>
            <div class="detail-item">
                <label>Status</label>
                <span>Temp</span>
            </div>
        `;
        this.detailModal.classList.add("show");
    }

    private closeDetailModal(): void {
        this.detailModal.classList.remove("show");
    }

    private async handleCreate(): Promise<void> {
        if (!this.validateCreate()) {
            return;
        }

        const vehicle: Vehicle = {
            numberPlate: this.createNumberPlate.value.trim(),
            brand: this.createBrand.value.trim(),
            model: this.createModel.value.trim(),
            modelYear: parseInt(this.createModelYear.value),
            fuelType: this.createFuelType.value.trim() || undefined,
            department: this.createDepartment.value.trim() || undefined,
        };

        try {
            await this.vehicleService.create(vehicle);
            this.closeCreateModal();
            await this.loadVehicles();
        }
        catch (err) {
            console.error("Fout bij aanmaken voertuig:", err);
        }
    }

    private async handleUpdate(): Promise<void> {
        if (!this.editingNumberPlate || !this.validateEdit()) {
            return;
        }

        const data: Partial<Vehicle> = {
            brand: this.editBrand.value.trim(),
            model: this.editModel.value.trim(),
            modelYear: parseInt(this.editModelYear.value),
            fuelType: this.editFuelType.value.trim() || undefined,
            department: this.editDepartment.value.trim() || undefined,
        };

        try {
            await this.vehicleService.update(this.editingNumberPlate, data);
            this.closeEditModal();
            await this.loadVehicles();
        }
        catch (err) {
            console.error("Fout bij bijwerken voertuig:", err);
        }
    }

    private async handleDelete(numberPlate: string): Promise<void> {
        if (!confirm(`Weet je zeker dat je voertuig "${numberPlate}" wilt verwijderen?`)) {
            return;
        }

        try {
            await this.vehicleService.delete(numberPlate);
            await this.loadVehicles();
        }
        catch (err) {
            console.error("Fout bij verwijderen voertuig:", err);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new VehicleOverviewPage(new VehicleService());
});
