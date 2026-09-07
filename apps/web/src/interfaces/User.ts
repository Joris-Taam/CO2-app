import { User } from "@web/Models/Users";

export interface IUsersPage {
    loadUsers(): Promise<void>;
    handleCreate(user: User): Promise<void>;
    handleUpdate(oldEmail: string, user: User): Promise<void>;
    handleDelete(email: string): Promise<void>;
}
