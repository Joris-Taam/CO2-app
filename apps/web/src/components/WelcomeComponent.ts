import { WebEvent } from "@web/enums/WebEvent";
import { html } from "@web/helpers/webComponents";
import { WebEventService } from "@web/services/WebEventService";
import { WelcomeService } from "@web/services/WelcomeService";

/**
 * This component demonstrates the use of sessions, cookies and Services.
 *
 * @remarks This class should be removed from the final product!
 */
export class WelcomeComponent extends HTMLElement {
    private _webEventService: WebEventService = new WebEventService();
    private _welcomeService: WelcomeService = new WelcomeService();

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const element: HTMLElement = html`
            <div>
                <div id="result"></div>

                <div>
                    <button id="create-session-button">Maak sessie</button>
                    <button id="delete-session-button">Verwijder sessie</button>
                    <button id="public-text-button">Publiek tekst</button>
                    <button id="secret-text-button">Geheime tekst</button>
                </div>
            </div>
        `;

        const resultElement: HTMLElement = element.querySelector("#result")!;
        const createSessionButtonElement: HTMLElement = element.querySelector("#create-session-button")!;
        const deleteSessionButtonElement: HTMLElement = element.querySelector("#delete-session-button")!;
        const publicTextButtonElement: HTMLElement = element.querySelector("#public-text-button")!;
        const secretTextButtonElement: HTMLElement = element.querySelector("#secret-text-button")!;

        createSessionButtonElement.addEventListener("click", async () => {
            const sessionId: string = await this._welcomeService.getSession();

            resultElement.innerHTML = `Je hebt nu een session-cookie met de volgende ID: ${sessionId}`;
        });

        deleteSessionButtonElement.addEventListener("click", async () => {
            await this._welcomeService.deleteSession();

            resultElement.innerHTML = "Je sessie is nu ongeldig!";
        });

        publicTextButtonElement.addEventListener("click", async () => {
            const welcomeText: string = await this._welcomeService.getWelcome();

            this._webEventService.dispatchEvent<string>(WebEvent.Welcome, welcomeText);

            resultElement.innerHTML = welcomeText;
        });

        secretTextButtonElement.addEventListener("click", async () => {
            const secretText: string = await this._welcomeService.getSecret();

            resultElement.innerHTML = secretText;
        });

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
    }
}

window.customElements.define("adsd-welcome", WelcomeComponent);
