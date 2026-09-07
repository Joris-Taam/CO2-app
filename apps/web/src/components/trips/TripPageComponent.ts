import "@web/components/trips/Ritcreatemodalcomponent ";
import "@web/components/trips/TripListComponent";
import "@web/components/NavigationComponent";

class TripPageComponent extends HTMLElement {
    public constructor() {
        super();
    }

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.shadowRoot!.innerHTML = `
            <style>
                .Kop-text {
                    padding: 10px 10px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    color: white;
                    max-width: 1200px;
                    margin-bottom: 20px;
                }

                h1 {
                    font-size: 2.5rem;
                    margin: 0;
                    text-align: center;
                    color: white;
                }

                p {
                    color: white;
                    margin: 5px 0;
                }
            </style>

            <main class="trip-page">
                <section class="Kop-text">
                    <h1>Gegevens per rit</h1>
                    <p>Hier kun je alle gegevens zien van jouw ritten</p>
                    <p>Ingelogd als: <span id="userEmail"></span></p>
                </section>
                <trip-list></trip-list>
            </main>
        `;

        this.setUserEmail();
    }

    private setUserEmail(): void {
        const userEmailElement: HTMLElement | null = this.shadowRoot!.getElementById("userEmail");

        if (userEmailElement) {
            userEmailElement.textContent = this.getEmailFromCookie();
        }
    }

    private getEmailFromCookie(): string {
        const match: RegExpMatchArray | null = document.cookie.match(/(?:^|; )user=([^;]*)/);

        return match ? decodeURIComponent(match[1]) : "";
    }
}

customElements.define("trip-page", TripPageComponent);
