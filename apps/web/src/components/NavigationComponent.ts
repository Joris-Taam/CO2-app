import { html } from "@web/helpers/webComponents";
import { AuthService } from "@web/services/AuthService";
import { UserService } from "@web/services/UserService";
import { User } from "@web/Models/Users";

export function navigation(strings: TemplateStringsArray, ...values: unknown[]): HTMLElement {
    return html(strings, ...values);
}

export class NavigationComponent extends HTMLElement {
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        new AuthService().checkAuth();
        void this.render();
    }

    private async render(): Promise<void> {
        if (!this.shadowRoot) {
            return;
        }

        const authService: AuthService = new AuthService();
        const userService: UserService = new UserService();

        const email: string | null = authService.getEmailFromCookie();
        let isAdmin: boolean = false;

        if (email) {
            const user: User = await userService.getByEmail(email);
            isAdmin = ["admin", "afdelingleider", "management"].includes(user.role_name?.toLowerCase() ?? "");
        }

        const style: HTMLStyleElement = document.createElement("style");
        style.textContent = `
            :host {
                display: block;
                font-family: Arial, sans-serif;
            }

            .topbar {
                display: flex;
                justify-content: space-between;
                align-items: center;
                background-color: white;
                padding: 0.8rem 1rem;
                border-bottom: 2px solid #6fcf97;
            }

            .left {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }

            .title {
                font-size: 2rem;
                font-weight: bold;
                letter-spacing: 1px;
            }

            img {
                height: 50px;
            }

            .menu {
                width: 30px;
                cursor: pointer;
                padding: 0.2rem;
            }

            .menu div {
                height: 3px;
                background: black;
                margin: 5px 0;
            }
            .menu img {
                height: 45px;
            }

            .tabs {
                display: flex;
                width: 100%;
                background-color: white;
                border-top: 1px solid #6fcf97;
            }

            .tab {
                flex: 1;
                text-align: center;
                padding: 0.6rem 0;
                font-style: italic;
                color: #1a1a1a;
                border-right: 1px solid #6fcf97;
            }

            .tab:last-child {
                border-right: none;
            }

            .tab a {
                text-decoration: none;
                color: inherit;
            }

            .tab:hover {
                background-color: #dcdcdc;
            }
        `;

        const navigationElement: HTMLElement = navigation`
            <nav>
                <div class="topbar">
                    <div class="left">
                        <img src="/assets/image/logo.png" />
                    </div>

                    ${isAdmin
                ? `
                    <div class="menu">
                        <a href="/AdminReports">
                            <img src="/assets/image/AdminIcon.png" alt="Admin" />
                        </a>
                    </div>
                    `
                : ""}
                </div>

                <div class="tabs">
                    <div class="tab"><a href="/Trip">home</a></div>
                    <div class="tab"><a href="/CreateRide">Rit aanmaken</a></div>
                    <div class="tab"><a href="/UserFaq">FaQ</a></div>
                    <div class="tab"><a href="/Contact">Contact</a></div>
                    <div class="tab"><a href="/AccountSettings">Settings</a></div>

                </div>
            </nav>
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(navigationElement);
    }
}

window.customElements.define("navigation-component", NavigationComponent);
