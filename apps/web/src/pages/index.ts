import "@web/components/NavigationComponent";
import "@web/components/WelcomeComponent";

import { WebEvent } from "@web/enums/WebEvent";
import { html } from "@web/helpers/webComponents";
import { WebEventService } from "@web/services/WebEventService";

export class IndexPageComponent extends HTMLElement {
    private _webEventService: WebEventService = new WebEventService();

    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });

        // NOTE: This is just an example event, remove it!
        this._webEventService.addEventListener<string>(WebEvent.Welcome, message => {
            console.log(`Welcome event triggered: ${message}`);
        });

        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const element: HTMLElement = html`
            <div>
                <adsd-navigation></adsd-navigation>

                <div>
                    <h1>
                        Welkom bij Ad SD - Semester 2!
                    </h1>

                    <adsd-welcome></adsd-welcome>
                </div>
            </div>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
    }
}

window.customElements.define("adsd-page-index", IndexPageComponent);
