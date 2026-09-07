import { Role } from "@web/Models/Roles";

export interface IRolesTable extends HTMLElement {
    render(roles: Role[]): void;
}

export interface IRoleCreateModal extends HTMLElement {
    open(): void;
    close(): void;
    setError(msg: string): void;
}

export interface IRoleEditModal extends HTMLElement {
    open(role: Role): void;
    close(): void;
    setError(msg: string): void;
}
