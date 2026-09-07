class AdminSidebar {
    private sidebarElement: HTMLElement | null = null;
    private navItems: NodeListOf<HTMLElement> | null = null;
    private toggleBtn: HTMLElement | null = null;

    public constructor() {
        // Wait for DOM to be ready before initializing
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", () => this.init());
        }
        else {
            this.init();
        }
    }

    private init(): void {
        this.sidebarElement = document.getElementById("sidebar");
        this.toggleBtn = document.getElementById("menu-toggle");
        this.navItems = document.querySelectorAll(".nav-item");

        this.setupEventListeners();
        console.log("BOPDA4 Admin Sidebar Initialized");
    }

    private setupEventListeners(): void {
        this.toggleBtn?.addEventListener("click", () => {
            this.sidebarElement?.classList.toggle("is-collapsed");
        });
        this.navItems?.forEach(item => {
            item.addEventListener("click", _e => {
                this.handleNavClick(item);
            });
        });
    }

    private handleNavClick(selectedItem: HTMLElement): void {
        this.navItems?.forEach(item => item.classList.remove("active"));

        selectedItem.classList.add("active");

        const linkText: string = selectedItem.querySelector("a")?.textContent.trim() ?? "";

        console.log(`Navigating to: ${linkText}`);
    }

    public updateBadge(index: number, count: string): void {
        const item: HTMLElement | undefined = this.navItems?.[index];

        if (item) {
            console.log(`Updating badge for item ${index} to ${count}`);
        }
    }
}

new AdminSidebar();
