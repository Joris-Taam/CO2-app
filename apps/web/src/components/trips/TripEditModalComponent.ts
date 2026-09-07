import { Rit, RitInput, SoortRit, SoortVoertuig, Brandstof } from "../../interfaces/TripInterface";

class TripEditModalComponent extends HTMLElement {
    private modal!: HTMLElement;
    private form!: HTMLFormElement;

    private adres1Input!: HTMLInputElement;
    private adres2Input!: HTMLInputElement;
    private kilometersInput!: HTMLInputElement;
    private soortRitSelect!: HTMLSelectElement;
    private soortVoertuigSelect!: HTMLSelectElement;
    private brandstofSelect!: HTMLSelectElement;

    private errorSpan!: HTMLSpanElement;
    private currentRitDate: string | null = null;

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.innerHTML = `
            <style>
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                :host {
                    --color-primary:      #42ba82;
                    --color-primary-dark: #2e9e6b;
                    --color-white:        #ffffff;
                    --color-surface:      #e6e6e6;
                    --color-border:       #d0d0d0;
                    --color-text:         #2c2c2c;
                    --color-text-muted:   #6b6b6b;
                    --color-danger:       #e05252;
                    --radius-md: 8px;
                    --radius-lg: 12px;
                    --shadow-lg: 0px 6px 10px rgba(0, 0, 0, 0.2);
                    --transition: 0.3s ease;
                    font-family: Arial, Helvetica, sans-serif;
                    font-size: 16px;
                }

                .overlay {
                    display: none;
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(2px);
                    z-index: 1000;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                    animation: fadeIn 0.2s ease;
                }

                .overlay.show { display: flex; }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                .modal-content {
                    background: var(--color-white);
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-lg);
                    padding: 2rem;
                    width: 100%;
                    max-width: 500px;
                    position: relative;
                    animation: slideUp 0.25s ease;
                    box-shadow: var(--shadow-lg);
                }

                .modal-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 1.5rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid var(--color-border);
                }

                .modal-header h2 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: var(--color-primary-dark);
                    margin: 0;
                }

                .close-btn {
                    background: none;
                    border: 1px solid var(--color-border);
                    color: var(--color-text-muted);
                    cursor: pointer;
                    width: 32px;
                    height: 32px;
                    border-radius: var(--radius-md);
                    font-size: 1.1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background var(--transition), color var(--transition);
                }

                .close-btn:hover {
                    background: var(--color-surface);
                    color: var(--color-text);
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.35rem;
                }

                .form-group.full { grid-column: 1 / -1; }

                label {
                    font-size: 0.875rem;
                    font-weight: 600;
                    color: var(--color-text);
                }

                input, select {
                    width: 100%;
                    padding: 10px 14px;
                    font-family: inherit;
                    font-size: 0.875rem;
                    color: var(--color-text);
                    background: var(--color-white);
                    border: 1px solid var(--color-border);
                    border-radius: var(--radius-md);
                    outline: none;
                    transition: border-color var(--transition), box-shadow var(--transition);
                }

                input:focus, select:focus {
                    border-color: var(--color-primary);
                    box-shadow: 0 0 0 3px rgba(66, 186, 130, 0.2);
                }

                .field-error {
                    font-size: 0.75rem;
                    color: var(--color-danger);
                    min-height: 1em;
                }

                .form-footer {
                    margin-top: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
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
                    font-size: 0.875rem;
                    font-weight: 600;
                    padding: 10px 20px;
                    width: 100%;
                    transition: background var(--transition);
                }

                .btn-primary:hover { background: var(--color-primary-dark); }
            </style>

            <div class="overlay" id="edit-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Rit Wijzigen</h2>
                        <button class="close-btn" id="close-edit">&times;</button>
                    </div>
                    <form id="edit-rit-form" novalidate>
                        <div class="form-grid">
                            <div class="form-group full">
                                <label for="adres1">Vertrekadres</label>
                                <input type="text" id="adres1" required />
                                <span class="field-error" id="form-error"></span>
                            </div>
                            <div class="form-group full">
                                <label for="adres2">Bestemming</label>
                                <input type="text" id="adres2" required />
                            </div>
                            <div class="form-group">
                                <label for="kilometers">Afstand (km)</label>
                                <input type="number" id="kilometers" step="0.1" required />
                            </div>
                            <div class="form-group">
                                <label for="soortRit">Type Rit</label>
                                <select id="soortRit">
                                    <option value="zakelijk">Zakelijk</option>
                                    <option value="prive">Privé</option>
                                    <option value="woon-werk">Woon-werk</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="soortVoertuig">Voertuig</label>
                                <select id="soortVoertuig">
                                    <option value="auto">Auto</option>
                                    <option value="motor">Motor</option>
                                    <option value="fiets">Fiets</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="brandstof">Brandstof</label>
                                <select id="brandstof">
                                    <option value="benzine">Benzine</option>
                                    <option value="diesel">Diesel</option>
                                    <option value="elektrisch">Elektrisch</option>
                                    <option value="hybride">Hybride</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-footer">
                            <button type="submit" class="btn-primary">Opslaan</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        this.setupElements();
        this.setupEventListeners();
    }

    private setupElements(): void {
        const s: ShadowRoot = this.shadowRoot!;
        this.modal = s.getElementById("edit-overlay") as HTMLElement;
        this.form = s.getElementById("edit-rit-form") as HTMLFormElement;
        this.adres1Input = s.getElementById("adres1") as HTMLInputElement;
        this.adres2Input = s.getElementById("adres2") as HTMLInputElement;
        this.kilometersInput = s.getElementById("kilometers") as HTMLInputElement;
        this.soortRitSelect = s.getElementById("soortRit") as HTMLSelectElement;
        this.soortVoertuigSelect = s.getElementById("soortVoertuig") as HTMLSelectElement;
        this.brandstofSelect = s.getElementById("brandstof") as HTMLSelectElement;
        this.errorSpan = s.getElementById("form-error") as HTMLSpanElement;
    }

    public open(rit: Rit): void {
        this.currentRitDate = rit.createdAt;
        this.adres1Input.value = rit.adres1;
        this.adres2Input.value = rit.adres2;
        this.kilometersInput.value = rit.kilometers.toString();
        this.soortRitSelect.value = rit.soortRit;
        this.soortVoertuigSelect.value = rit.soortVoertuig;
        this.brandstofSelect.value = rit.brandstof;
        this.errorSpan.textContent = "";
        this.modal.classList.add("show");
    }

    public close(): void {
        this.modal.classList.remove("show");
        this.currentRitDate = null;
    }

    private setupEventListeners(): void {
        this.shadowRoot!.getElementById("close-edit")!.onclick = () => this.close();

        this.modal.onclick = (e: Event) => {
            if (e.target === this.modal) {
                this.close();
            }
        };

        this.form.onsubmit = (e: Event) => {
            e.preventDefault();
            this.handleSubmit();
        };
    }

    private handleSubmit(): void {
        const updatedRit: RitInput = {
            createdAt: this.currentRitDate || new Date().toISOString(),
            adres1: this.adres1Input.value.trim(),
            adres2: this.adres2Input.value.trim(),
            kilometers: parseFloat(this.kilometersInput.value),
            soortRit: this.soortRitSelect.value as SoortRit,
            soortVoertuig: this.soortVoertuigSelect.value as SoortVoertuig,
            brandstof: this.brandstofSelect.value as Brandstof,
        };

        if (!updatedRit.adres1 || !updatedRit.adres2 || isNaN(updatedRit.kilometers)) {
            this.setError("Vul alle velden correct in.");

            return;
        }

        this.dispatchEvent(new CustomEvent("rit-edit-submit", {
            detail: updatedRit,
            bubbles: true,
            composed: true,
        }));
    }

    public setError(msg: string): void {
        this.errorSpan.textContent = msg;
    }
}

customElements.define("rit-edit-modal", TripEditModalComponent);
