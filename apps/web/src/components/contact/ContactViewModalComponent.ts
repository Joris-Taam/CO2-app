import { Contact } from "@web/Models/Contact";

class ContactViewModalComponent extends HTMLElement {
    private overlay!: HTMLDivElement;

    public connectedCallback(): void {
        // Render modal directly into document.body, outside shadow DOM
        this.overlay = document.createElement("div");
        this.overlay.innerHTML = `
            <style>
                .modal-overlay {
                    display: none;
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.5);
                    z-index: 1000;
                    align-items: center;
                    justify-content: center;
                }
                .modal-overlay.show {
                    display: flex;
                }
                .modal-content {
                    background: white;
                    padding: 2rem;
                    border-radius: 12px;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    min-width: 400px;
                    max-width: 600px;
                    width: 100%;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                }
                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 0.5rem;
                }
                .modal-header h2 {
                    margin: 0;
                    color: #3ab07a;
                }
                .modal-close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #888;
                    line-height: 1;
                }
                .modal-close:hover { color: #333; }
                .modal-content label {
                    font-weight: bold;
                    font-size: 0.9rem;
                }
                .modal-content input,
                .modal-content textarea {
                    width: 100%;
                    padding: 0.5rem 0.75rem;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    font-size: 1rem;
                    box-sizing: border-box;
                    background: #f9f9f9;
                }
                .modal-content textarea {
                    min-height: 100px;
                    resize: vertical;
                }
            </style>
            <div class="modal-overlay" id="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Bericht</h2>
                        <button class="modal-close" id="close-message">&times;</button>
                    </div>
                    <label>Datum</label>
                    <input id="contact-date" type="text" readonly />
                    <label>Email</label>
                    <input id="contact-email" type="text" readonly />
                    <label>Naam</label>
                    <input id="contact-name" type="text" readonly />
                    <label>Bericht</label>
                    <textarea id="contact-description" readonly></textarea>
                </div>
            </div>
        `;

        document.body.appendChild(this.overlay);

        this.overlay.querySelector("#close-message")!
            .addEventListener("click", () => this.close());

        // Also close when clicking the dark backdrop
        this.overlay.querySelector("#modal-overlay")!
            .addEventListener("click", (e: Event) => {
                if (e.target === this.overlay.querySelector("#modal-overlay")) {
                    this.close();
                }
            });
    }

    public disconnectedCallback(): void {
        this.overlay.remove();
    }

    public open(contact: Contact): void {
        const d: Date = new Date(contact.created_at);
        d.setHours(d.getHours() + 1);

        (this.overlay.querySelector("#contact-date") as HTMLInputElement).value =
            d.toISOString().substring(0, 16).replace("T", " ");
        (this.overlay.querySelector("#contact-email") as HTMLInputElement).value = contact.email;
        (this.overlay.querySelector("#contact-name") as HTMLInputElement).value = contact.name;
        (this.overlay.querySelector("#contact-description") as HTMLTextAreaElement).value = contact.description;

        this.overlay.querySelector("#modal-overlay")!.classList.add("show");
    }

    public close(): void {
        this.overlay.querySelector("#modal-overlay")!.classList.remove("show");
    }
}

customElements.define("admin-contact-modal", ContactViewModalComponent);
