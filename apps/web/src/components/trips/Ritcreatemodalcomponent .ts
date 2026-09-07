import { RitService } from "../../services/TripService";
import { Rit, SoortRit, SoortVoertuig, Brandstof } from "../../interfaces/TripInterface";
import { RitRepository } from "@web/repositories/TripRepository";
import { FavoriteTripService } from "@web/services/FavoriteTripService";
import { type FavoriteTrip } from "@web/Models/FavoriteTrip";

export class RitCreateModalComponent extends HTMLElement {
    private modal!: HTMLElement;
    private form!: HTMLFormElement;
    private opslaanBtn!: HTMLButtonElement;
    private succesBericht!: HTMLParagraphElement;
    private favorietenSelect!: HTMLSelectElement;
    private ritService: RitService = new RitService(new RitRepository());
    private favoriteTripService: FavoriteTripService = new FavoriteTripService();

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.innerHTML = `
            <style>
                *,
                *::before,
                *::after {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                :host {
                    --color-primary:       #42ba82;
                    --color-primary-dark:  #2e9e6b;
                    --color-white:         #ffffff;
                    --color-bg:            #f4f4f4;
                    --color-surface:       #e6e6e6;
                    --color-border:        #d0d0d0;
                    --color-text:          #2c2c2c;
                    --color-text-muted:    #6b6b6b;
                    --color-danger:        #e05252;
                    --radius-md: 6px;
                    --radius-lg: 10px;
                    --shadow-lg: 0px 6px 10px rgba(0, 0, 0, 0.2);
                    --transition: 0.3s ease;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 14px;
                }

                .overlay {
                    display: none;
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(2px);
                    -webkit-backdrop-filter: blur(2px);
                    z-index: 1000;
                    align-items: center;
                    justify-content: center;
                    padding: 0.75rem;
                    animation: fadeIn 0.2s ease;
                }

                .overlay.show {
                    display: flex;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .modal-content {
                    background: var(--color-white);
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-lg);
                    padding: 1.25rem;
                    width: 100%;
                    max-width: 460px;
                    position: relative;
                    animation: slideUp 0.25s ease;
                    box-shadow: var(--shadow-lg);
                }

                .modal-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 0.875rem;
                    padding-bottom: 0.75rem;
                    border-bottom: 1px solid var(--color-border);
                }

                .modal-header h2 {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: var(--color-primary-dark);
                    margin: 0;
                }

                .close-btn {
                    background: none;
                    border: 1px solid var(--color-border);
                    color: var(--color-text-muted);
                    cursor: pointer;
                    width: 28px;
                    height: 28px;
                    border-radius: var(--radius-md);
                    font-size: 1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background var(--transition), color var(--transition);
                    flex-shrink: 0;
                }

                .close-btn:hover {
                    background: var(--color-surface);
                    color: var(--color-text);
                }

                .favorieten-sectie {
                    margin-bottom: 0.875rem;
                    padding-bottom: 0.875rem;
                    border-bottom: 1px solid var(--color-border);
                }

                .favorieten-sectie label {
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: var(--color-text-muted);
                    display: flex;
                    align-items: center;
                    gap: 0.35rem;
                    margin-bottom: 0.35rem;
                }

                .favorieten-sectie label .star-icon {
                    color: var(--color-primary);
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 0.625rem;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .form-group.full {
                    grid-column: 1 / -1;
                }

                label {
                    display: block;
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: var(--color-text);
                    margin-bottom: 0;
                }

                input,
                select {
                    display: block;
                    width: 100%;
                    padding: 7px 10px;
                    font-family: inherit;
                    font-size: 0.8rem;
                    color: var(--color-text);
                    background: var(--color-white);
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-md);
                    transition: border-color var(--transition), box-shadow var(--transition);
                    outline: none;
                }

                input::placeholder {
                    color: var(--color-text-muted);
                }

                input:focus,
                select:focus {
                    border-color: var(--color-primary);
                    box-shadow: 0 0 0 3px rgba(66, 186, 130, 0.2);
                }

                input.invalid,
                select.invalid {
                    border-color: var(--color-danger);
                    box-shadow: 0 0 0 3px rgba(224, 82, 82, 0.15);
                }

                select option {
                    background: var(--color-white);
                    color: var(--color-text);
                }

                .field-error {
                    font-size: 0.7rem;
                    color: var(--color-danger);
                    min-height: 0.9em;
                }

                .favorite-toggle {
                    grid-column: 1 / -1;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 0.75rem;
                    background: var(--color-bg);
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-md);
                    cursor: pointer;
                    transition: background var(--transition), border-color var(--transition);
                    user-select: none;
                }

                .favorite-toggle:hover {
                    background: var(--color-surface);
                    border-color: var(--color-primary);
                }

                .favorite-toggle input[type="checkbox"] {
                    width: 14px;
                    height: 14px;
                    accent-color: var(--color-primary);
                    cursor: pointer;
                    flex-shrink: 0;
                    padding: 0;
                    border: none;
                    box-shadow: none;
                }

                .favorite-toggle input[type="checkbox"]:focus {
                    box-shadow: none;
                    border: none;
                }

                .favorite-toggle-label {
                    font-size: 0.8rem;
                    font-weight: 600;
                    color: var(--color-text);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.35rem;
                }

                .star-icon {
                    color: var(--color-primary);
                    font-size: 0.9rem;
                }

                .form-footer {
                    margin-top: 0.875rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .btn-primary {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    background: var(--color-primary);
                    border: none;
                    border-radius: var(--radius-md);
                    color: var(--color-white);
                    cursor: pointer;
                    font-family: inherit;
                    font-size: 0.8rem;
                    font-weight: 600;
                    padding: 8px 16px;
                    width: 100%;
                    transition: background var(--transition), box-shadow var(--transition), transform var(--transition);
                }

                .btn-primary:hover:not(:disabled) {
                    background: var(--color-primary-dark);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
                }

                .btn-primary:active:not(:disabled) {
                    transform: scale(0.97);
                }

                .btn-primary:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .success-message {
                    font-size: 0.8rem;
                    color: var(--color-primary-dark);
                    text-align: center;
                    min-height: 1em;
                    font-weight: 600;
                }
            </style>

            <section class="overlay" id="rit-overlay">
                <section class="modal-content">
                    <section class="modal-header">
                        <h2>Rit toevoegen</h2>
                        <button class="close-btn" id="close-btn" aria-label="Sluiten">&times;</button>
                    </section>

                    <section class="favorieten-sectie" id="favorieten-sectie" style="display: none;">
                        <label for="favorietenDropdown">
                            <span class="star-icon">&#9733;</span>
                            Kies een favoriete rit
                        </label>
                        <select id="favorietenDropdown">
                            <option value="">Selecteer een favoriet...</option>
                        </select>
                    </section>

                    <form id="rit-form" novalidate>
                        <section class="form-grid">
                            <section class="form-group full">
                                <label for="adres1">Vertrekadres</label>
                                <input type="text" id="adres1" placeholder="Van adres" autocomplete="off" />
                                <span class="field-error" id="adres1Error"></span>
                            </section>

                            <section class="form-group full">
                                <label for="adres2">Bestemmingsadres</label>
                                <input type="text" id="adres2" placeholder="Naar adres" autocomplete="off" />
                                <span class="field-error" id="adres2Error"></span>
                            </section>

                            <section class="form-group">
                                <label for="kilometers">Kilometers</label>
                                <input type="number" id="kilometers" placeholder="0" min="1" />
                                <span class="field-error" id="kilometersError"></span>
                            </section>

                            <section class="form-group">
                                <label for="soortRit">Type rit</label>
                                <select id="soortRit">
                                    <option value="">Selecteer...</option>
                                    <option value="woon-werk">Woon-werk</option>
                                    <option value="zakelijk">Zakelijk</option>
                                    <option value="prive">Privé</option>
                                </select>
                                <span class="field-error" id="soortRitError"></span>
                            </section>

                            <section class="form-group">
                                <label for="soortVoertuig">Voertuig</label>
                                <select id="soortVoertuig">
                                    <option value="">Selecteer...</option>
                                    <option value="auto">Auto</option>
                                    <option value="motor">Motor</option>
                                    <option value="fiets">Fiets</option>
                                </select>
                                <span class="field-error" id="soortVoertuigError"></span>
                            </section>

                            <section class="form-group">
                                <label for="brandstof">Brandstof</label>
                                <select id="brandstof">
                                    <option value="">Selecteer...</option>
                                    <option value="benzine">Benzine</option>
                                    <option value="diesel">Diesel</option>
                                    <option value="elektrisch">Elektrisch</option>
                                    <option value="hybride">Hybride</option>
                                </select>
                                <span class="field-error" id="brandstofError"></span>
                            </section>

                            <label class="favorite-toggle">
                                <input type="checkbox" id="slaOpAlsFavoriet" />
                                <span class="favorite-toggle-label">
                                    <span class="star-icon">&#9733;</span>
                                    Sla op als favoriet
                                </span>
                            </label>
                        </section>

                        <section class="form-footer">
                            <p class="success-message" id="succesBericht"></p>
                            <button type="submit" class="btn-primary" id="opslaanBtn">Opslaan</button>
                        </section>
                    </form>
                </section>
            </section>
        `;

