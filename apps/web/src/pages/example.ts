import "@web/components/NavigationComponent";
import "@web/components/WelcomeComponent";

import { html } from "@web/helpers/webComponents";

class ExamplePageComponent extends HTMLElement {
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
                <adsd-navigation></adsd-navigation>

                <div>
                    <h1>
                        Welkom bij Ad SD - Semester 2!
                    </h1>

                    <p>
                        Dit is example.html!
                    </p>
                </div>
            </div>
        `;

        this.shadowRoot.firstChild?.remove();
        this.shadowRoot.append(element);
    }
}

window.customElements.define("adsd-page-example", ExamplePageComponent);
