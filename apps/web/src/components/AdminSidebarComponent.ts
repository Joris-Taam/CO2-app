import "@hboictcloud/metadata";
import { AuthService } from "@web/services/AuthService";
import { UserService } from "@web/services/UserService";
import { User } from "@web/Models/Users";

const authService: AuthService = new AuthService();
const userService: UserService = new UserService();

export class AdminSidebarComponent extends HTMLElement {
    public constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    public connectedCallback(): void {
        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }

        const style: HTMLStyleElement = document.createElement("style");
        style.textContent = `
            :host {
                display: block;
            }

            .sidebar {
                width: 240px;
                height: 100vh;
                background: white;
                border-right: 2px solid #6fcf97;
                display: flex;
                flex-direction: column;
                position: fixed;   
                left: 0;
                top: 0;
                transition: width 0.3s ease;
            }

            .sidebar.collapsed {
                width: 70px;
            }

            .sidebar-top {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0.8rem 1rem;
                border-bottom: 2px solid #6fcf97;
            }

            .brand {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .logo-img {
                height: 35px;
                transition: opacity 0.2s, width 0.2s, height 0.2s;
            }

            .brand-name {
                font-size: 1.5rem;
                font-weight: bold;
                transition: opacity 0.2s, width 0.2s;
            }

            /* COLLAPSED STATE */
            .sidebar.collapsed .logo-img {
                opacity: 0;
                width: 0;
                height: 0;
            }

            .sidebar.collapsed .brand-name {
                opacity: 0;
                width: 0;
                overflow: hidden;
            }

            .menu-toggle {
                cursor: pointer;
                background: none;
                border: none;
            }

            .menu-toggle span {
                display: block;
                width: 20px;
                height: 3px;
                background: black;
                margin: 4px 0;
            }

            .nav-grid {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .nav-item {
                border-bottom: 1px solid #6fcf97;
                text-align: center;
                padding: 0.7rem;
                font-style: italic;
                transition: all 0.2s;
            }

            .nav-item a {
                text-decoration: none;
                color: #1a1a1a;
            }

            .nav-item:hover {
                background-color: #dcdcdc;
            }

            .sidebar.collapsed .nav-grid {
                display: none;
            }

            .sidebar-bottom {
                margin-top: auto;
                border-top: 2px solid #6fcf97;
                padding: 0.8rem 1rem;
                display: flex;
                flex-direction: column;
                gap: 0.4rem;
            }

            .sidebar.collapsed .sidebar-bottom {
                display: none;
            }

            .user-name {
                font-weight: bold;
                font-size: 0.95rem;
                color: #1a1a1a;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .user-email {
                font-size: 0.8rem;
                color: #555;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }

            .user-role {
                font-size: 0.8rem;
                color: #6fcf97;
                font-style: italic;
            }

            .logout-btn {
                margin-top: 0.4rem;
                padding: 0.4rem 0.8rem;
                background-color: #3867e9;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 0.85rem;
                transition: background-color 0.2s;
            }
        `;

        const template: HTMLDivElement = document.createElement("div");
        template.innerHTML = `
            <nav class="sidebar" id="sidebar">
                <div class="sidebar-top">
                    <div class="brand">
                        <img src="/assets/image/logo.png" class="logo-img" />
                    </div>

                    <button class="menu-toggle" id="menu-toggle">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>

                <ul class="nav-grid">
                    <li class="nav-item"><a href="/Trip"><span>Home</span></a></li>
                    <li class="nav-item"><a href="/AdminReports"><span>Rapportage</span></a></li>
                    <li class="nav-item"><a href="/AdminUser"><span>Gebruikers</span></a></li>
                    <li class="nav-item"><a href="/AdminContact"><span>Contact</span></a></li>
                    <li class="nav-item"><a href="/AdminFaq"><span>FAQ</span></a></li>
                    <li class="nav-item"><a href="/AdminRoles"><span>Rollen</span></a></li>
                    <li class="nav-item"><a href="/VehicleOverview"><span>Voertuigen</span></a></li>
                    <li class="nav-item"><a href="/Reservation"><span>Reserveringen</span></a></li>
                    <li class="nav-item"><a href="/AccountSettings"><span>Settings</span></a></li>
                </ul>

                <div class="sidebar-bottom">
                    <span class="user-name" id="user-name">...</span>
                    <span class="user-email" id="user-email">...</span>
                    <span class="user-role" id="user-role">...</span>
                    <button class="logout-btn" id="logout-btn">Uitloggen</button>
                </div>
            </nav>
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(template);

        this.attachEvents();
        void this.loadUser();
    }

    private async loadUser(): Promise<void> {
        const email: string | null = authService.getEmailFromCookie();

        if (!email) {
            return;
        }

        const user: User = await userService.getByEmail(email);

        const nameEl: Element | null | undefined = this.shadowRoot?.querySelector("#user-name");
        const emailEl: Element | null | undefined = this.shadowRoot?.querySelector("#user-email");
        const roleEl: Element | null | undefined = this.shadowRoot?.querySelector("#user-role");

        if (nameEl) {
            nameEl.textContent = user.name;
        }

        if (emailEl) {
            emailEl.textContent = user.email;
        }

        if (roleEl) {
            roleEl.textContent = user.role_name ?? "Geen rol";
        }
    }

    private attachEvents(): void {
        const toggle: Element | null | undefined = this.shadowRoot?.querySelector("#menu-toggle");
        const sidebar: Element | null | undefined = this.shadowRoot?.querySelector("#sidebar");
        const logoutBtn: Element | null | undefined = this.shadowRoot?.querySelector("#logout-btn");

        toggle?.addEventListener("click", () => {
            sidebar?.classList.toggle("collapsed");

            if (sidebar?.classList.contains("collapsed")) {
                document.body.classList.add("sidebar-collapsed");
            }
            else {
                document.body.classList.remove("sidebar-collapsed");
            }
        });

        logoutBtn?.addEventListener("click", async () => {
            await authService.logout();
            window.location.href = "/login.html";
        });
    }
}

window.customElements.define("admin-sidebar", AdminSidebarComponent);