        const s: ShadowRoot = this.shadowRoot!;

        this.modal = s.getElementById("rit-overlay") as HTMLElement;
        this.form = s.getElementById("rit-form") as HTMLFormElement;
        this.opslaanBtn = s.getElementById("opslaanBtn") as HTMLButtonElement;
        this.succesBericht = s.getElementById("succesBericht") as HTMLParagraphElement;
        this.favorietenSelect = s.getElementById("favorietenDropdown") as HTMLSelectElement;

        s.getElementById("close-btn")!.addEventListener("click", () => this.close());

        this.modal.addEventListener("click", (e: MouseEvent) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        this.favorietenSelect.addEventListener("change", () => this.vulFormulierMetFavoriet());

        this.form.addEventListener("submit", async (e: Event) => {
            e.preventDefault();
            await this.handleSubmit();
        });
    }

    private async laadFavorieten(): Promise<void> {
        try {
            const favorieten: FavoriteTrip[] = await this.favoriteTripService.getAll();

            const sectie: HTMLElement | null = this.shadowRoot!.getElementById("favorieten-sectie");

            this.favorietenSelect.innerHTML = "<option value=\"\">Selecteer een favoriet...</option>";

            if (favorieten.length === 0 || !sectie) {
                if (sectie) {
                    sectie.style.display = "none";
                }

                return;
            }

            sectie.style.display = "block";

            favorieten.forEach((favoriet: FavoriteTrip, index: number) => {
                const option: HTMLOptionElement = document.createElement("option");

                option.value = String(index);
                option.textContent = `${favoriet.start_location} → ${favoriet.end_location}`;
                option.dataset["favoriet"] = JSON.stringify(favoriet);

                this.favorietenSelect.appendChild(option);
            });
        }
        catch {
            alert("Kon favorieten niet laden. Controleer of de server aan staat.");
        }
    }

    private vulFormulierMetFavoriet(): void {
        const geselecteerd: HTMLOptionElement = this.favorietenSelect.options[this.favorietenSelect.selectedIndex];

        if (!geselecteerd.dataset["favoriet"]) {
            return;
        }

        const favoriet: FavoriteTrip = JSON.parse(geselecteerd.dataset["favoriet"]) as FavoriteTrip;
        const s: ShadowRoot = this.shadowRoot!;

        (s.getElementById("adres1") as HTMLInputElement).value = favoriet.start_location;
        (s.getElementById("adres2") as HTMLInputElement).value = favoriet.end_location;
        (s.getElementById("kilometers") as HTMLInputElement).value = String(favoriet.distance_km ?? "");
        (s.getElementById("soortRit") as HTMLSelectElement).value = favoriet.trip_type_name ?? "";
        (s.getElementById("soortVoertuig") as HTMLSelectElement).value = favoriet.vehicle_name ?? "";
        (s.getElementById("brandstof") as HTMLSelectElement).value = favoriet.fuel_name ?? "";

        this.wisFoutmeldingen();
    }

    private wisFoutmeldingen(): void {
        this.shadowRoot!.querySelectorAll(".field-error").forEach(el => (el.textContent = ""));
        this.shadowRoot!.querySelectorAll(".invalid").forEach(el => el.classList.remove("invalid"));
    }

    private toonFout(elementId: string, bericht: string): void {
        const s: ShadowRoot = this.shadowRoot!;
        const errorEl: HTMLElement | null = s.getElementById(elementId);
        const inputId: string = elementId.replace("Error", "");
        const inputEl: HTMLElement | null = s.getElementById(inputId);

        if (errorEl) {
            errorEl.textContent = bericht;
        }

        if (inputEl) {
            inputEl.classList.add("invalid");
        }
    }

    private getEmailFromCookie(): string | null {
        const match: RegExpMatchArray | null = document.cookie.match(/(?:^|; )user=([^;]*)/);

        return match ? decodeURIComponent(match[1]) : null;
    }

    private getValue(id: string): string {
        return (this.shadowRoot!.getElementById(id) as HTMLInputElement).value.trim();
    }

    private async handleSubmit(): Promise<void> {
        this.wisFoutmeldingen();
        this.succesBericht.textContent = "";

        const s: ShadowRoot = this.shadowRoot!;

        const data: Rit = {
            adres1: (s.getElementById("adres1") as HTMLInputElement).value.trim(),
            adres2: (s.getElementById("adres2") as HTMLInputElement).value.trim(),
            kilometers: Number((s.getElementById("kilometers") as HTMLInputElement).value),
            soortRit: (s.getElementById("soortRit") as HTMLSelectElement).value as SoortRit,
            soortVoertuig: (s.getElementById("soortVoertuig") as HTMLSelectElement).value as SoortVoertuig,
            brandstof: (s.getElementById("brandstof") as HTMLSelectElement).value as Brandstof,
            userEmail: this.getEmailFromCookie() ?? "",
            createdAt: new Date().toISOString(),
        };

        const soortRit: string = this.getValue("soortRit");
        const soortVoertuig: string = this.getValue("soortVoertuig");
        const brandstof: string = this.getValue("brandstof");
        const slaOpAlsFavoriet: boolean = (s.getElementById("slaOpAlsFavoriet") as HTMLInputElement).checked;

        let isGeldig: boolean = true;

        if (!data.adres1) {
            this.toonFout("adres1Error", "Adres 1 is verplicht");
            isGeldig = false;
        }

        if (!data.adres2) {
            this.toonFout("adres2Error", "Adres 2 is verplicht");
            isGeldig = false;
        }

        if (!data.kilometers || data.kilometers <= 0 || isNaN(data.kilometers)) {
            this.toonFout("kilometersError", "Voer een geldig aantal kilometers in");
            isGeldig = false;
        }

        if (!soortRit) {
            this.toonFout("soortRitError", "Selecteer een type rit");
            isGeldig = false;
        }

        if (!soortVoertuig) {
            this.toonFout("soortVoertuigError", "Selecteer een voertuig");
            isGeldig = false;
        }

        if (!brandstof) {
            this.toonFout("brandstofError", "Selecteer een brandstof");
            isGeldig = false;
        }

        if (!isGeldig) {
            return;
        }

        const userEmail: string | null = this.getEmailFromCookie();

        if (!userEmail) {
            alert("Je bent niet ingelogd. Log opnieuw in.");

            return;
        }

        try {
            this.opslaanBtn.disabled = true;
            this.opslaanBtn.textContent = "Bezig met opslaan...";

            await this.ritService.createRit(data);

            if (slaOpAlsFavoriet) {
                const favoriteTrip: FavoriteTrip = {
                    user_email: userEmail,
                    start_location: data.adres1,
                    end_location: data.adres2,
                    distance_km: data.kilometers,
                    vehicle_name: data.soortVoertuig,
                    fuel_name: data.brandstof,
                    trip_type_name: data.soortRit,
                };

                await this.favoriteTripService.save(favoriteTrip);
            }

            this.succesBericht.textContent = slaOpAlsFavoriet
                ? "Rit opgeslagen en toegevoegd aan favorieten!"
                : "Rit succesvol opgeslagen!";

            this.form.reset();

            this.dispatchEvent(new CustomEvent("rit-created", {
                detail: data,
                bubbles: true,
                composed: true,
            }));

            setTimeout(() => this.close(), 1500);
        }
        catch (error: unknown) {
            console.error("Fout:", error);
            alert("Kon de rit niet opslaan. Controleer of de server aan staat.");
        }
        finally {
            this.opslaanBtn.disabled = false;
            this.opslaanBtn.textContent = "Opslaan";
        }
    }

    public open(): void {
        this.wisFoutmeldingen();
        this.succesBericht.textContent = "";
        this.form.reset();
        this.favorietenSelect.selectedIndex = 0;
        this.modal.classList.add("show");
        (this.shadowRoot!.getElementById("adres1") as HTMLInputElement).focus();
        void this.laadFavorieten();
    }

    public close(): void {
        this.modal.classList.remove("show");
    }
}

customElements.define("rit-create-modal", RitCreateModalComponent);
